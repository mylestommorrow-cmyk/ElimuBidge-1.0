import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";

export interface FirestoreUserProfile {
  displayName: string;
  email?: string;
  role: "student" | "teacher" | "school_admin" | "platform_admin";
  gradeLevel?: string;
  mode: "school" | "independent";
  photoURL?: string;
  tokensBalance?: number;
  quizzesTaken?: number;
  averageScore?: number;
  completedTopicsCount?: number;
  disabilityAccommodation?: string;
  accessibilitySettings?: Record<string, unknown>;
  lastQuizTitle?: string;
  lastQuizScore?: number;
  lastQuizTotal?: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface FirestoreScoreUpdate {
  userId: string;
  displayName?: string;
  quizTitle: string;
  score: number;
  total: number;
  percentage?: number;
  tokensBalance: number;
  quizzesTaken: number;
  averageScore: number;
  completedTopicsCount?: number;
  disabilityAccommodation?: string;
}

export interface FirestoreLearnerActivity {
  userId: string;
  type: "quiz" | "coursework" | "competency" | "chat";
  title: string;
  subject?: string;
  gradeLevel?: string;
  score?: number;
  total?: number;
  competencyRubric?: "EE" | "ME" | "AE" | "BE";
  createdAt?: string;
}

export interface FirestoreChatMessage {
  userId: string;
  role: "user" | "model" | "system";
  content: string;
  groundingSources?: string;
  timestamp?: string;
}

// 1. Sync User Profile to Firestore
export async function syncUserProfileToFirestore(
  userId: string,
  profile: Partial<FirestoreUserProfile>,
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        ...profile,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 2. Fetch User Profile from Firestore
export async function getUserProfileFromFirestore(
  userId: string,
): Promise<FirestoreUserProfile | null> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data() as FirestoreUserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// 3. Record Learner Activity (quiz results, coursework, rubric evaluations)
export async function recordLearnerActivityToFirestore(
  activity: FirestoreLearnerActivity,
): Promise<void> {
  const currentUid = auth.currentUser?.uid || activity.userId;
  const activityId = `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const path = `users/${currentUid}/activities/${activityId}`;
  try {
    const actRef = doc(db, "users", currentUid, "activities", activityId);
    await setDoc(actRef, {
      ...activity,
      userId: currentUid,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// 4. Save Chat Message to Firestore
export async function saveChatMessageToFirestore(message: FirestoreChatMessage): Promise<void> {
  const currentUid = auth.currentUser?.uid || message.userId;
  if (!currentUid) return;
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const path = `users/${currentUid}/chat_history/${messageId}`;
  try {
    const msgRef = doc(db, "users", currentUid, "chat_history", messageId);
    await setDoc(msgRef, {
      ...message,
      userId: currentUid,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// 5. Fetch Chat History from Firestore
export async function getChatHistoryFromFirestore(userId: string): Promise<FirestoreChatMessage[]> {
  const path = `users/${userId}/chat_history`;
  try {
    const historyCol = collection(db, "users", userId, "chat_history");
    const q = query(historyCol, orderBy("timestamp", "asc"), limit(30));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreChatMessage);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// 6. Persist Learner Quiz Scores and Token Balances to Cloud Profile
export async function persistLearnerScoreToFirestore(update: FirestoreScoreUpdate): Promise<void> {
  const currentUid = auth.currentUser?.uid || update.userId;
  const path = `users/${currentUid}`;
  try {
    const userRef = doc(db, "users", currentUid);
    await setDoc(
      userRef,
      {
        displayName: update.displayName || "CBE Learner",
        role: "student",
        tokensBalance: update.tokensBalance,
        quizzesTaken: update.quizzesTaken,
        averageScore: update.averageScore,
        completedTopicsCount: update.completedTopicsCount ?? 0,
        lastQuizTitle: update.quizTitle,
        lastQuizScore: update.score,
        lastQuizTotal: update.total,
        ...(update.disabilityAccommodation
          ? { disabilityAccommodation: update.disabilityAccommodation }
          : {}),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    // Also record the quiz activity to the learner's activities subcollection
    const activityId = `act-quiz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const actRef = doc(db, "users", currentUid, "activities", activityId);
    await setDoc(actRef, {
      userId: currentUid,
      type: "quiz",
      title: update.quizTitle,
      score: update.score,
      total: update.total,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 7. Sync Disability Accommodation and Accessibility Preferences to Firestore Profile
export async function syncDisabilityAccommodationToFirestore(
  userId: string,
  accommodation: string,
  accessibilitySettings?: Record<string, unknown>,
): Promise<void> {
  const currentUid = auth.currentUser?.uid || userId;
  const path = `users/${currentUid}`;
  try {
    const userRef = doc(db, "users", currentUid);
    await setDoc(
      userRef,
      {
        disabilityAccommodation: accommodation,
        accessibilitySettings: accessibilitySettings || {},
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
