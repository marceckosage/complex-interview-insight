
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
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

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
      ) : assessments.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <p className="text-gray-500 mb-6">No assessments have been created yet.</p>
            <Button onClick={() => navigate("/create-assessment")}>
              Create Your First Assessment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/view-assessment/${assessment.id}`)}
                >
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/results/${assessment.id}`)}
                >
                  Results
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default AssessmentList;
