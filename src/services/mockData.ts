
// This would be replaced by API calls to your backend in a real application
import { Assessment, AssessmentResult, ShareLink } from "@/types/assessment";

// Mock data store
let assessments: Assessment[] = [
  {
    id: "1",
    title: "Frontend Developer Assessment",
    description: "Evaluate knowledge of HTML, CSS, JavaScript, and React",
    timeLimit: 45,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        text: "Which of the following is NOT a valid CSS selector?",
        options: [
          { id: "1", text: "#header", isCorrect: false, score: 0 },
          { id: "2", text: ".container", isCorrect: false, score: 0 },
          { id: "3", text: "*main", isCorrect: true, score: 5 },
          { id: "4", text: "[data-type]", isCorrect: false, score: 0 }
        ],
        maxScore: 5,
        totalScore: 5
      },
      {
        id: "q2",
        type: "multiple-choice",
        text: "Which hook should be used to run side effects in a React component?",
        options: [
          { id: "1", text: "useState", isCorrect: false, score: 0 },
          { id: "2", text: "useEffect", isCorrect: true, score: 5 },
          { id: "3", text: "useContext", isCorrect: false, score: 0 },
          { id: "4", text: "useReducer", isCorrect: false, score: 0 }
        ],
        maxScore: 5,
        totalScore: 5
      },
      {
        id: "q3",
        type: "text",
        text: "Explain the concept of closures in JavaScript and provide a simple example.",
        maxScore: 10
      },
      {
        id: "q4",
        type: "video",
        text: "Demonstrate how you would explain the box model in CSS to a junior developer.",
        maxScore: 15
      }
    ],
    createdAt: new Date("2023-04-15"),
    createdBy: "admin@complex.com"
  },
  {
    id: "2",
    title: "Backend Developer Assessment",
    description: "Evaluate knowledge of databases, APIs, and server-side concepts",
    timeLimit: 60,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        text: "Which of the following is NOT a NoSQL database?",
        options: [
          { id: "1", text: "MongoDB", isCorrect: false, score: 0 },
          { id: "2", text: "Cassandra", isCorrect: false, score: 0 },
          { id: "3", text: "PostgreSQL", isCorrect: true, score: 5 },
          { id: "4", text: "Redis", isCorrect: false, score: 0 }
        ],
        maxScore: 5,
        totalScore: 5
      },
      {
        id: "q2",
        type: "text",
        text: "Explain the difference between REST and GraphQL APIs.",
        maxScore: 10
      }
    ],
    createdAt: new Date("2023-05-20"),
    createdBy: "admin@complex.com"
  },
  {
    id: "3",
    title: "DevOps Assessment",
    description: "Evaluate knowledge of CI/CD, containerization, and cloud services",
    timeLimit: 40,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        text: "Which tool is primarily used for container orchestration?",
        options: [
          { id: "1", text: "Docker", isCorrect: false, score: 0 },
          { id: "2", text: "Kubernetes", isCorrect: true, score: 5 },
          { id: "3", text: "Jenkins", isCorrect: false, score: 0 },
          { id: "4", text: "Ansible", isCorrect: false, score: 0 }
        ],
        maxScore: 5,
        totalScore: 5
      }
    ],
    createdAt: new Date("2023-06-10"),
    createdBy: "admin@complex.com",
    isArchived: true
  }
];

let results: AssessmentResult[] = [
  {
    id: "1",
    assessmentId: "1",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    answers: [
      {
        questionId: "q1",
        selectedOptionIds: ["3"]
      },
      {
        questionId: "q2",
        selectedOptionIds: ["2"]
      },
      {
        questionId: "q3",
        textAnswer: "Closures are functions that have access to variables from their outer scope..."
      }
    ],
    score: 17,
    feedback: "Good understanding of core concepts. Could improve on JavaScript explanations.",
    submittedAt: new Date("2023-04-18"),
    gradedAt: new Date("2023-04-19"),
    gradedBy: "admin@complex.com"
  },
  {
    id: "2",
    assessmentId: "1",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    answers: [
      {
        questionId: "q1",
        selectedOptionIds: ["1"]
      },
      {
        questionId: "q2",
        selectedOptionIds: ["2"]
      }
    ],
    submittedAt: new Date("2023-04-20")
  }
];

