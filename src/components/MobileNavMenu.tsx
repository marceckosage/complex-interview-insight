
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Menu, Sparkles, Zap, HeartHandshake, Settings } from "lucide-react";

export function MobileNavMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-brand-purple">
            Complex<span className="text-brand-dark-purple">Chemistry</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4">
          <Button
            variant="ghost"
            className="justify-start text-left h-12 px-4"
            onClick={() => handleNavigation("/")}
          >
            <Sparkles className="mr-3 h-5 w-5" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-12 px-4"
            onClick={() => handleNavigation("/assessments")}
          >
            <Zap className="mr-3 h-5 w-5" />
            Assessments
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-12 px-4"
            onClick={() => handleNavigation("/results")}
          >
            <HeartHandshake className="mr-3 h-5 w-5" />
            Insights
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-12 px-4"
            onClick={() => handleNavigation("/admin")}
          >
            <Settings className="mr-3 h-5 w-5" />
            Admin
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
