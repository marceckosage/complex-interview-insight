
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { useNavigate } from "react-router-dom";

const AssessmentComplete = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout userType="candidate" userName="Test Candidate">
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Assessment Completed!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for completing the assessment. Your responses have been submitted successfully.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-2">What happens next?</h2>
          <p className="text-gray-600">
            Our team will review your assessment and get back to you with the results. 
            You'll receive an email notification once the assessment has been graded.
          </p>
        </div>
        
        <Button onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </div>
    </PageLayout>
  );
};

export default AssessmentComplete;
