
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAssessmentById } from "@/services/mockData";
import { Assessment } from "@/types/assessment";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit, Share } from "lucide-react";
import ShareAssessmentModal from "@/components/ShareAssessmentModal";

const ViewAssessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        if (id) {
          const data = await getAssessmentById(id);
          if (data) {
            setAssessment(data);
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

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      </PageLayout>
    );
  }

  if (error || !assessment) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{error || "Assessment not found"}</h2>
          <Button onClick={() => navigate("/assessments")}>
            Return to Assessments
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">{assessment.title}</h1>
          <p className="text-gray-600 mt-1">{assessment.description}</p>
          {assessment.timeLimit && (
            <p className="text-gray-600 mt-2">
              Time Limit: {assessment.timeLimit} minutes
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate(`/results/${assessment.id}`)}
          >
            View Results
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/edit-assessment/${assessment.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button onClick={() => setIsShareModalOpen(true)}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Questions ({assessment.questions.length})</h2>
          <div className="space-y-6">
            {assessment.questions.map((question, index) => (
              <div key={question.id}>
                {index > 0 && <Separator className="my-6" />}
                <div>
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
                      <span className="text-gray-500 text-xs">
                        {question.maxScore} points
                      </span>
                    </div>
                  </div>
                  <p className="mb-4">{question.text}</p>

                  {question.type === "multiple-choice" && question.options && (
                    <div className="pl-4 space-y-2">
                      {question.options.map((option) => (
                        <div 
                          key={option.id} 
                          className={`p-3 border rounded-md ${
                            option.isCorrect 
                              ? "border-green-500 bg-green-50" 
                              : "border-gray-200"
                          }`}
                        >
                          {option.text}
                          {option.isCorrect && (
                            <span className="ml-2 text-green-600 text-xs font-medium">
                              (Correct Answer)
                            </span>
                          )}
                          {option.score !== undefined && (
                            <span className="ml-2 text-gray-500 text-xs">
                              Score: {option.score}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "text" && (
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                      <p className="text-gray-500 italic">Text response question</p>
                    </div>
                  )}

                  {question.type === "video" && (
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                      <p className="text-gray-500 italic">Video response question</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <ShareAssessmentModal 
        assessmentId={assessment.id}
        assessmentTitle={assessment.title}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </PageLayout>
  );
};

export default ViewAssessment;
