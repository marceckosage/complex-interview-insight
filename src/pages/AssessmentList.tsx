
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
import { getAssessments, deleteAssessment } from "@/services/mockData";
import { Assessment } from "@/types/assessment";
import { format } from "date-fns";
import { Archive, Download, Edit, Eye, FileHeart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { exportAssessmentToCSV } from "@/utils/exportUtils";

const AssessmentList = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
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
    setAssessments(prev => 
      prev.map(assessment => 
        assessment.id === id 
          ? { ...assessment, isArchived: false } 
          : assessment
      )
    );
    toast.success("Assessment restored successfully");
  };

  const handleDeleteConfirm = async () => {
    if (!assessmentToDelete) return;
    
    try {
      await deleteAssessment(assessmentToDelete);
      setAssessments(prev => prev.filter(assessment => assessment.id !== assessmentToDelete));
      toast.success("Assessment permanently deleted");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("Failed to delete assessment");
    } finally {
      setDeleteDialogOpen(false);
      setAssessmentToDelete(null);
    }
  };
  
  const handleExportToCSV = async (assessment: Assessment) => {
    setExportLoading(assessment.id);
    try {
      await exportAssessmentToCSV(assessment);
      toast.success("Assessment exported successfully");
    } catch (error) {
      console.error("Error exporting assessment:", error);
      toast.error("Failed to export assessment");
    } finally {
      setExportLoading(null);
    }
  };

  const activeAssessments = assessments.filter(a => !a.isArchived);
  const archivedAssessments = assessments.filter(a => a.isArchived);

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Assessments</h1>
          <p className="text-gray-600 mt-1">Manage your assessment tests</p>
        </div>
        <Button 
          onClick={() => navigate("/create-assessment")}
          className="w-full md:w-auto py-3 md:py-2 text-base md:text-sm hover:bg-primary/90 transition-colors"
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
                        <FileHeart className="mr-2 h-4 w-4" /> View Results
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/clone-assessment/${assessment.id}`)}>
                        <FileHeart className="mr-2 h-4 w-4" /> Clone Assessment
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchiveAssessment(assessment.id)}>
                        <Archive className="mr-2 h-4 w-4" /> Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportToCSV(assessment)}>
                        <Download className="mr-2 h-4 w-4" /> 
                        {exportLoading === assessment.id ? "Exporting..." : "Export as CSV"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600" 
                        onClick={() => {
                          setAssessmentToDelete(assessment.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUnarchiveAssessment(assessment.id)}
                        >
                          Restore
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleExportToCSV(assessment)}
                          className="ml-2"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setAssessmentToDelete(assessment.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Delete Assessment
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this assessment
              and all of its data including questions, results, and analytics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default AssessmentList;
