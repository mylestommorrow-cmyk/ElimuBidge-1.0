-- ==============================================================================
-- ELIMUBRIDGE KENYA COMPETENCY-BASED EDUCATION (CBE)
-- SUPABASE POSTGRESQL ARCHITECTURE & ROW LEVEL SECURITY (RLS)
-- Covers: PP1, PP2, Grades 1-12 (Playgroup, Early Years, Primary, Junior, Senior)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. ENUMS & DOMAINS
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('student', 'teacher', 'school_admin', 'platform_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE education_level_type AS ENUM (
        'playgroup',
        'early_years',     -- PP1, PP2
        'lower_primary',   -- Grades 1-3
        'upper_primary',   -- Grades 4-6
        'junior_school',   -- Grades 7-9
        'senior_school'    -- Grades 10-12
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE senior_pathway_type AS ENUM (
        'STEM',
        'Social Sciences',
        'Arts and Sports Science'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE learning_mode_type AS ENUM ('school', 'independent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resource_type_enum AS ENUM (
        'notes',
        'digital_lesson',
        'pdf',
        'video',
        'worksheet',
        'homework',
        'practical'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assessment_type_enum AS ENUM (
        'quiz',
        'assignment',
        'project',
        'practical',
        'rubric_eval'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE competency_rating_enum AS ENUM (
        'introduced',
        'practised',
        'demonstrated',
        'requires_support'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_status_type AS ENUM ('active', 'pending', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. CORE TABLES
-- ==============================================================================

-- 3.1 PROFILES (One-to-one with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL DEFAULT 'Elimu Learner',
    email TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'school_admin', 'platform_admin')),
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3.2 SCHOOLS (Institutional tenancy)
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    county TEXT,
    sub_county TEXT,
    level_type TEXT DEFAULT 'comprehensive' CHECK (level_type IN ('early_years', 'primary', 'junior_school', 'senior_school', 'comprehensive', 'all')),
    logo_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    is_verified BOOLEAN DEFAULT true NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3.3 SCHOOL MEMBERSHIPS (Staff, Teachers & Enrolled Students)
CREATE TABLE IF NOT EXISTS public.school_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'school_admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
    assigned_class TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT unique_school_user_membership UNIQUE (school_id, user_id)
);

-- 3.4 LEARNERS (Student profiles for both School and Independent modes)
CREATE TABLE IF NOT EXISTS public.learners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL, -- NULL indicates independent mode
    admission_number TEXT,
    grade_level TEXT NOT NULL, -- 'Playgroup', 'PP1', 'PP2', 'Grade 1' .. 'Grade 12'
    education_level TEXT NOT NULL, -- 'playgroup', 'early_years', 'lower_primary', 'upper_primary', 'junior_school', 'senior_school'
    pathway TEXT CHECK (pathway IN ('STEM', 'Social Sciences', 'Arts and Sports Science', NULL)),
    mode TEXT NOT NULL DEFAULT 'independent' CHECK (mode IN ('school', 'independent')),
    guardian_name TEXT,
    guardian_phone TEXT,
    streak_days INTEGER DEFAULT 0 NOT NULL,
    completed_topics_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3.5 SUBJECTS (Official KICD Curriculum Learning Areas)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    education_level TEXT NOT NULL, -- 'playgroup', 'early_years', 'lower_primary', 'upper_primary', 'junior_school', 'senior_school'
    grade_level TEXT NOT NULL,    -- 'PP1', 'PP2', 'Grade 1' .. 'Grade 12'
    pathway TEXT,                -- 'STEM', 'Social Sciences', 'Arts and Sports Science'
    is_core BOOLEAN DEFAULT true NOT NULL,
    description TEXT,
    icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT unique_grade_subject_code UNIQUE (grade_level, code)
);

-- 3.6 LEARNING RESOURCES (Notes, Digital Lessons, PDFs, Videos, Worksheets, Homework)
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE, -- NULL for public/national curriculum, non-null for school-private notes
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('notes', 'digital_lesson', 'pdf', 'video', 'worksheet', 'homework', 'practical')),
    grade_level TEXT NOT NULL,
    strand TEXT,
    sub_strand TEXT,
    file_url TEXT,
    content_text TEXT,
    is_public BOOLEAN DEFAULT false NOT NULL, -- true for independent & public curriculum
    verification_status TEXT DEFAULT 'approved' CHECK (verification_status IN ('draft', 'pending_review', 'verified', 'approved')),
    source_document TEXT DEFAULT 'KICD Curriculum Design',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3.7 ASSESSMENTS (CBE Quizzes, Assignments, Projects, Practicals & Rubric Evaluations)
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE, -- NULL for public independent practice assessments
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    instructions TEXT,
    grade_level TEXT NOT NULL,
    strand TEXT,
    sub_strand TEXT,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN ('quiz', 'assignment', 'project', 'practical', 'rubric_eval')),
    total_points NUMERIC DEFAULT 100,
    rubric_schema JSONB DEFAULT '[]'::jsonb,
    due_date TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3.8 SUBMISSIONS (Learner coursework, submissions, grades & rubric feedback)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES public.learners(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    submitted_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    file_url TEXT,
    answer_payload JSONB DEFAULT '{}'::jsonb,
    score NUMERIC,
    rubric_evaluation JSONB DEFAULT '{}'::jsonb,
    competency_level TEXT CHECK (competency_level IN ('introduced', 'practised', 'demonstrated', 'requires_support', NULL)),
    teacher_feedback TEXT,
    graded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ
);

-- 3.9 COMPETENCY EVALUATIONS (Rubric Bands EE, ME, AE, BE & Specific Learning Outcomes)
CREATE TABLE IF NOT EXISTS public.competency_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id UUID NOT NULL REFERENCES public.learners(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    outcome_code TEXT NOT NULL,
    outcome_title TEXT NOT NULL,
    learning_area TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    cbe_stage TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('introduced', 'practised', 'demonstrated', 'requires_support')),
    rubric_band TEXT CHECK (rubric_band IN ('Exceeding Expectations', 'Meeting Expectations', 'Approaching Expectations', 'Below Expectations', 'EE', 'ME', 'AE', 'BE')),
    evidence_notes TEXT,
    evaluated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    evaluated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3.10 COURSEWORK ASSIGNMENTS & SUBMISSIONS VIEWS / ALIASES
CREATE OR REPLACE VIEW public.coursework_assignments AS
    SELECT * FROM public.assessments;

CREATE OR REPLACE VIEW public.coursework_submissions AS
    SELECT * FROM public.submissions;

-- ==============================================================================
-- 4. PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_schools_code ON public.schools(code);
CREATE INDEX IF NOT EXISTS idx_school_memberships_school ON public.school_memberships(school_id);
CREATE INDEX IF NOT EXISTS idx_school_memberships_user ON public.school_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_learners_user ON public.learners(user_id);
CREATE INDEX IF NOT EXISTS idx_learners_school ON public.learners(school_id);
CREATE INDEX IF NOT EXISTS idx_learners_grade ON public.learners(grade_level);
CREATE INDEX IF NOT EXISTS idx_subjects_grade_level ON public.subjects(grade_level);
CREATE INDEX IF NOT EXISTS idx_subjects_education_level ON public.subjects(education_level);
CREATE INDEX IF NOT EXISTS idx_resources_grade_strand ON public.learning_resources(grade_level, strand);
CREATE INDEX IF NOT EXISTS idx_resources_school ON public.learning_resources(school_id);
CREATE INDEX IF NOT EXISTS idx_resources_is_public ON public.learning_resources(is_public);
CREATE INDEX IF NOT EXISTS idx_assessments_school ON public.assessments(school_id);
CREATE INDEX IF NOT EXISTS idx_assessments_grade ON public.assessments(grade_level);
CREATE INDEX IF NOT EXISTS idx_submissions_assessment ON public.submissions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_learner ON public.submissions(learner_id);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 5.1 HELPER FUNCTIONS FOR SECURITY CHECKS
CREATE OR REPLACE FUNCTION public.is_platform_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = check_user_id AND role = 'platform_admin'
    );
