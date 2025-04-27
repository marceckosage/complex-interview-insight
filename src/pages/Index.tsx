
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Calendar, Search, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  return <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-brand-gray">
            Hello Stranger, Welcome to<br />
            <span className="text-brand-red">Complex</span>
            <span className="text-brand-dark-red">Chemistry</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            At Complex, we seek bold creative thinkers, generous collaborators and strive for approaches that look to make MEANING out of work. 
            Our pre-interview assessments aim to bring together risk-takers, innovators, and cultural catalyzers and build the perfect teams. 
            Don't get it? It's Complex.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-lg mx-auto px-4">
            <Button 
              onClick={() => navigate("/assessments")} 
              size="lg" 
              className="h-14 md:h-16 text-lg hover-scale flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-dark-green"
            >
              <Calendar className="h-5 w-5" />
              Create Assessment
            </Button>
            <Button 
              onClick={() => navigate("/take-assessment")} 
              size="lg" 
              variant="outline" 
              className="h-14 md:h-16 text-lg hover-scale flex items-center justify-center gap-2 border-brand-gray text-brand-gray hover:bg-brand-light-gray"
            >
              <Search className="h-5 w-5" />
              Take Assessment
            </Button>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          <div className="card-neumorphic p-6">
            <div className="h-12 w-12 bg-brand-red bg-opacity-10 flex items-center justify-center mb-4">
              <Settings className="text-brand-red h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Creative Connection</h3>
            <p className="text-gray-600">
              Find and connect with exceptional creative talent who share your vision 
              and cultural values through our innovative assessment platform.
            </p>
          </div>
          
          <div className="card-neumorphic p-6">
            <div className="h-12 w-12 bg-brand-green bg-opacity-10 flex items-center justify-center mb-4">
              <Calendar className="text-brand-green h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Meaningful Assessment</h3>
            <p className="text-gray-600">
              Our assessment process goes beyond skills to uncover shared values, creative 
              alignment, and the potential for lasting collaborative relationships.
            </p>
          </div>
          
          <div className="card-neumorphic p-6">
            <div className="h-12 w-12 bg-brand-orange bg-opacity-10 flex items-center justify-center mb-4">
              <Search className="text-brand-orange h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cultural Alignment</h3>
            <p className="text-gray-600">
              Discover creative partners who truly understand and share your cultural 
              perspective, leading to more meaningful and impactful collaborations.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>;
};
export default Index;
