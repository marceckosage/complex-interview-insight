
import { Assessment, AssessmentResult, Question, UserAnswer } from "@/types/assessment";

interface AISettings {
  apiKey: string;
  model?: string;
  temperature?: number;
}

interface AIAnalysisResult {
  analysis: string;
  suggestedFeedback: string;
  suggestedScore?: number;
  categoryAnalysis?: Record<string, { strengths: string[]; weaknesses: string[] }>;
}

// This is a mock implementation; in a real app this would call the OpenAI API
export const analyzeAssessmentResult = async (
  assessment: Assessment,
  result: AssessmentResult,
  questionScores: Record<string, number>,
  settings: AISettings
): Promise<AIAnalysisResult> => {
  // In a real implementation, this would call OpenAI API with the assessment data
  console.log("Analyzing with settings:", settings);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock analysis response
  const totalScore = Object.values(questionScores).reduce((sum, score) => sum + score, 0);
  const maxPossibleScore = assessment.questions.reduce((sum, q) => sum + (q.maxScore || 0), 0);
  const scorePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  
  // Group questions by type for analysis
  const questionsByType = assessment.questions.reduce((acc, question) => {
    const type = question.type;
    if (!acc[type]) {
      acc[type] = {
        questions: [],
        score: 0,
        maxScore: 0
      };
    }
    
    acc[type].questions.push(question);
    acc[type].maxScore += question.maxScore || 0;
    acc[type].score += questionScores[question.id] || 0;
    
    return acc;
  }, {} as Record<string, { questions: Question[], score: number, maxScore: number }>);
  
  // Generate simple mock analysis
  let analysis = `## Assessment Analysis\n\n`;
  
  analysis += `Overall Score: ${totalScore}/${maxPossibleScore} (${scorePercentage}%)\n\n`;
  
  if (scorePercentage >= 90) {
    analysis += `The candidate demonstrated excellent understanding across all areas of the assessment. `;
  } else if (scorePercentage >= 75) {
    analysis += `The candidate showed strong knowledge in most areas of the assessment. `;
  } else if (scorePercentage >= 60) {
    analysis += `The candidate displayed satisfactory knowledge but has some areas for improvement. `;
  } else {
    analysis += `The candidate needs significant improvement in understanding key concepts. `;
  }
  
  analysis += `\n\n### Breakdown by Question Type:\n\n`;
  
  Object.entries(questionsByType).forEach(([type, data]) => {
    const typePercentage = data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0;
    analysis += `- ${type.charAt(0).toUpperCase() + type.slice(1)} questions: ${data.score}/${data.maxScore} (${typePercentage}%)\n`;
    
    if (typePercentage >= 80) {
      analysis += `  The candidate excelled in ${type} questions.\n`;
    } else if (typePercentage >= 60) {
      analysis += `  The candidate performed adequately in ${type} questions.\n`;
    } else {
      analysis += `  The candidate struggled with ${type} questions.\n`;
    }
  });
  
  // Analyze text answers if available
  const textAnswers = result.answers.filter(a => {
    const q = assessment.questions.find(q => q.id === a.questionId);
    return q?.type === 'text' && a.textAnswer;
  });
  
  if (textAnswers.length > 0) {
    analysis += `\n\n### Text Response Analysis:\n\n`;
    
    textAnswers.forEach((answer, index) => {
      const question = assessment.questions.find(q => q.id === answer.questionId);
      if (question && answer.textAnswer) {
        analysis += `Question ${index + 1}: "${question.text.substring(0, 50)}..."\n`;
        analysis += `Response: ${answer.textAnswer.length > 100 ? 
          answer.textAnswer.substring(0, 100) + '...' : 
          answer.textAnswer}\n`;
        
        // Mock analysis of text response
        if (answer.textAnswer.length > 200) {
          analysis += `Analysis: The response is comprehensive and shows depth of understanding.\n`;
        } else if (answer.textAnswer.length > 100) {
          analysis += `Analysis: The response addresses the question but could be more detailed.\n`;
        } else {
          analysis += `Analysis: The response is too brief and lacks sufficient detail.\n`;
        }
      }
    });
  }
  
  // Generate suggested feedback based on performance
  let suggestedFeedback = "";
  
  if (scorePercentage >= 90) {
    suggestedFeedback = `Excellent work! You demonstrated outstanding knowledge across all areas of the assessment. Your responses were thorough and showed deep understanding of the concepts.`;
  } else if (scorePercentage >= 75) {
    suggestedFeedback = `Good job! You showed solid understanding of most concepts in this assessment. Continue building on your strengths while addressing a few areas where your understanding could be deeper.`;
  } else if (scorePercentage >= 60) {
    suggestedFeedback = `You've shown satisfactory understanding of the core concepts, but there are several areas where improvement is needed. Focus on strengthening your knowledge in the weaker areas identified in the assessment.`;
  } else {
    suggestedFeedback = `This assessment indicates that you need to revisit and strengthen your understanding of the fundamental concepts covered. Consider reviewing the material again and seeking additional resources to help build your knowledge.`;
  }
  
  // Mock category analysis
  const categoryAnalysis: Record<string, { strengths: string[]; weaknesses: string[] }> = {
    "Technical Knowledge": {
      strengths: scorePercentage > 70 ? ["Solid understanding of core concepts", "Good application of technical principles"] : [],
      weaknesses: scorePercentage < 70 ? ["Needs to improve understanding of fundamental concepts", "Should practice more application exercises"] : []
    },
    "Problem Solving": {
      strengths: Object.values(questionScores).some(score => score > 7) ? ["Demonstrates creative problem-solving approaches", "Can tackle complex problems effectively"] : [],
      weaknesses: Object.values(questionScores).some(score => score < 5) ? ["Needs to develop more structured problem-solving approach", "Should work on breaking down complex problems"] : []
    }
  };
  
  return {
    analysis,
    suggestedFeedback,
    suggestedScore: Math.min(totalScore, maxPossibleScore),
    categoryAnalysis
  };
};