$$;

CREATE OR REPLACE FUNCTION public.has_school_role(check_school_id UUID, check_user_id UUID, allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT public.is_platform_admin(check_user_id) OR EXISTS (
        SELECT 1 FROM public.school_memberships
        WHERE school_id = check_school_id 
          AND user_id = check_user_id 
          AND status = 'active'
          AND role = ANY(allowed_roles)
    );
$$;

-- 5.2 POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
CREATE POLICY "Public profiles read"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        id = auth.uid() OR
        public.is_platform_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.school_memberships sm1
            JOIN public.school_memberships sm2 ON sm1.school_id = sm2.school_id
            WHERE sm1.user_id = auth.uid() AND sm2.user_id = profiles.id
        )
    );

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid() OR public.is_platform_admin(auth.uid()))
    WITH CHECK (id = auth.uid() OR public.is_platform_admin(auth.uid()));

-- 5.3 POLICIES FOR SCHOOLS
DROP POLICY IF EXISTS "Anyone authenticated can view schools" ON public.schools;
CREATE POLICY "Anyone authenticated can view schools"
    ON public.schools FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can insert schools" ON public.schools;
CREATE POLICY "Admins can insert schools"
    ON public.schools FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "School admin can update own school" ON public.schools;
CREATE POLICY "School admin can update own school"
    ON public.schools FOR UPDATE
    TO authenticated
    USING (public.has_school_role(id, auth.uid(), ARRAY['school_admin']));

