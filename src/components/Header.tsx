
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

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
          {profile?.role === 'admin' && (
            <Button 
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="hover:bg-brand-gray-100 font-medium transition-colors"
            >
              Admin
            </Button>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                    <AvatarFallback>{profile?.full_name?.[0] ?? 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/auth")}>
              Sign in
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
