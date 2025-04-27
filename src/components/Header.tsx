
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <div className="flex items-center">
          <h1 
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-brand-purple cursor-pointer"
          >
            Complex<span className="text-brand-dark-purple">Assess</span>
          </h1>
        </div>
        <nav className="flex items-center gap-4">
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
            Results
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
