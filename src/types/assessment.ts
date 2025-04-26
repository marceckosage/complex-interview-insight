
export type QuestionType = 'multiple-choice' | 'text' | 'video';

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  maxScore?: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  questions: Question[];
  createdAt: Date;
  createdBy: string;
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
}
