
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Sparkles, Combine, Zap, HeartHandshake } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-gray-900">
            Hello Stranger, Welcome to<br />
            <span className="text-brand-purple">Complex</span>
            <span className="text-brand-dark-purple">Chemistry</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Where bold culture-making voices converge, ideas ignite, and cultural materials 
            become valuable as creators thrive and audiences rise. Let's make meaning together.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-lg mx-auto px-4">
            <Button 
              onClick={() => navigate("/assessments")}
              size="lg"
              className="h-14 md:h-16 text-lg hover-scale flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Start Creating
            </Button>
            <Button 
              onClick={() => navigate("/take-assessment")}
              size="lg" 
              variant="outline" 
              className="h-14 md:h-16 text-lg hover-scale flex items-center justify-center gap-2"
            >
              <HeartHandshake className="h-5 w-5" />
              Join Community
            </Button>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 bg-brand-purple bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <Combine className="text-brand-purple h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cultural Convergence</h3>
            <p className="text-gray-600">
              A vibrant space where diverse voices meet, share perspectives, and create 
              meaningful cultural dialogues together.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 bg-brand-purple bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-brand-purple h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Idea Ignition</h3>
            <p className="text-gray-600">
              Watch your ideas spark and evolve as they interact with our community of 
              passionate creators and cultural catalysts.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 bg-brand-purple bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <HeartHandshake className="text-brand-purple h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Value Creation</h3>
            <p className="text-gray-600">
              Transform cultural materials into valuable assets as we build meaningful 
              connections between creators and audiences.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
