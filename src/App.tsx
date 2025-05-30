import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Removed useMobileView and cn imports

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

const App = () => ( // Reverted to original functional component structure
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Removed conditional wrapper div */}
      <BrowserRouter>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
); // Close original component structure

export default App;
