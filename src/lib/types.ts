import type { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export type InterviewType = "Technical" | "HR" | "Behavioral" | "Fresher";
export type InterviewDifficulty = "Easy" | "Medium" | "Hard";

export interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  summary: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  interviewType: InterviewType;
  sessionName: string;
  topic?: string;
  difficulty?: InterviewDifficulty;
  resumeText?: string;
  question: string;
  answer: string;
  feedback: InterviewFeedback;
  createdAt: Timestamp;
}
