
import { Assessment, AssessmentResult } from "@/types/assessment";

export const mockAssessments: Assessment[] = [
  {
    id: "1",
    title: "Frontend Developer Assessment",
    description: "Technical assessment for frontend developer candidates",
    timeLimit: 45,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        text: "Which of the following is NOT a JavaScript framework or library?",
        options: [
          { id: "o1", text: "React", isCorrect: false },
          { id: "o2", text: "Angular", isCorrect: false },
          { id: "o3", text: "Laravel", isCorrect: true },
          { id: "o4", text: "Vue", isCorrect: false },
        ],
        maxScore: 5,
      },
      {
        id: "q2",
        type: "text",
        text: "Explain the difference between let, const, and var in JavaScript.",
        maxScore: 10,
      },
      {
        id: "q3",
        type: "video",
        text: "Present a brief overview of a recent project you worked on and what technologies you used.",
        maxScore: 15,
      },
    ],
    createdAt: new Date(2023, 5, 15),
    createdBy: "admin@complex.com",
  },
  {
    id: "2",
    title: "Marketing Coordinator Interview",
    description: "Assessment for marketing coordinator candidates",
    timeLimit: 30,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        text: "Which of these is NOT a social media platform?",
        options: [
          { id: "o1", text: "Instagram", isCorrect: false },
          { id: "o2", text: "Twitter", isCorrect: false },
          { id: "o3", text: "Mailchimp", isCorrect: true },
          { id: "o4", text: "TikTok", isCorrect: false },
        ],
        maxScore: 5,
      },
      {
        id: "q2",
        type: "text",
        text: "Describe a successful marketing campaign you've worked on and what metrics you used to measure its success.",
        maxScore: 15,
      },
    ],
    createdAt: new Date(2023, 6, 22),
    createdBy: "admin@complex.com",
  },
];

export const mockResults: AssessmentResult[] = [
  {
    id: "r1",
    assessmentId: "1",
    userId: "u1",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    answers: [
      {
        questionId: "q1",
        selectedOptionIds: ["o2"],
      },
      {
        questionId: "q2",
        textAnswer: "Let and const are block-scoped, while var is function-scoped. Const creates a variable that cannot be reassigned, let allows reassignment, and var can be both reassigned and redeclared.",
      },
      {
        questionId: "q3",
        videoUrl: "/videos/sample-video-1.mp4",
      },
    ],
    score: 22,
    feedback: "Good technical knowledge but could improve on communication skills.",
    submittedAt: new Date(2023, 5, 18),
    gradedAt: new Date(2023, 5, 20),
    gradedBy: "admin@complex.com",
  },
];

export const getAssessments = (): Promise<Assessment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAssessments);
    }, 500);
  });
};

export const getAssessmentById = (id: string): Promise<Assessment | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAssessments.find(assessment => assessment.id === id));
    }, 300);
  });
};

export const getResultsByAssessmentId = (assessmentId: string): Promise<AssessmentResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResults.filter(result => result.assessmentId === assessmentId));
    }, 300);
  });
};

// In a real app, these functions would connect to a backend API
export const saveAssessmentResult = (result: Omit<AssessmentResult, 'id'>): Promise<AssessmentResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newResult = {
        ...result,
        id: `r${mockResults.length + 1}`,
      };
      mockResults.push(newResult as AssessmentResult);
      resolve(newResult as AssessmentResult);
    }, 500);
  });
};

export const createAssessment = (assessment: Omit<Assessment, 'id' | 'createdAt'>): Promise<Assessment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAssessment = {
        ...assessment,
        id: `${mockAssessments.length + 1}`,
        createdAt: new Date(),
      };
      mockAssessments.push(newAssessment as Assessment);
      resolve(newAssessment as Assessment);
    }, 500);
  });
};
