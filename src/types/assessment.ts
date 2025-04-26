
export type QuestionType = 'multiple-choice' | 'text' | 'video';

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
  score?: number; // Score value for this option (0-5)
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  maxScore?: number;
  totalScore?: number; // Sum of all option scores
  category?: string; // Added category field for grouping questions
}

export interface Rubric {
  id: string;
  name: string;
  description?: string;
  content: string;
  criteria: RubricCriterion[];
  createdBy: string;
  createdAt: Date;
  assessmentId?: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weightPercentage?: number;
}

export interface AssessmentAnalytics {
  categoryScores?: Record<string, number>;
  categoryMaxScores?: Record<string, number>;
  strengths?: string[];
  weaknesses?: string[];
  aiAnalysis?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  questions: Question[];
  createdAt: Date;
  createdBy: string;
  isArchived?: boolean;
  lastModified?: Date;
  rubricId?: string;
  rubric?: Rubric;
  aiSettings?: {
    apiKey?: string;
    model?: string;
    temperature?: number;
  };
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIds?: string[]; // For multiple choice
  textAnswer?: string; // For text answers
  videoUrl?: string; // For video recordings
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  answers: UserAnswer[];
  score?: number;
  feedback?: string;
  submittedAt: Date;
  gradedAt?: Date;
  gradedBy?: string;
  analytics?: AssessmentAnalytics;
}

export interface ShareLink {
  id: string;
  assessmentId: string;
  token: string;
  expiresAt?: Date;
  allowedDomains?: string[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'test-taker';
  createdAt: Date;
}
