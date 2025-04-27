
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { BookOpen, Video, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-gray-900">
            <span className="text-brand-purple">Complex</span> Assessment Platform
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Create, administer, and evaluate comprehensive assessments for job interviews and evaluations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-lg mx-auto px-4">
            <Button 
              onClick={() => navigate("/assessments")}
              size="lg"
              className="h-14 md:h-16 text-lg hover-scale flex items-center justify-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Manage Assessments
            </Button>
            <Button 
              onClick={() => navigate("/take-assessment")}
              size="lg" 
              variant="outline" 
              className="h-14 md:h-16 text-lg hover-scale flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              Take Assessment
            </Button>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 bg-brand-purple bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="text-brand-purple h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Choice Questions</h3>
            <p className="text-gray-600">
              Create structured assessments with multiple-choice questions for quantitative evaluations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 bg-brand-purple bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="text-brand-purple h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Written Responses</h3>
            <p className="text-gray-600">
              Collect detailed qualitative answers with text-based responses for deeper insights.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 bg-brand-purple bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <Video className="text-brand-purple h-6 w-6" />
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
