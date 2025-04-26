
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Assessment, Question, QuestionType } from "@/types/assessment";
import { getAssessmentById, updateAssessment } from "@/services/mockData";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "@/components/ui/sonner";
import { Loader } from "lucide-react";

const EditAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState<number | undefined>(30);
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "multiple-choice",
    text: "",
    options: [{ id: "1", text: "", isCorrect: false }, { id: "2", text: "", isCorrect: false }],
    maxScore: 5
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) {
        navigate("/assessments");
        return;
      }
      
      try {
        const assessment = await getAssessmentById(id);
        if (!assessment) {
          toast({
            title: "Assessment not found",
            variant: "destructive"
          });
          navigate("/assessments");
          return;
        }
        
        // Populate the form
        setTitle(assessment.title);
        setDescription(assessment.description || "");
        setTimeLimit(assessment.timeLimit);
        setQuestions(assessment.questions);
      } catch (error) {
        console.error("Error fetching assessment:", error);
        toast({
          title: "Error loading assessment",
          description: "There was a problem loading the assessment. Please try again.",
          variant: "destructive"
        });
        navigate("/assessments");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessment();
  }, [id, navigate, toast]);
  
  const handleQuestionTypeChange = (type: QuestionType) => {
    setCurrentQuestion(prev => ({
      ...prev,
      type,
      options: type === "multiple-choice" ? [
        { id: "1", text: "", isCorrect: false }, 
        { id: "2", text: "", isCorrect: false }
      ] : undefined,
      maxScore: type === "multiple-choice" ? 5 : type === "text" ? 10 : 15
    }));
  };
  
  const handleAddOption = () => {
    if (currentQuestion.options) {
      setCurrentQuestion(prev => ({
        ...prev,
        options: [
          ...(prev.options || []),
          { id: `${(prev.options?.length || 0) + 1}`, text: "", isCorrect: false }
        ]
      }));
    }
  };
  
  const handleOptionTextChange = (index: number, text: string) => {
    if (currentQuestion.options) {
      const newOptions = [...currentQuestion.options];
      newOptions[index] = { ...newOptions[index], text };
      setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
    }
  };
  
  const handleOptionScoreChange = (index: number, score: number) => {
    if (currentQuestion.options) {
      const newOptions = [...currentQuestion.options];
      const validScore = Math.min(Math.max(0, score), 5); // Ensure score is between 0 and 5
      newOptions[index] = { ...newOptions[index], score: validScore };
      
      // Update total score
      const totalScore = newOptions.reduce((sum, opt) => sum + (opt.score || 0), 0);
      setCurrentQuestion(prev => ({ 
        ...prev, 
        options: newOptions,
        totalScore: totalScore
      }));
    }
  };
  
  const handleOptionCorrectChange = (optionId: string) => {
    if (currentQuestion.options) {
      const newOptions = currentQuestion.options.map(option => ({
        ...option,
        isCorrect: option.id === optionId
      }));
      setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
    }
  };
  
  const handleRemoveOption = (index: number) => {
    if (currentQuestion.options && currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
    } else {
      toast({
        title: "Cannot remove option",
        description: "Multiple choice questions must have at least 2 options.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddQuestion = () => {
    // Validation
    if (!currentQuestion.text) {
      toast({
        title: "Required field missing",
        description: "Question text is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (
      currentQuestion.type === "multiple-choice" && 
      (!currentQuestion.options || 
       !currentQuestion.options.some(o => o.isCorrect) ||
       currentQuestion.options.some(o => !o.text))
    ) {
      toast({
        title: "Invalid options",
        description: "All options must have text and one option must be marked as correct.",
        variant: "destructive"
      });
      return;
    }
    
    // Add question
    const newQuestion = {
      ...currentQuestion,
      id: `q${questions.length + 1}`
    };
    
    setQuestions(prev => [...prev, newQuestion]);
    
    // Reset current question
    setCurrentQuestion({
      type: "multiple-choice",
      text: "",
      options: [{ id: "1", text: "", isCorrect: false }, { id: "2", text: "", isCorrect: false }],
      maxScore: 5
    });
    
    toast({
      title: "Question added",
      description: "Your question has been added to the assessment."
    });
  };
  
  const handleRemoveQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Question removed"
    });
  };
  
  const handleSubmit = async () => {
    // Validation
    if (!title) {
      toast({
        title: "Required field missing",
        description: "Assessment title is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (questions.length === 0) {
      toast({
        title: "No questions",
        description: "You must add at least one question to create an assessment.",
        variant: "destructive"
      });
      return;
    }
    
    if (!id) {
      toast({
        title: "Assessment ID missing",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const assessment: Assessment = {
        id,
        title,
        description,
        timeLimit,
        questions: questions as Question[],
        createdBy: "admin@complex.com",
        createdAt: new Date(), // This would be preserved in a real app
        lastModified: new Date()
      };
      
      await updateAssessment(assessment);
      
      toast({
        title: "Assessment updated",
        description: "Your assessment has been successfully updated."
      });
      
      navigate('/assessments');
    } catch (error) {
      console.error("Error updating assessment:", error);
      toast({
        title: "Error updating assessment",
        description: "There was an error updating your assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Assessment</h1>
        <p className="text-gray-600 mt-1">Update your assessment details and questions</p>
      </div>
      
      <div className="grid gap-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Assessment Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Frontend Developer Technical Assessment"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this assessment..."
                  className="w-full min-h-[100px]"
                />
              </div>
              
              <div>
                <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Limit (minutes)
                </label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={timeLimit || ""}
                  onChange={(e) => setTimeLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Leave empty for unlimited time"
                  className="w-full max-w-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Questions ({questions.length})</h2>
            
            {questions.length > 0 && (
              <div className="mb-8 space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-md relative hover:border-brand-purple transition-colors"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => handleRemoveQuestion(index)}
                    >
                      <X size={16} />
                    </Button>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-brand-purple text-white text-xs px-2 py-1 rounded">
                        {question.type === "multiple-choice"
                          ? "Multiple Choice"
                          : question.type === "text"
                          ? "Text Response"
                          : "Video Response"}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Max score: {question.maxScore} points
                      </span>
                    </div>
                    
                    <p className="font-medium">{question.text}</p>
                    
                    {question.type === "multiple-choice" && question.options && (
                      <div className="mt-2 pl-4">
                        {question.options.map((option, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className={`w-4 h-4 inline-block rounded-full ${option.isCorrect ? 'bg-green-500' : 'bg-gray-200'}`}></span>
                            <span>{option.text}</span>
                            {option.score !== undefined && (
                              <span className="text-gray-500">(Score: {option.score})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="font-medium mb-4">Add New Question</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Type
                  </label>
                  <Select
                    value={currentQuestion.type}
                    onValueChange={(value) => handleQuestionTypeChange(value as QuestionType)}
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="text">Text Response</SelectItem>
                      <SelectItem value="video">Video Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={currentQuestion.text || ""}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter your question here..."
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Score
                  </label>
                  <Input
                    type="number"
                    value={currentQuestion.maxScore || ""}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
                    className="w-full max-w-xs"
                  />
                </div>
                
                {currentQuestion.type === "multiple-choice" && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Options <span className="text-red-500">*</span>
                    </label>
                    <RadioGroup
                      value={currentQuestion.options?.find(o => o.isCorrect)?.id}
                      onValueChange={handleOptionCorrectChange}
                    >
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
                          <div className="flex-grow space-y-2">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value={option.id} id={`option-${index}`} />
                              <Input
                                value={option.text}
                                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="flex-grow"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`score-${index}`} className="text-sm text-gray-600">
                                Score (0-5):
                              </Label>
                              <Input
                                id={`score-${index}`}
                                type="number"
                                min="0"
                                max="5"
                                value={option.score || 0}
                                onChange={(e) => handleOptionScoreChange(index, parseInt(e.target.value) || 0)}
                                className="w-20"
                              />
                            </div>
                          </div>
                          {currentQuestion.options && currentQuestion.options.length > 2 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveOption(index)}
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddOption}
                      >
                        Add Option
                      </Button>
                      <span className="text-sm text-gray-600">
                        Total Score: {currentQuestion.totalScore || 0}
                      </span>
                    </div>
                  </div>
                )}
                
                <Button onClick={handleAddQuestion}>
                  Add Question
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/assessments')}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Assessment'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default EditAssessment;
