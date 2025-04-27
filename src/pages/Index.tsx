import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Calendar, Search, Settings } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  return <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-brand-gray-900">
            Hello Stranger, Welcome to<br />
            <span className="text-brand-primary">Complex</span>
            <span className="text-brand-accent">Chemistry</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto px-4">At Complex, we seek bold creative thinkers, generous collaborators and strive for approaches that look to make MEANING out of our time and resources. Our pre-interview assessments aim to bring together like minded people, who share the value of wanting to be generative in their outputs and win together. Don't get it? It's Complex.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-lg mx-auto px-4">
            <Button onClick={() => navigate("/assessments")} size="lg" className="h-14 md:h-16 text-lg hover-scale shadow-neumorphic hover:shadow-lg active:shadow-neumorphic-inset">
              <Calendar className="h-5 w-5" />
              Create Assessment
            </Button>
            <Button onClick={() => navigate("/take-assessment")} size="lg" variant="outline" className="h-14 md:h-16 text-lg hover-scale border-brand-gray-300 text-brand-gray-700 hover:text-brand-gray-900">
              <Search className="h-5 w-5" />
              Take Assessment
            </Button>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          <div className="bg-white p-6 shadow-neumorphic">
            <div className="h-12 w-12 bg-brand-primary bg-opacity-10 flex items-center justify-center mb-4">
              <Settings className="text-brand-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-gray-900">Creative Connection</h3>
            <p className="text-brand-gray-600">
              Find and connect with exceptional creative talent who share your vision 
              and cultural values through our innovative assessment platform.
            </p>
          </div>
          
          <div className="bg-white p-6 shadow-neumorphic">
            <div className="h-12 w-12 bg-brand-secondary bg-opacity-10 flex items-center justify-center mb-4">
              <Calendar className="text-brand-secondary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-gray-900">Meaningful Assessment</h3>
            <p className="text-brand-gray-600">
              Our assessment process goes beyond skills to uncover shared values, creative 
              alignment, and the potential for lasting collaborative relationships.
            </p>
          </div>
          
          <div className="bg-white p-6 shadow-neumorphic">
            <div className="h-12 w-12 bg-brand-accent bg-opacity-10 flex items-center justify-center mb-4">
              <Search className="text-brand-accent h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-gray-900">Cultural Alignment</h3>
            <p className="text-brand-gray-600">
              Discover creative partners who truly understand and share your cultural 
              perspective, leading to more meaningful and impactful collaborations.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>;
};
export default Index;