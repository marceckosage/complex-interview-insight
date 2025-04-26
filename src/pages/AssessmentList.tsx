
import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getAssessments } from "@/services/mockData";
import { Assessment } from "@/types/assessment";
import { format } from "date-fns";
import { Archive, Edit, Eye, FileChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";

const AssessmentList = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getAssessments();
        setAssessments(data);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        toast.error("Failed to load assessments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleArchiveAssessment = (id: string) => {
    // In a real app, this would call an API to archive the assessment
    setAssessments(prev => 
      prev.map(assessment => 
        assessment.id === id 
          ? { ...assessment, isArchived: true } 
          : assessment
      )
    );
    toast.success("Assessment archived successfully");
  };

  const handleUnarchiveAssessment = (id: string) => {
    // In a real app, this would call an API to unarchive the assessment
    setAssessments(prev => 
      prev.map(assessment => 
        assessment.id === id 
          ? { ...assessment, isArchived: false } 
          : assessment
      )
    );
    toast.success("Assessment restored successfully");
  };

  const activeAssessments = assessments.filter(a => !a.isArchived);
  const archivedAssessments = assessments.filter(a => a.isArchived);

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Assessments</h1>
          <p className="text-gray-600 mt-1">Manage your assessment tests</p>
        </div>
        <Button 
          onClick={() => navigate("/create-assessment")}
          className="hover-scale"
        >
          Create New Assessment
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      ) : activeAssessments.length === 0 && archivedAssessments.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <p className="text-gray-500 mb-6">No assessments have been created yet.</p>
            <Button onClick={() => navigate("/create-assessment")}>
              Create Your First Assessment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {activeAssessments.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-md transition-shadow animate-fade-in">
                <CardHeader>
                  <CardTitle>{assessment.title}</CardTitle>
                  <CardDescription className="flex justify-between items-center mt-1">
                    <span>
                      {assessment.questions.length} questions
                      {assessment.timeLimit && ` • ${assessment.timeLimit} min`}
                    </span>
                    <span className="text-xs text-gray-500">
                      Created {format(new Date(assessment.createdAt), 'MMM d, yyyy')}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">{assessment.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/view-assessment/${assessment.id}`)}
                    >
                      <Eye className="mr-1 h-4 w-4" /> View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/edit-assessment/${assessment.id}`)}
                    >
                      <Edit className="mr-1 h-4 w-4" /> Edit
                    </Button>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">More</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => navigate(`/results/${assessment.id}`)}>
                        <FileChart className="mr-2 h-4 w-4" /> View Results
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/clone-assessment/${assessment.id}`)}>
                        <FileChart className="mr-2 h-4 w-4" /> Clone Assessment
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchiveAssessment(assessment.id)}>
                        <Archive className="mr-2 h-4 w-4" /> Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>

          {archivedAssessments.length > 0 && (
            <>
              <div className="flex items-center mb-4 mt-8">
                <h2 className="text-xl font-semibold">Archived Assessments</h2>
                <Badge variant="outline" className="ml-2">
                  {archivedAssessments.length}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archivedAssessments.map((assessment) => (
                  <Card key={assessment.id} className="opacity-70 hover:opacity-100 transition-opacity">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {assessment.title}
                        <Badge variant="outline" className="ml-2">Archived</Badge>
                      </CardTitle>
                      <CardDescription className="flex justify-between items-center mt-1">
                        <span>
                          {assessment.questions.length} questions
                          {assessment.timeLimit && ` • ${assessment.timeLimit} min`}
                        </span>
                        <span className="text-xs text-gray-500">
                          Created {format(new Date(assessment.createdAt), 'MMM d, yyyy')}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-2">{assessment.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/view-assessment/${assessment.id}`)}
                      >
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleUnarchiveAssessment(assessment.id)}
                      >
                        Restore
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default AssessmentList;
