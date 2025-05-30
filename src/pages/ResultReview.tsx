
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { getResultById, getAssessmentById, mockResults, mockAssessments } from "@/services/mockData";
import { Assessment, AssessmentResult, Question, Rubric } from "@/types/assessment";
import AssessmentDashboard from "@/components/assessment/AssessmentDashboard";
import RubricUploader from "@/components/assessment/RubricUploader";
import { AISettingsCard } from "@/components/assessment/AISettings";
import { analyzeAssessmentResult } from "@/services/aiService";

const ResultReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [questionScores, setQuestionScores] = useState<{ [key: string]: number }>({});
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("review");
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSettings, setAISettings] = useState<{ apiKey: string; model: string; temperature: number } | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, these would be actual API calls
        const resultData = mockResults.find(r => r.id === id);
        if (resultData) {
          setResult(resultData);
          setFeedback(resultData.feedback || "");
          
          const assessmentData = mockAssessments.find(a => a.id === resultData.assessmentId);
          if (assessmentData) {
            setAssessment(assessmentData);
            
            // Initialize question scores
            const initialScores: { [key: string]: number } = {};
            resultData.answers.forEach(answer => {
              const question = assessmentData.questions.find(q => q.id === answer.questionId);
              if (question) {
                if (question.type === 'multiple-choice' && answer.selectedOptionIds) {
                  // Auto-score multiple choice
                  const isCorrect = question.options?.some(
                    opt => opt.isCorrect && answer.selectedOptionIds?.includes(opt.id)
                  );
                  initialScores[question.id] = isCorrect ? (question.maxScore || 0) : 0;
                } else {
                  // Manual scoring for text and video
                  initialScores[question.id] = 0;
                }
              }
            });
            
            setQuestionScores(initialScores);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
  const handleScoreChange = (questionId: string, score: string) => {
    const question = assessment?.questions.find(q => q.id === questionId);
    if (!question) return;
    
    const numScore = parseInt(score);
    const maxScore = question.maxScore || 0;
    
    // Validate score
    if (isNaN(numScore) || numScore < 0) {
      setQuestionScores(prev => ({ ...prev, [questionId]: 0 }));
    } else if (numScore > maxScore) {
      setQuestionScores(prev => ({ ...prev, [questionId]: maxScore }));
    } else {
      setQuestionScores(prev => ({ ...prev, [questionId]: numScore }));
    }
  };
  
  const getTotalScore = () => {
    return Object.values(questionScores).reduce((sum, score) => sum + score, 0);
  };
  
  const getMaxPossibleScore = () => {
    if (!assessment) return 0;
    return assessment.questions.reduce((sum, q) => sum + (q.maxScore || 0), 0);
  };
  
  const handleSubmit = async () => {
    if (!result || !assessment) return;
    
    setSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the result in our mock data
      const resultIndex = mockResults.findIndex(r => r.id === result.id);
      if (resultIndex >= 0) {
        mockResults[resultIndex] = {
          ...result,
          score: getTotalScore(),
          feedback,
          gradedAt: new Date(),
          gradedBy: "admin@complex.com"
        };
      }
      
      toast({
        title: "Assessment graded",
        description: "The assessment has been successfully graded."
      });
      
      navigate(`/results/${assessment.id}`);
    } catch (err) {
      console.error("Error submitting grades:", err);
      toast({
        title: "Error",
        description: "There was an error saving the grades. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const findQuestion = (questionId: string): Question | undefined => {
    return assessment?.questions.find(q => q.id === questionId);
  };
  
  const handleRubricSave = (rubric: Rubric) => {
    if (!assessment) return;
    
    // Update assessment with rubric
    const assessmentIndex = mockAssessments.findIndex(a => a.id === assessment.id);
    if (assessmentIndex >= 0) {
      mockAssessments[assessmentIndex] = {
        ...assessment,
        rubricId: rubric.id,
        rubric
      };
      
      setAssessment(mockAssessments[assessmentIndex]);
      
      toast({
        title: "Rubric saved",
        description: "The rubric has been attached to this assessment."
      });
    }
  };
  
  const handleAISettings = (settings: { apiKey: string; model: string; temperature: number }) => {
    setAISettings(settings);
    toast({
      title: "AI Settings Saved",
      description: "Your OpenAI API settings have been saved."
    });
  };
  
  const handleAIAnalysis = async () => {
    if (!assessment || !result || !aiSettings?.apiKey) {
      toast({
        title: "Cannot analyze",
        description: "Please configure AI settings first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const analysisResult = await analyzeAssessmentResult(
        assessment,
        result,
        questionScores,
        aiSettings
      );
      
      // Update feedback with AI suggestion
      setFeedback(analysisResult.suggestedFeedback);
      
      // Update result with analytics
      const resultIndex = mockResults.findIndex(r => r.id === result.id);
      if (resultIndex >= 0) {
        mockResults[resultIndex] = {
          ...result,
          analytics: {
            categoryScores: Object.entries(questionScores).reduce((acc, [questionId, score]) => {
              const question = assessment.questions.find(q => q.id === questionId);
              if (question && question.category) {
                acc[question.category] = (acc[question.category] || 0) + score;
              }
              return acc;
            }, {} as Record<string, number>),
            strengths: analysisResult.categoryAnalysis ? 
              Object.entries(analysisResult.categoryAnalysis)
                .flatMap(([category, data]) => data.strengths.map(s => `${category}: ${s}`))
              : [],
            weaknesses: analysisResult.categoryAnalysis ? 
              Object.entries(analysisResult.categoryAnalysis)
                .flatMap(([category, data]) => data.weaknesses.map(s => `${category}: ${s}`))
              : [],
            aiAnalysis: analysisResult.analysis
          }
        };
        
        setResult(mockResults[resultIndex]);
      }
      
      setShowAIDialog(true);
    } catch (error) {
      console.error("AI analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error during AI analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      </PageLayout>
    );
  }
  
  if (!result || !assessment) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Result not found</h2>
          <Button onClick={() => navigate("/results")}>
            Return to Results
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Review Assessment</h1>
          <div className="text-gray-600 mt-1">
            <p>{assessment.title}</p>
            <p className="mt-1">Candidate: {result.userName} ({result.userEmail})</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/results/${assessment.id}`)}
          >
            Back to Results
          </Button>
          
          {aiSettings?.apiKey && (
            <Button
              variant="outline"
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
            </Button>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Grades"}
          </Button>
        </div>
      </div>
      
      {/* Dashboard visualization module */}
      {result.analytics ? (
        <AssessmentDashboard 
          assessment={assessment}
          result={result}
          questionScores={questionScores}
        />
      ) : null}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="review">Review Answers</TabsTrigger>
          <TabsTrigger value="rubric">Assessment Rubric</TabsTrigger>
          <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="review">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Candidate Responses</h2>
                
                <div className="bg-gray-100 px-4 py-2 rounded-md">
                  <span className="text-sm text-gray-600">Total Score: </span>
                  <span className="font-bold">{getTotalScore()}</span>
                  <span className="text-gray-600"> / {getMaxPossibleScore()}</span>
                </div>
              </div>
              
              <div className="space-y-8">
                {result.answers.map((answer, index) => {
                  const question = findQuestion(answer.questionId);
                  if (!question) return null;
                  
                  return (
                    <div key={answer.questionId} className="pb-8 border-b border-gray-200 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium">
                          Question {index + 1}:
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="bg-brand-purple bg-opacity-10 text-brand-purple text-xs px-2 py-1 rounded">
                            {question.type === "multiple-choice" 
                              ? "Multiple Choice" 
                              : question.type === "text" 
                                ? "Text Response" 
                                : "Video Response"}
                          </span>
                          
                          {question.category && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {question.category}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="mb-4">{question.text}</p>
                      
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Candidate's Answer:</h4>
                        
                        {question.type === "multiple-choice" && (
                          <div className="pl-4 space-y-2">
                            {question.options?.map((option) => {
                              const isSelected = answer.selectedOptionIds?.includes(option.id);
                              return (
                                <div 
                                  key={option.id} 
                                  className={`p-3 border rounded-md ${
                                    isSelected && option.isCorrect 
                                      ? "border-green-500 bg-green-50" 
                                      : isSelected && !option.isCorrect
                                      ? "border-red-500 bg-red-50"
                                      : !isSelected && option.isCorrect
                                      ? "border-yellow-500 bg-yellow-50"
                                      : "border-gray-200"
                                  }`}
                                >
                                  {option.text}
                                  {isSelected && (
                                    <span className="ml-2 font-medium">
                                      (Selected)
                                    </span>
                                  )}
                                  {option.isCorrect && (
                                    <span className={`ml-2 ${isSelected ? "text-green-600" : "text-yellow-600"} text-xs font-medium`}>
                                      (Correct Answer)
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {question.type === "text" && answer.textAnswer && (
                          <div className="p-3 border border-gray-200 rounded-md">
                            <p>{answer.textAnswer}</p>
                          </div>
                        )}
                        
                        {question.type === "video" && answer.videoUrl && (
                          <div className="p-3 border border-gray-200 rounded-md">
                            <p className="text-gray-700 mb-2">Video submission available</p>
                            {/* In a real app, there would be a video player here */}
                            <div className="bg-gray-200 aspect-video flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <label className="font-medium">Score:</label>
                        <Input
                          type="number"
                          min="0"
                          max={question.maxScore}
                          value={questionScores[question.id] || 0}
                          onChange={(e) => handleScoreChange(question.id, e.target.value)}
                          className="w-20"
                        />
                        <span className="text-gray-600">/ {question.maxScore}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Overall Feedback</h2>
              
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback for the candidate..."
                className="min-h-[150px]"
              />
              
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Final Score:</span>
                  <span className="text-xl font-bold">{getTotalScore()}</span>
                  <span className="text-gray-600">/ {getMaxPossibleScore()}</span>
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Grades"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rubric">
          <RubricUploader 
            assessmentId={assessment.id}
            onRubricSave={handleRubricSave}
            existingRubric={assessment.rubric}
          />
        </TabsContent>
        
        <TabsContent value="ai-settings">
          <AISettingsCard 
            apiKey={aiSettings?.apiKey}
            defaultModel={aiSettings?.model}
            defaultTemperature={aiSettings?.temperature}
            onSaveSettings={handleAISettings}
          />
        </TabsContent>
      </Tabs>
      
      {/* AI Analysis Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Analysis Results</DialogTitle>
            <DialogDescription>
              Analysis generated using {aiSettings?.model || "AI"} model
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {result.analytics?.aiAnalysis && (
              <div className="prose max-w-none">
                <div className="whitespace-pre-line">{result.analytics.aiAnalysis}</div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowAIDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ResultReview;
