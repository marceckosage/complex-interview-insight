
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
  teamAccess?: string[]; // User IDs that have access to this assessment
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

export interface UserAnswer {
  questionId: string;
  selectedOptionIds?: string[]; // For multiple choice
  textAnswer?: string; // For text answers
  videoUrl?: string; // For video recordings
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
  role: 'admin' | 'reviewer' | 'creator' | 'test-taker';
  createdAt: Date;
  teams?: string[]; // Team IDs the user belongs to
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  members: TeamMember[];
}

export interface TeamMember {
  userId: string;
  role: 'admin' | 'member';
  invitedAt: Date;
  joinedAt?: Date;
}

export interface OrganizationSettings {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  defaultAssessmentSettings?: {
    timeLimit?: number;
    aiModel?: string;
    aiTemperature?: number;
  };
  emailTemplates?: {
    invitation?: string;
    assessmentInvitation?: string;
    results?: string;
  };
}

export interface ApiIntegration {
  id: string;
  name: string;
  provider: 'openai' | 'custom';
  apiKey?: string;
  endpointUrl?: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
}