// Mock function to generate assessment questions from a rubric
export const generateQuestionsFromRubric = async (
  rubricContent: string,
  settings: AISettings
): Promise<Partial<Question>[]> => {
  console.log("Generating questions with settings:", settings);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock generated questions based on typical assessment patterns
  return [
    {
      type: "multiple-choice",
      text: "Which of the following best exemplifies the core concept described in the rubric?",
      options: [
        { id: crypto.randomUUID(), text: "Option A - Correct statement about the concept", isCorrect: true },
        { id: crypto.randomUUID(), text: "Option B - Common misconception", isCorrect: false },
        { id: crypto.randomUUID(), text: "Option C - Related but incorrect statement", isCorrect: false },
        { id: crypto.randomUUID(), text: "Option D - Completely unrelated statement", isCorrect: false }
      ],
      maxScore: 5,
      category: "Concept Understanding"
    },
    {
      type: "text",
      text: "Explain the relationship between the key principles outlined in the rubric and how they apply in a real-world scenario.",
      maxScore: 10,
      category: "Application"
    },
    {
      type: "multiple-choice",
      text: "Based on the assessment criteria, which approach would be most effective for solving the described problem?",
      options: [
        { id: crypto.randomUUID(), text: "Approach A - Inefficient but common method", isCorrect: false },
        { id: crypto.randomUUID(), text: "Approach B - Optimal solution matching criteria", isCorrect: true },
        { id: crypto.randomUUID(), text: "Approach C - Partially correct approach", isCorrect: false },
        { id: crypto.randomUUID(), text: "Approach D - Incorrect approach", isCorrect: false }
      ],
      maxScore: 5,
      category: "Problem Solving"
    },
    {
      type: "video",
      text: "Demonstrate how you would apply the concepts from the rubric to solve a real-world problem. Explain your thought process as you work through the solution.",
      maxScore: 15,
      category: "Practical Application"
    }
  ];
};