-- 5.4 POLICIES FOR SCHOOL MEMBERSHIPS
DROP POLICY IF EXISTS "View school memberships" ON public.school_memberships;
CREATE POLICY "View school memberships"
    ON public.school_memberships FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR 
        public.has_school_role(school_id, auth.uid(), ARRAY['school_admin', 'teacher'])
    );

DROP POLICY IF EXISTS "Join school or school admin add member" ON public.school_memberships;
CREATE POLICY "Join school or school admin add member"
    ON public.school_memberships FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() OR 
        public.has_school_role(school_id, auth.uid(), ARRAY['school_admin'])
    );

DROP POLICY IF EXISTS "School admins manage memberships" ON public.school_memberships;
CREATE POLICY "School admins manage memberships"
    ON public.school_memberships FOR UPDATE
    TO authenticated
    USING (public.has_school_role(school_id, auth.uid(), ARRAY['school_admin']));

-- 5.5 POLICIES FOR LEARNERS
DROP POLICY IF EXISTS "Learner profile view" ON public.learners;
CREATE POLICY "Learner profile view"
    ON public.learners FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR 
        (school_id IS NOT NULL AND public.has_school_role(school_id, auth.uid(), ARRAY['school_admin', 'teacher']))
    );

DROP POLICY IF EXISTS "Learner profile insert" ON public.learners;
CREATE POLICY "Learner profile insert"
    ON public.learners FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid() OR public.is_platform_admin(auth.uid()));

DROP POLICY IF EXISTS "Learner profile update" ON public.learners;
CREATE POLICY "Learner profile update"
    ON public.learners FOR UPDATE
    TO authenticated
    USING (
        user_id = auth.uid() OR 
        (school_id IS NOT NULL AND public.has_school_role(school_id, auth.uid(), ARRAY['school_admin', 'teacher']))
    );

-- 5.6 POLICIES FOR SUBJECTS
DROP POLICY IF EXISTS "Anyone authenticated can view curriculum subjects" ON public.subjects;
CREATE POLICY "Anyone authenticated can view curriculum subjects"
    ON public.subjects FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Platform admin can manage subjects" ON public.subjects;
CREATE POLICY "Platform admin can manage subjects"
    ON public.subjects FOR ALL
    TO authenticated
    USING (public.is_platform_admin(auth.uid()));

-- 5.7 POLICIES FOR LEARNING RESOURCES
-- Independent learners access public/curriculum materials (is_public = true or school_id is null)
-- School learners & teachers access their school-specific materials or public materials
DROP POLICY IF EXISTS "Read learning resources" ON public.learning_resources;
CREATE POLICY "Read learning resources"
    ON public.learning_resources FOR SELECT
    TO authenticated
    USING (
        is_public = true OR 
        school_id IS NULL OR 
        (school_id IS NOT NULL AND public.has_school_role(school_id, auth.uid(), ARRAY['student', 'teacher', 'school_admin']))
    );

