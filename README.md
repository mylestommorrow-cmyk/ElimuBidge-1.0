# ElimuBridge — Kenya Competency-Based Education (CBE / CBC) Platform

ElimuBridge is an interactive learning and competency assessment platform aligned with the **Kenya Institute of Curriculum Development (KICD)** curriculum designs and the **Kenya National Examinations Council (KNEC)** Competency-Based Assessment (CBA) frameworks.

## Key Features

- **Full Curriculum Hierarchy**: Complete tier coverage from Early Years Education (Playgroup, PP1, PP2, Grades 1–3), Upper Primary (Grades 4–6), Junior School (Grades 7–9), to Senior School Pathways (STEM, Social Sciences, Arts & Sports Science).
- **Special Needs & Inclusive Education (SNE)**: Inclusive learning modes calibrated for Foundation, Intermediate, and Pre-Vocational stages with Universal Design for Learning (UDL) accommodations.
- **7 Core Competencies**: Interactive tracking across Communication & Collaboration, Critical Thinking, Imagination & Creativity, Citizenship, Digital Literacy, Learning to Learn, and Self-Efficacy.
- **KNEC Rubric Assessment**: Official 4-band scoring (**EE** - Exceeding Expectations, **ME** - Meeting Expectations, **AE** - Approaching Expectations, **BE** - Below Expectations).
- **Mwalimu AI**: Master educator curriculum specialist persona providing Socratic hints, real Kenyan context (KES, 47 counties, agriculture, everyday applications), and step-by-step guidance.
- **Dual Learning Modes**:
  - **School Mode**: Institutional tenancy, class rosters, teacher PIN authentication (`2026`), and coursework management.
  - **Independent Mode**: Self-paced curriculum navigation, quizzes, revision resources, and personalized study.
- **Offline & PWA Resilience**: Progressive Web App with offline client caching, responsive mobile design, and seamless Supabase synchronization.

## Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Start & Router, Tailwind CSS, Lucide Icons, Radix UI.
- **Backend / Database**: Supabase PostgreSQL with Row Level Security (RLS) policies.
- **AI Engine**: Google Gemini via REST proxy with Socratic pedagogical prompts.

## Development

```sh
npm install
npm run dev
```

The application runs on `http://localhost:3000`.
