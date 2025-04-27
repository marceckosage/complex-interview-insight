
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileNavMenu } from "@/components/MobileNavMenu";
// Removed Switch, Label, and useMobileView imports

export default function Header() {
  // Removed isMobileView state management
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b border-brand-gray-200 py-3 sticky top-0 z-20 shadow-neumorphic">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <div className="flex items-center">
          <h1 
            onClick={() => navigate("/")}
            className="text-xl md:text-2xl font-bold cursor-pointer transition-colors hover:text-brand-primary"
          >
            Complex<span className="text-brand-primary">Chemistry</span>
          </h1>
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileNavMenu />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/assessments")}
            className="hover:bg-brand-gray-100 transition-colors"
          >
            Assessments
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate("/results")}
            className="hover:bg-brand-gray-100 transition-colors"
          >
            Insights
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="hover:bg-brand-gray-100 font-medium transition-colors"
          >
            Admin
          </Button>
          {/* Removed Mobile View Switch div */}
        </nav>
      </div>
    </header>
  );
}