DROP POLICY IF EXISTS "Teachers and Admins create resources" ON public.learning_resources;
CREATE POLICY "Teachers and Admins create resources"
    ON public.learning_resources FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_platform_admin(auth.uid()) OR
        (school_id IS NOT NULL AND public.has_school_role(school_id, auth.uid(), ARRAY['teacher', 'school_admin']))
    );

DROP POLICY IF EXISTS "Teachers and Admins update own resources" ON public.learning_resources;
CREATE POLICY "Teachers and Admins update own resources"
    ON public.learning_resources FOR UPDATE
    TO authenticated
    USING (
        public.is_platform_admin(auth.uid()) OR
        created_by = auth.uid() OR
        (school_id IS NOT NULL AND public.has_school_role(school_id, auth.uid(), ARRAY['school_admin']))
    );

-- 5.8 POLICIES FOR ASSESSMENTS
DROP POLICY IF EXISTS "Read assessments" ON public.assessments;
CREATE POLICY "Read assessments"
    ON public.assessments FOR SELECT
    TO authenticated
    USING (
        school_id IS NULL OR 
        public.has_school_role(school_id, auth.uid(), ARRAY['student', 'teacher', 'school_admin'])
    );

DROP POLICY IF EXISTS "Teachers and Admins create assessments" ON public.assessments;
CREATE POLICY "Teachers and Admins create assessments"
    ON public.assessments FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_platform_admin(auth.uid()) OR
        (school_id IS NOT NULL AND public.has_school_role(school_id, auth.uid(), ARRAY['teacher', 'school_admin']))
    );

DROP POLICY IF EXISTS "Teachers and Admins update assessments" ON public.assessments;
CREATE POLICY "Teachers and Admins update assessments"
    ON public.assessments FOR UPDATE
    TO authenticated
    USING (
        public.is_platform_admin(auth.uid()) OR
        created_by = auth.uid() OR
        (school_id IS NOT NULL AND public.has_school_role(school_id, auth.uid(), ARRAY['school_admin']))
    );

-- 5.9 POLICIES FOR SUBMISSIONS
DROP POLICY IF EXISTS "Learners view own submissions or teachers view class submissions" ON public.submissions;
CREATE POLICY "Learners view own submissions or teachers view class submissions"
    ON public.submissions FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.assessments a
            WHERE a.id = submissions.assessment_id
              AND a.school_id IS NOT NULL
              AND public.has_school_role(a.school_id, auth.uid(), ARRAY['teacher', 'school_admin'])
        )
    );

DROP POLICY IF EXISTS "Learners create own submissions" ON public.submissions;
CREATE POLICY "Learners create own submissions"
    ON public.submissions FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can grade submissions or students update before grading" ON public.submissions;
CREATE POLICY "Teachers can grade submissions or students update before grading"
    ON public.submissions FOR UPDATE
    TO authenticated
    USING (
        (user_id = auth.uid() AND graded_at IS NULL) OR
        EXISTS (
            SELECT 1 FROM public.assessments a
            WHERE a.id = submissions.assessment_id
              AND a.school_id IS NOT NULL
              AND public.has_school_role(a.school_id, auth.uid(), ARRAY['teacher', 'school_admin'])
        )
    );

-- 5.10 POLICIES FOR COMPETENCY EVALUATIONS
ALTER TABLE public.competency_evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Learner view own evaluations or teacher view class evaluations" ON public.competency_evaluations;
CREATE POLICY "Learner view own evaluations or teacher view class evaluations"
    ON public.competency_evaluations FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        public.is_platform_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.learners l
            WHERE l.id = competency_evaluations.learner_id
              AND l.school_id IS NOT NULL
              AND public.has_school_role(l.school_id, auth.uid(), ARRAY['teacher', 'school_admin'])
        )
    );

