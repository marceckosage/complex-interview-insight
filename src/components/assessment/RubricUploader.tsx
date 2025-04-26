
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Trash2, Save, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Rubric, RubricCriterion } from "@/types/assessment";

interface RubricUploaderProps {
  assessmentId: string;
  onRubricSave: (rubric: Rubric) => void;
  existingRubric?: Rubric;
}

const RubricUploader = ({ assessmentId, onRubricSave, existingRubric }: RubricUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [rubric, setRubric] = useState<Partial<Rubric>>(existingRubric || {
    name: "",
    description: "",
    content: "",
    criteria: [],
    assessmentId
  });
  
  const [parsedContent, setParsedContent] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };
  
  const handleFile = (file: File) => {
    // Simple text extraction
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setParsedContent(content);
        setRubric(prev => ({ ...prev, content, name: file.name.replace(/\.\w+$/, '') }));
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Unsupported file type",
        description: "Only .txt files are supported at the moment.",
        variant: "destructive"
      });
    }
  };
  
  const analyzeRubric = async () => {
    if (!rubric.content) return;
    
    setIsAnalyzing(true);
    
    // In a real implementation, this would call an API to analyze the rubric using OpenAI
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example criteria based on content analysis
      const sampleCriteria: RubricCriterion[] = [
        {
          id: "crit1",
          name: "Understanding of Concepts",
          description: "Student demonstrates clear understanding of core concepts",
          maxScore: 10,
          weightPercentage: 25
        },
        {
          id: "crit2",
          name: "Application of Knowledge",
          description: "Student applies concepts to solve problems effectively",
          maxScore: 10,
          weightPercentage: 25
        },
        {
          id: "crit3",
          name: "Clarity and Communication",
          description: "Student articulates ideas clearly and effectively",
          maxScore: 10,
          weightPercentage: 25
        },
        {
          id: "crit4",
          name: "Critical Analysis",
          description: "Student demonstrates critical thinking and analysis",
          maxScore: 10,
          weightPercentage: 25
        }
      ];
      
      setRubric(prev => ({
        ...prev,
        criteria: sampleCriteria
      }));
      
      toast({
        title: "Rubric analyzed",
        description: "AI has extracted criteria from your rubric."
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the rubric. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const saveRubric = () => {
    if (!rubric.name || !rubric.content || !rubric.criteria?.length) {
      toast({
        title: "Incomplete rubric",
        description: "Please provide a name, content, and analyze the rubric to extract criteria.",
        variant: "destructive"
      });
      return;
    }
    
    const newRubric: Rubric = {
      id: existingRubric?.id || `rubric-${Date.now()}`,
      name: rubric.name || "Unnamed Rubric",
      description: rubric.description || "",
      content: rubric.content || "",
      criteria: rubric.criteria || [],
      createdBy: "admin@complex.com",
      createdAt: existingRubric?.createdAt || new Date(),
      assessmentId
    };
    
    onRubricSave(newRubric);
    toast({
      title: "Rubric saved",
      description: "The rubric has been saved successfully."
    });
  };
  
  const addEmptyCriterion = () => {
    setRubric(prev => ({
      ...prev,
      criteria: [
        ...(prev.criteria || []),
        {
          id: `crit-${Date.now()}`,
          name: "",
          description: "",
          maxScore: 10,
          weightPercentage: 0
        }
      ]
    }));
  };
  
  const updateCriterion = (index: number, field: keyof RubricCriterion, value: string | number) => {
    if (!rubric.criteria) return;
    
    const newCriteria = [...rubric.criteria];
    newCriteria[index] = {
      ...newCriteria[index],
      [field]: value
    };
    
    setRubric(prev => ({
      ...prev,
      criteria: newCriteria
    }));
  };
  
  const removeCriterion = (index: number) => {
    if (!rubric.criteria) return;
    
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria?.filter((_, i) => i !== index) || []
    }));
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Assessment Rubric
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rubricName">Rubric Name</Label>
              <Input 
                id="rubricName" 
                value={rubric.name || ""}
                onChange={e => setRubric(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter rubric name"
              />
            </div>
            <div>
              <Label htmlFor="rubricDescription">Description (Optional)</Label>
              <Input 
                id="rubricDescription" 
                value={rubric.description || ""}
                onChange={e => setRubric(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this rubric"
              />
            </div>
          </div>
          
          {!rubric.content ? (
            <div 
              className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".txt"
                onChange={handleFileSelect}
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-10 w-10 text-gray-400" />
                <h3 className="text-lg font-medium">Upload Rubric Document</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Drag and drop your rubric file here, or click to browse
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>
                <p className="text-xs text-gray-400 mt-2">
                  Supported format: .txt
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Rubric Content</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setRubric(prev => ({ ...prev, content: "" }));
                      setParsedContent("");
                    }}
                  >
                    <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
                </div>
                <Textarea 
                  value={rubric.content}
                  onChange={e => setRubric(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[150px]"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={analyzeRubric}
                    disabled={!rubric.content || isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                  </Button>
                </div>
              </div>
              
              {rubric.criteria && rubric.criteria.length > 0 && (
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Rubric Criteria</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addEmptyCriterion}
                    >
                      Add Criterion
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {rubric.criteria.map((criterion, index) => (
                      <div key={criterion.id} className="border p-3 rounded-md">
                        <div className="flex justify-between mb-2">
                          <h4 className="text-sm font-medium">Criterion {index + 1}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeCriterion(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <Label htmlFor={`criterion-name-${index}`}>Name</Label>
                            <Input 
                              id={`criterion-name-${index}`} 
                              value={criterion.name}
                              onChange={e => updateCriterion(index, "name", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`criterion-desc-${index}`}>Description</Label>
                            <Textarea 
                              id={`criterion-desc-${index}`} 
                              value={criterion.description}
                              onChange={e => updateCriterion(index, "description", e.target.value)}
                              className="min-h-[60px]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor={`criterion-max-${index}`}>Max Score</Label>
                              <Input 
                                id={`criterion-max-${index}`} 
                                type="number"
                                value={criterion.maxScore}
                                onChange={e => updateCriterion(index, "maxScore", parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`criterion-weight-${index}`}>Weight (%)</Label>
                              <Input 
                                id={`criterion-weight-${index}`} 
                                type="number"
                                value={criterion.weightPercentage || 0}
                                onChange={e => updateCriterion(index, "weightPercentage", parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={saveRubric}>
                  <Save className="h-4 w-4 mr-2" /> Save Rubric
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RubricUploader;
