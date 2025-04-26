
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const Index = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Comprehensive Assessment Platform for<br />
            <span className="text-brand-purple">Complex</span> Evaluations
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Create, administer, and evaluate assessments with multiple-choice questions,
            written responses, and video submissions for job interviews and evaluations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <Button 
              onClick={() => navigate("/assessments")}
              size="lg"
              className="h-16 text-lg hover-scale"
            >
              Manage Assessments
            </Button>
            <Button 
              onClick={() => navigate("/take-assessment")}
              size="lg" 
              variant="outline" 
              className="h-16 text-lg hover-scale"
            >
              Take an Assessment
            </Button>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 bg-brand-purple bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Choice Questions</h3>
            <p className="text-gray-600">
              Create structured assessments with multiple-choice questions for quantitative evaluations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 bg-brand-purple bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 17h6"/><path d="M9 13h6"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Written Responses</h3>
            <p className="text-gray-600">
              Collect detailed qualitative answers with text-based responses for deeper insights.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 bg-brand-purple bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Submissions</h3>
            <p className="text-gray-600">
              Evaluate candidates' presentation and communication skills through video recordings.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