DROP POLICY IF EXISTS "Teachers and Admins manage competency evaluations" ON public.competency_evaluations;
CREATE POLICY "Teachers and Admins manage competency evaluations"
    ON public.competency_evaluations FOR ALL
    TO authenticated
    USING (
        user_id = auth.uid() OR
        public.is_platform_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.learners l
            WHERE l.id = competency_evaluations.learner_id
              AND l.school_id IS NOT NULL
              AND public.has_school_role(l.school_id, auth.uid(), ARRAY['teacher', 'school_admin'])
        )
    );

-- ==============================================================================
-- 6. AUTOMATIC AUTH PROFILE CREATION TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    default_role TEXT;
    user_name TEXT;
BEGIN
    user_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1), 'Elimu Learner');
    default_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    IF default_role NOT IN ('student', 'teacher', 'school_admin', 'platform_admin') THEN
        default_role := 'student';
    END IF;

    INSERT INTO public.profiles (id, display_name, email, role, avatar_url)
    VALUES (NEW.id, user_name, NEW.email, default_role, NEW.raw_user_meta_data->>'avatar_url')
    ON CONFLICT (id) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        email = EXCLUDED.email,
        updated_at = TIMEZONE('utc', NOW());

    -- Create initial learner profile if role is student
    IF default_role = 'student' THEN
        INSERT INTO public.learners (user_id, grade_level, education_level, mode)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'grade_level', 'Grade 7'),
            COALESCE(NEW.raw_user_meta_data->>'education_level', 'junior_school'),
            COALESCE(NEW.raw_user_meta_data->>'mode', 'independent')
        )
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 7. OFFICIAL SEED DATA: KENYA CBE CORE SUBJECTS & DEMO SCHOOL
-- ==============================================================================

-- Seed Demo School
INSERT INTO public.schools (id, code, name, county, sub_county, level_type, is_verified)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'ELIMU-001', 'Nairobi Pioneer Academy', 'Nairobi', 'Westlands', 'comprehensive', true),
    ('a0000000-0000-0000-0000-000000000002', 'ELIMU-002', 'Mombasa Coastal High School', 'Mombasa', 'Nyali', 'senior_school', true)
ON CONFLICT (code) DO NOTHING;

-- Seed Playgroup & Early Years (PP1, PP2)
INSERT INTO public.subjects (code, name, education_level, grade_level, is_core, description)
VALUES 
    ('EY-LANG-PP1', 'Language Activities', 'early_years', 'PP1', true, 'Listening, speaking, pre-reading and emergent writing'),
    ('EY-MATH-PP1', 'Mathematical Activities', 'early_years', 'PP1', true, 'Number concepts, sorting, shapes and pattern recognition'),
    ('EY-ENV-PP1', 'Environmental Activities', 'early_years', 'PP1', true, 'Exploring local surroundings, self and family'),
    ('EY-PSY-PP1', 'Psychomotor and Creative Activities', 'early_years', 'PP1', true, 'Physical coordination, art, music and movement'),
    ('EY-CRE-PP1', 'Religious Education (CRE/IRE/HRE)', 'early_years', 'PP1', true, 'Foundational moral and spiritual values'),
    ('EY-LANG-PP2', 'Language Activities', 'early_years', 'PP2', true, 'Reading readiness, phonemic awareness and storytelling'),
    ('EY-MATH-PP2', 'Mathematical Activities', 'early_years', 'PP2', true, 'Counting, basic grouping and spatial orientation')
ON CONFLICT (grade_level, code) DO NOTHING;

-- Seed Lower Primary (Grades 1-3)
INSERT INTO public.subjects (code, name, education_level, grade_level, is_core, description)
VALUES 
    ('LP-LIT-G1', 'Indigenous Language Activities', 'lower_primary', 'Grade 1', true, 'Mother tongue literacy and oral expression'),
    ('LP-ENG-G1', 'English Language Activities', 'lower_primary', 'Grade 1', true, 'Phonics, vocabulary, basic comprehension'),
    ('LP-KIS-G1', 'Kiswahili Language Activities', 'lower_primary', 'Grade 1', true, 'Kusikiliza, kuongea, kusoma na kuandika'),
    ('LP-MAT-G1', 'Mathematical Activities', 'lower_primary', 'Grade 1', true, 'Whole numbers, addition, subtraction and measurement'),
    ('LP-ENV-G1', 'Environmental Activities', 'lower_primary', 'Grade 1', true, 'Natural environment, weather, health and hygiene'),
    ('LP-HYG-G1', 'Hygiene and Nutrition Activities', 'lower_primary', 'Grade 1', true, 'Food hygiene, clean habits, water safety'),
    ('LP-CRE-G1', 'Religious Education', 'lower_primary', 'Grade 1', true, 'Character and spiritual formation'),
    ('LP-MOV-G1', 'Movement and Creative Activities', 'lower_primary', 'Grade 1', true, 'Active games, crafts, music and play')
