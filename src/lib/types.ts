import type { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export type InterviewType = "Technical" | "HR" | "Behavioral" | "Fresher";

export interface InterviewFeedback {
  strengths: string;
  weaknesses: string;
  suggestions: string;
  overallScore: number;
}

export interface InterviewSession {
  id: string;
  userId: string;
  interviewType: InterviewType;
  question: string;
  answer: string;
  feedback: InterviewFeedback;
  createdAt: Timestamp;
}
