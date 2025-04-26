
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Question, AssessmentResult, Assessment } from "@/types/assessment";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface AssessmentDashboardProps {
  assessment: Assessment;
  result: AssessmentResult;
  questionScores: { [key: string]: number };
}

const AssessmentDashboard = ({ assessment, result, questionScores }: AssessmentDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Prepare data for charts
  const totalScore = Object.values(questionScores).reduce((sum, score) => sum + score, 0);
  const maxPossibleScore = assessment.questions.reduce((sum, q) => sum + (q.maxScore || 0), 0);
  const scorePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  
  // Group questions by type
  const questionsByType = assessment.questions.reduce((acc, question) => {
    const type = question.type;
    if (!acc[type]) {
      acc[type] = {
        questions: [],
        maxScore: 0,
        score: 0
      };
    }
    
    acc[type].questions.push(question);
    acc[type].maxScore += question.maxScore || 0;
    acc[type].score += questionScores[question.id] || 0;
    
    return acc;
  }, {} as Record<string, { questions: Question[], maxScore: number, score: number }>);
  
  const typePerformanceData = Object.entries(questionsByType).map(([type, data]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
    score: data.score,
    maxScore: data.maxScore,
    percentage: data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0
  }));
  
  // Group questions by category if available
  const questionsByCategory = assessment.questions.reduce((acc, question) => {
    const category = question.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = {
        questions: [],
        maxScore: 0,
        score: 0
      };
    }
    
    acc[category].questions.push(question);
    acc[category].maxScore += question.maxScore || 0;
    acc[category].score += questionScores[question.id] || 0;
    
    return acc;
  }, {} as Record<string, { questions: Question[], maxScore: number, score: number }>);
  
  const categoryPerformanceData = Object.entries(questionsByCategory).map(([category, data]) => ({
    name: category,
    score: data.score,
    maxScore: data.maxScore,
    fullMark: data.maxScore
  }));
  
  // Calculate strengths and weaknesses
  const strengthThreshold = 80; // 80% score is considered a strength
  const weaknessThreshold = 40; // 40% score is considered a weakness
  
  const strengths = categoryPerformanceData
    .filter(item => (item.score / item.maxScore) * 100 >= strengthThreshold)
    .map(item => item.name);
    
  const weaknesses = categoryPerformanceData
    .filter(item => (item.score / item.maxScore) * 100 <= weaknessThreshold)
    .map(item => item.name);

  // Score level labels
  const getScoreLevel = () => {
    if (scorePercentage >= 90) return "Excellent";
    if (scorePercentage >= 80) return "Very Good";
    if (scorePercentage >= 70) return "Good";
    if (scorePercentage >= 60) return "Satisfactory";
    if (scorePercentage >= 50) return "Average";
    if (scorePercentage >= 40) return "Needs Improvement";
    return "Poor";
  };
  
  const textColor = scorePercentage >= 70 ? "text-green-600" : 
                    scorePercentage >= 50 ? "text-yellow-600" : 
                    "text-red-600";
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Assessment Performance Dashboard</span>
          <div className="text-sm font-normal flex items-center gap-2">
            Graded by: <span className="font-semibold">{result.gradedBy || "Automatic"}</span>
            {result.gradedAt && (
              <span className="text-gray-500">
                on {new Date(result.gradedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">
                <span>{totalScore}</span>
                <span className="text-gray-500 text-lg"> / {maxPossibleScore}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Total Score</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">
                <span className={textColor}>{scorePercentage}%</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Score Percentage</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">
                <span className={textColor}>{getScoreLevel()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Performance Level</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="byType">By Question Type</TabsTrigger>
            <TabsTrigger value="byCategory">By Category</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  {strengths.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {strengths.map((strength, idx) => (
                        <li key={idx} className="text-green-600">{strength}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No notable strengths identified.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  {weaknesses.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-red-600">{weakness}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No notable weaknesses identified.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {result.analytics?.aiAnalysis && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{result.analytics.aiAnalysis}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="byType">
            <div className="h-80">
              <ChartContainer config={{}} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={typePerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <XAxis 
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Score', 
                        angle: -90, 
                        position: 'insideLeft' 
                      }} 
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Score
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {payload[0].value}/{payload[1].value}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Percentage
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {payload[2].value}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="score" fill="#8884d8" name="Score" />
                    <Bar dataKey="maxScore" fill="#82ca9d" name="Max Possible" />
                    <Bar dataKey="percentage" fill="#ffc658" name="Percentage" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="byCategory">
            <div className="h-80">
              <ChartContainer config={{}} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} width={730} height={250} data={categoryPerformanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Maximum" dataKey="maxScore" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <ChartTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssessmentDashboard;