ON CONFLICT (grade_level, code) DO NOTHING;

-- Seed Upper Primary (Grades 4-6)
INSERT INTO public.subjects (code, name, education_level, grade_level, is_core, description)
VALUES 
    ('UP-ENG-G4', 'English Language', 'upper_primary', 'Grade 4', true, 'Reading fluency, grammar, guided composition'),
    ('UP-KIS-G4', 'Kiswahili', 'upper_primary', 'Grade 4', true, 'Sarufi, usomaji na utungaji'),
    ('UP-MAT-G4', 'Mathematics', 'upper_primary', 'Grade 4', true, 'Fractions, decimals, geometry, data representation'),
    ('UP-SCI-G4', 'Science and Technology', 'upper_primary', 'Grade 4', true, 'Living things, simple machines, digital literacy'),
    ('UP-AGR-G4', 'Agriculture and Nutrition', 'upper_primary', 'Grade 4', true, 'Soil conservation, crop growing, balanced nutrition'),
    ('UP-SOC-G4', 'Social Studies', 'upper_primary', 'Grade 4', true, 'Physical environment, culture, governance, citizenship'),
    ('UP-CRE-G4', 'Christian Religious Education', 'upper_primary', 'Grade 4', true, 'Biblical teachings and modern life applications'),
    ('UP-ART-G4', 'Creative Arts', 'upper_primary', 'Grade 4', true, 'Visual arts, performing arts and physical education')
ON CONFLICT (grade_level, code) DO NOTHING;

-- Seed Junior School (Grades 7-9)
INSERT INTO public.subjects (code, name, education_level, grade_level, is_core, description)
VALUES 
    ('JS-ENG-G7', 'English', 'junior_school', 'Grade 7', true, 'Grammar, functional writing, oral skills, literature in English'),
    ('JS-KIS-G7', 'Kiswahili', 'junior_school', 'Grade 7', true, 'Lugha na Fasihi simulizi'),
    ('JS-MAT-G7', 'Mathematics', 'junior_school', 'Grade 7', true, 'Algebra, geometry, statistics, financial literacy'),
    ('JS-INT-G7', 'Integrated Science', 'junior_school', 'Grade 7', true, 'Physics, chemistry and biology introductory scientific inquiry'),
    ('JS-AGR-G7', 'Agriculture and Nutrition', 'junior_school', 'Grade 7', true, 'Crop production, animal rearing and culinary science'),
    ('JS-SOC-G7', 'Social Studies', 'junior_school', 'Grade 7', true, 'African geography, Kenyan history, constitution, peace studies'),
    ('JS-PRE-G7', 'Pre-Technical Studies', 'junior_school', 'Grade 7', true, 'Materials, tools, safety, design and simple mechanics'),
    ('JS-CRE-G7', 'Christian Religious Education', 'junior_school', 'Grade 7', true, 'Christian values and ethical living in modern society'),
    ('JS-CREAT-G7', 'Creative Arts and Sports', 'junior_school', 'Grade 7', true, 'Visual arts, music, dance and athletic disciplines')
ON CONFLICT (grade_level, code) DO NOTHING;

