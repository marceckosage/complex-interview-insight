
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import VideoRecorder from "@/components/VideoRecorder";
import { getAssessmentById, saveAssessmentResult } from "@/services/mockData";
import { Assessment, UserAnswer } from "@/types/assessment";

// Component for candidate to take a specific assessment
const TakeAssessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState({
    name: "Test Candidate",
    email: "candidate@example.com"
  });
  
  // For storing video blobs temporarily
  const [videoBlobs, setVideoBlobs] = useState<{[key: string]: Blob}>({});
  
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        if (id) {
          const data = await getAssessmentById(id);
          if (data) {
            setAssessment(data);
            
            // Initialize answers array
            const initialAnswers = data.questions.map(q => ({
              questionId: q.id,
              selectedOptionIds: q.type === 'multiple-choice' ? [] : undefined,
              textAnswer: q.type === 'text' ? '' : undefined,
              videoUrl: q.type === 'video' ? '' : undefined,
            }));
            
            setAnswers(initialAnswers);
            
            // Set timer if time limit exists
            if (data.timeLimit) {
              setTimeRemaining(data.timeLimit * 60); // Convert to seconds
            }
          } else {
            setError("Assessment not found");
          }
        }
      } catch (err) {
        console.error("Error fetching assessment:", err);
        setError("Failed to load assessment");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessment();
  }, [id]);
  
  // Handle timer countdown
  useEffect(() => {
    if (!timeRemaining) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);
  
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };
  
  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId
          ? {
              ...answer,
              selectedOptionIds: answer.selectedOptionIds?.includes(optionId)
                ? answer.selectedOptionIds.filter(id => id !== optionId)
                : [...(answer.selectedOptionIds || []), optionId]
            }
          : answer
      )
    );
  };
  
  const handleTextChange = (questionId: string, text: string) => {
    setAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId
          ? { ...answer, textAnswer: text }
          : answer
      )
    );
  };
  
  const handleVideoRecording = (questionId: string, blob: Blob) => {
    // Store blob temporarily
    setVideoBlobs(prev => ({
      ...prev,
      [questionId]: blob
    }));
    
    // Set a placeholder URL in answers
    setAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId
          ? { ...answer, videoUrl: `video_${questionId}` }
          : answer
      )
    );
  };
  
  const handleNext = () => {
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!assessment) return;
    
    // Basic validation
    const incompleteAnswers = answers.filter((answer, index) => {
      const question = assessment.questions[index];
      if (question.type === 'multiple-choice' && (!answer.selectedOptionIds || answer.selectedOptionIds.length === 0)) {
        return true;
      }
      if (question.type === 'text' && (!answer.textAnswer || answer.textAnswer.trim() === '')) {
        return true;
      }
      if (question.type === 'video' && !answer.videoUrl) {
        return true;
      }
      return false;
    });
    
    if (incompleteAnswers.length > 0) {
      toast({
        title: "Incomplete answers",
        description: `You have ${incompleteAnswers.length} unanswered questions. Please complete all questions before submitting.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload videos to storage and get URLs
      // Here we'll just simulate that all went well
      
      const result = await saveAssessmentResult({
        assessmentId: assessment.id,
        userId: "test-user-id",
        userName: candidateInfo.name,
        userEmail: candidateInfo.email,
        answers,
        submittedAt: new Date(),
      });
      
      toast({
        title: "Assessment submitted",
        description: "Your assessment has been submitted successfully."
      });
      
      navigate('/assessment-complete');
    } catch (err) {
      console.error("Error submitting assessment:", err);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <PageLayout userType="candidate" userName={candidateInfo.name}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      </PageLayout>
    );
  }
  
  if (error || !assessment) {
    return (
      <PageLayout userType="candidate" userName={candidateInfo.name}>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{error || "Assessment not found"}</h2>
          <Button onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  const currentQuestion = assessment.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  
  return (
    <PageLayout userType="candidate" userName={candidateInfo.name}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{assessment.title}</h1>
          {timeRemaining !== null && (
            <div className={`px-4 py-2 rounded-md font-mono text-lg ${
              timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-gray-100'
            }`}>
              Time: {formatTime(timeRemaining)}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
          <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
          <span className="text-sm text-gray-600">
            {currentQuestion.type === 'multiple-choice' 
              ? 'Multiple Choice Question' 
              : currentQuestion.type === 'text' 
                ? 'Written Response Question' 
                : 'Video Response Question'
            }
          </span>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
          
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div 
                  key={option.id}
                  className={`p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                    currentAnswer?.selectedOptionIds?.includes(option.id) 
                      ? 'border-brand-purple bg-brand-purple bg-opacity-5' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border ${
                      currentAnswer?.selectedOptionIds?.includes(option.id) 
                        ? 'border-brand-purple bg-brand-purple' 
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer?.selectedOptionIds?.includes(option.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {currentQuestion.type === 'text' && (
            <Textarea
              value={currentAnswer?.textAnswer || ''}
              onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[200px]"
            />
          )}
          
          {currentQuestion.type === 'video' && (
            <div className="py-4">
              <VideoRecorder
                onRecordingComplete={(blob) => handleVideoRecording(currentQuestion.id, blob)}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        {currentQuestionIndex < assessment.questions.length - 1 ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        )}
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex justify-center">
        <div className="flex gap-1">
          {assessment.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                index === currentQuestionIndex
                  ? 'bg-brand-purple text-white'
                  : answers[index].selectedOptionIds?.length || answers[index].textAnswer || answers[index].videoUrl
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default TakeAssessment;