let shareLinks: ShareLink[] = [];

// Export mock data for direct access in components
export const mockAssessments = assessments;
export const mockResults = results;

// CRUD operations

// Assessments
export const getAssessments = async (): Promise<Assessment[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve([...assessments]), 500);
  });
};

export const getAssessmentById = async (id: string): Promise<Assessment | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const assessment = assessments.find(a => a.id === id) || null;
      resolve(assessment);
    }, 300);
  });
};

export const createAssessment = async (assessmentData: Omit<Assessment, 'id' | 'createdAt'>): Promise<Assessment> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newAssessment: Assessment = {
        ...assessmentData,
        id: `${assessments.length + 1}`,
        createdAt: new Date()
      };
      assessments.push(newAssessment);
      resolve(newAssessment);
    }, 800);
  });
};

export const updateAssessment = async (assessment: Assessment): Promise<Assessment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = assessments.findIndex(a => a.id === assessment.id);
      if (index === -1) {
        reject(new Error("Assessment not found"));
        return;
      }
      
      assessments[index] = {
        ...assessment,
        lastModified: new Date()
      };
      resolve(assessments[index]);
    }, 800);
  });
};

// Add the new deleteAssessment function
export const deleteAssessment = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = assessments.length;
      assessments = assessments.filter(a => a.id !== id);
      
      // Also remove any results associated with this assessment
      results = results.filter(r => r.assessmentId !== id);
      
      if (assessments.length === initialLength) {
        reject(new Error("Assessment not found"));
        return;
      }
      
      resolve();
    }, 800);
  });
};

// Results
export const getResultsByAssessmentId = async (assessmentId: string): Promise<AssessmentResult[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const filteredResults = results.filter(r => r.assessmentId === assessmentId);
      resolve([...filteredResults]);
    }, 500);
  });
};

export const getResultById = async (id: string): Promise<AssessmentResult | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const result = results.find(r => r.id === id) || null;
      resolve(result);
    }, 300);
  });
};

export const submitAssessment = async (resultData: Omit<AssessmentResult, 'id' | 'submittedAt'>): Promise<AssessmentResult> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newResult: AssessmentResult = {
        ...resultData,
        id: `${results.length + 1}`,
        submittedAt: new Date()
      };
      results.push(newResult);
      resolve(newResult);
    }, 800);
  });
};

// Adding the missing saveAssessmentResult function
export const saveAssessmentResult = async (resultData: Omit<AssessmentResult, 'id' | 'submittedAt'>): Promise<AssessmentResult> => {
  return submitAssessment(resultData);
};

export const gradeAssessment = async (
  id: string, 
  score: number, 
  feedback: string, 
  gradedBy: string
): Promise<AssessmentResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = results.findIndex(r => r.id === id);
      if (index === -1) {
        reject(new Error("Assessment result not found"));
        return;
      }
      
      results[index] = {
        ...results[index],
        score,
        feedback,
        gradedAt: new Date(),
        gradedBy
      };
      resolve(results[index]);
    }, 800);
  });
};

// Share Links
export const createShareLink = async (linkData: Omit<ShareLink, 'id' | 'createdAt'>): Promise<ShareLink> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newLink: ShareLink = {
        ...linkData,
        id: `share-${shareLinks.length + 1}`,
        createdAt: new Date()
      };
      shareLinks.push(newLink);
      resolve(newLink);
    }, 500);
  });
};

export const validateShareLink = async (
  assessmentId: string, 
  token: string
): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const link = shareLinks.find(
        l => l.assessmentId === assessmentId && 
             l.token === token && 
             l.isActive &&
             (!l.expiresAt || new Date() < l.expiresAt)
      );
      resolve(!!link);
    }, 300);
  });
};
