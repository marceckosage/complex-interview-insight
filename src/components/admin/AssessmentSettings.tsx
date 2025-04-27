
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAssessments, deleteAssessment } from "@/services/mockData";
import { exportAssessmentToCSV } from "@/utils/exportUtils";
import { Assessment } from "@/types/assessment";
import { Download, Trash2, Archive } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const AssessmentSettings = () => {
  const [tab, setTab] = useState("general");
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
  
  const archivedAssessments = assessments.filter(a => a.isArchived);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessment Settings</CardTitle>
          <CardDescription>
            Configure settings for your assessments and manage archived content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="defaults">Default Settings</TabsTrigger>
              <TabsTrigger value="archive">Archive Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Label htmlFor="assessment-naming">Assessment Naming</Label>
                  <Input
                    id="assessment-naming"
                    placeholder="Default naming convention"
                    defaultValue="[Department] - [Role] Assessment"
                  />
                  <p className="text-sm text-gray-500">
                    Define the default naming convention for new assessments
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Label htmlFor="question-limit">Maximum Questions</Label>
                  <Input
                    id="question-limit"
                    type="number"
                    placeholder="50"
                    defaultValue="50"
                  />
                  <p className="text-sm text-gray-500">
                    Set the maximum number of questions allowed in a single assessment
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="defaults" className="space-y-4">
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Label htmlFor="default-time-limit">Default Time Limit (minutes)</Label>
                  <Input
                    id="default-time-limit"
                    type="number"
                    placeholder="60"
                    defaultValue="60"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Label htmlFor="default-passing-score">Default Passing Score (%)</Label>
                  <Input
                    id="default-passing-score"
                    type="number"
                    placeholder="70"
                    defaultValue="70"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="archive" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Archived Assessments</h3>
                
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
                  </div>
                ) : archivedAssessments.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600">No archived assessments found</p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Created Date</TableHead>
                          <TableHead>Questions</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {archivedAssessments.map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell className="font-medium">{assessment.title}</TableCell>
                            <TableCell>{format(new Date(assessment.createdAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{assessment.questions.length}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUnarchiveAssessment(assessment.id)}
                                >
                                  <Archive className="h-4 w-4 mr-1" /> Restore
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleExportToCSV(assessment)}
                                  disabled={exportLoading === assessment.id}
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
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Archive Settings</h4>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="auto-archive">Auto Archive Period (days)</Label>
                      <Input
                        id="auto-archive"
                        type="number"
                        placeholder="365"
                        defaultValue="365"
                      />
                      <p className="text-sm text-gray-500">
                        Assessments will be automatically archived after this many days of inactivity
                      </p>
                    </div>
                    <Button>Save Archive Settings</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Delete Assessment Permanently
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
    </div>
  );
};

export default AssessmentSettings;
