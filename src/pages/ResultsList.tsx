
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { format } from "date-fns";
import { getAssessmentById, getResultsByAssessmentId } from "@/services/mockData";
import { Assessment, AssessmentResult } from "@/types/assessment";
import { Separator } from "@/components/ui/separator";

const ResultsList = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const assessmentData = await getAssessmentById(id);
          if (assessmentData) {
            setAssessment(assessmentData);
            const resultsData = await getResultsByAssessmentId(id);
            setResults(resultsData);
          } else {
            setError("Assessment not found");
          }
        } else {
          // If no id provided, we'll list all assessments for the results page
          const assessmentsData = await getAssessmentById("1"); // Mock data, in real app would fetch all
          if (assessmentsData) {
            setAssessment(assessmentsData);
            const resultsData = await getResultsByAssessmentId("1"); // Mock data
            setResults(resultsData);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleExportCSV = () => {
    if (!results.length || !assessment) return;
    
    // Create CSV content
    const headers = ['Candidate Name', 'Email', 'Submission Date', 'Score', 'Status'];
    const rows = results.map(result => [
      result.userName,
      result.userEmail,
      format(new Date(result.submittedAt), 'yyyy-MM-dd HH:mm'),
      result.score?.toString() || 'Not graded',
      result.gradedAt ? 'Graded' : 'Pending'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${assessment.title.replace(/\s+/g, '_')}_results.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  
  if (error) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{error}</h2>
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
          <h1 className="text-3xl font-bold">Assessment Results</h1>
          {assessment && (
            <p className="text-gray-600 mt-1">
              {assessment.title} • {results.length} submission{results.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/assessments")}
          >
            Back to Assessments
          </Button>
          <Button onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
      </div>
      
      {results.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No results yet</h2>
          <p className="text-gray-600 mb-6">
            No candidates have completed this assessment yet.
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate(`/take-assessment/${assessment?.id}`)}
          >
            Preview Assessment
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.userName}</TableCell>
                    <TableCell>{result.userEmail}</TableCell>
                    <TableCell>{format(new Date(result.submittedAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      {result.score !== undefined 
                        ? <span className="font-medium">{result.score}</span>
                        : <span className="text-gray-500">Not graded</span>
                      }
                    </TableCell>
                    <TableCell>
                      {result.gradedAt ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Graded
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/results/review/${result.id}`)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Separator className="my-8" />
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <div className="text-2xl font-bold mb-1">
                  {results.length}
                </div>
                <div className="text-gray-500 text-sm">
                  Total Submissions
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <div className="text-2xl font-bold mb-1">
                  {results.filter(r => r.score !== undefined).length}
                </div>
                <div className="text-gray-500 text-sm">
                  Graded Assessments
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <div className="text-2xl font-bold mb-1">
                  {results.length > 0 && results.some(r => r.score !== undefined)
                    ? Math.round(
                        results
                          .filter(r => r.score !== undefined)
                          .reduce((sum, r) => sum + (r.score || 0), 0) / 
                        results.filter(r => r.score !== undefined).length
                      )
                    : "N/A"}
                </div>
                <div className="text-gray-500 text-sm">
                  Average Score
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
};

export default ResultsList;
