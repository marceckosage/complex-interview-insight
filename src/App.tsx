
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Add these imports
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AssessmentList from "./pages/AssessmentList";
import CreateAssessment from "./pages/CreateAssessment";
import EditAssessment from "./pages/EditAssessment";
import ViewAssessment from "./pages/ViewAssessment";
import TakeAssessment from "./pages/TakeAssessment";
import AssessmentComplete from "./pages/AssessmentComplete";
import ResultsList from "./pages/ResultsList";
import ResultReview from "./pages/ResultReview";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/assessments" element={<AssessmentList />} />
            <Route path="/create-assessment" element={<CreateAssessment />} />
            <Route path="/edit-assessment/:id" element={<EditAssessment />} />
            <Route path="/clone-assessment/:id" element={<CreateAssessment />} />
            <Route path="/view-assessment/:id" element={<ViewAssessment />} />
            <Route path="/take-assessment" element={<TakeAssessment />} />
            <Route path="/take-assessment/:id" element={<TakeAssessment />} />
            <Route path="/assessment-complete" element={<AssessmentComplete />} />
            <Route path="/results" element={<ResultsList />} />
            <Route path="/results/:id" element={<ResultsList />} />
            <Route path="/results/review/:id" element={<ResultReview />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
