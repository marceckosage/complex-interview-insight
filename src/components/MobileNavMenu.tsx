
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
import { Menu, Calendar, Home, Inbox, Settings } from "lucide-react";

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
      <SheetContent side="left" className="w-[85vw] max-w-sm border-r shadow-lg">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            Complex<span className="text-brand-primary">Chemistry</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4">
          <Button
            variant="ghost"
            className="justify-start text-left h-12 px-4 hover:bg-brand-gray-100 transition-colors"
            onClick={() => handleNavigation("/")}
          >
            <Home className="mr-3 h-5 w-5" />
            <span>Home</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-12 px-4 hover:bg-brand-gray-100 transition-colors"
            onClick={() => handleNavigation("/assessments")}
          >
            <Calendar className="mr-3 h-5 w-5" />
            <span>Assessments</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-12 px-4 hover:bg-brand-gray-100 transition-colors"
            onClick={() => handleNavigation("/results")}
          >
            <Inbox className="mr-3 h-5 w-5" />
            <span>Insights</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-12 px-4 hover:bg-brand-gray-100 transition-colors"
            onClick={() => handleNavigation("/admin")}
          >
            <Settings className="mr-3 h-5 w-5" />
            <span>Admin</span>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