-- Seed Senior School (Grades 10-12) with Core and Pathways
INSERT INTO public.subjects (code, name, education_level, grade_level, pathway, is_core, description)
VALUES 
    ('SS-CORE-ENG-G10', 'Advanced English', 'senior_school', 'Grade 10', NULL, true, 'Senior school core communicative and critical writing'),
    ('SS-CORE-KIS-G10', 'Kiswahili Fasaha', 'senior_school', 'Grade 10', NULL, true, 'Senior school core linguistic analysis and literature'),
    ('SS-CORE-MAT-G10', 'Core Mathematics', 'senior_school', 'Grade 10', NULL, true, 'Core senior quantitative analysis and functions'),
    ('SS-CORE-COM-G10', 'Community Service Learning', 'senior_school', 'Grade 10', NULL, true, 'Experiential community leadership and project execution'),
    ('SS-CORE-PE-G10', 'Physical Education', 'senior_school', 'Grade 10', NULL, true, 'Physical wellness, lifetime fitness and sports ethics'),
    
    -- STEM Pathway
    ('SS-STEM-PHY-G10', 'Physics', 'senior_school', 'Grade 10', 'STEM', false, 'Mechanics, waves, electricity, thermal and nuclear physics'),
    ('SS-STEM-CHE-G10', 'Chemistry', 'senior_school', 'Grade 10', 'STEM', false, 'Inorganic, organic, stoichiometry and industrial chemistry'),
    ('SS-STEM-BIO-G10', 'Biology', 'senior_school', 'Grade 10', 'STEM', false, 'Cytology, genetics, physiology, ecology and evolution'),
    ('SS-STEM-CS-G10', 'Computer Science & Software', 'senior_school', 'Grade 10', 'STEM', false, 'Algorithms, data structures, programming and digital ethics'),

    -- Social Sciences Pathway
    ('SS-SOC-HIST-G10', 'History and Citizenship', 'senior_school', 'Grade 10', 'Social Sciences', false, 'World revolutions, African historiography, governance and human rights'),
    ('SS-SOC-GEO-G10', 'Geography', 'senior_school', 'Grade 10', 'Social Sciences', false, 'Physical and human geography, GIS and climate systems'),
    ('SS-SOC-BUS-G10', 'Business and Economics', 'senior_school', 'Grade 10', 'Social Sciences', false, 'Macroeconomics, enterprise development, accounting and financial markets'),

    -- Arts and Sports Science Pathway
    ('SS-ARTS-MUS-G10', 'Music and Performing Arts', 'senior_school', 'Grade 10', 'Arts and Sports Science', false, 'Composition, indigenous instruments, contemporary performance'),
    ('SS-ARTS-VIS-G10', 'Fine and Applied Arts', 'senior_school', 'Grade 10', 'Arts and Sports Science', false, 'Studio art, sculpture, digital design, animation and curation'),
    ('SS-ARTS-SPO-G10', 'Sports Science', 'senior_school', 'Grade 10', 'Arts and Sports Science', false, 'Biomechanics, exercise physiology, sports psychology and coaching')
ON CONFLICT (grade_level, code) DO NOTHING;

-- Seed Sample Public Curriculum Learning Resources (Verified KICD)
INSERT INTO public.learning_resources (title, description, resource_type, grade_level, strand, sub_strand, is_public, verification_status, source_document, content_text)
VALUES
    (
        'Grade 7 Integrated Science: Laboratory Safety & Apparatus',
        'Official KICD strand guide on laboratory safety rules, hazard symbols, and apparatus identification.',
        'digital_lesson',
        'Grade 7',
        'Scientific Inquiry & Safety',
        'Laboratory Apparatus & Protocols',
        true,
        'approved',
        'KICD Grade 7 Curriculum Design 2024',
        '# Laboratory Safety and Essential Apparatus\n\n### 1. Safety Protocols\n- Always wear protective eye goggles and a lab coat.\n- Never smell or taste unknown substances directly.\n- Locate emergency eyewash and fire blanket stations before commencing practicals.'
    ),
    (
        'Grade 10 STEM: Vectors and Kinematics in One Dimension',
        'Official Senior School STEM pathway notes for linear motion, displacement-time graphs, and kinematic equations.',
        'notes',
        'Grade 10',
        'Mechanics',
        'Linear Motion & Vectors',
        true,
        'approved',
        'KICD Senior School STEM Design',
        '# Kinematics in One Dimension\n\n### Key Equations of Uniform Acceleration:\n1. $v = u + at$\n2. $s = ut + \\frac{1}{2}at^2$\n3. $v^2 = u^2 + 2as$'
    )
ON CONFLICT DO NOTHING;
