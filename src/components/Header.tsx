
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileNavMenu } from "@/components/MobileNavMenu";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background border-b border-border py-4 sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <div className="flex items-center">
          <h1 
            onClick={() => navigate("/")}
            className="text-xl md:text-2xl font-bold text-brand-gray cursor-pointer"
          >
            Complex<span className="text-brand-dark-red">Chemistry</span>
          </h1>
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileNavMenu />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/assessments")}
          >
            Assessments
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate("/results")}
          >
            Insights
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate("/admin")}
          >
            Admin
          </Button>
        </nav>
      </div>
    </header>
  );
}
