
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import SearchResults from "./pages/SearchResults";
import TeacherProfile from "./pages/TeacherProfile";
import Payment from "./pages/Payment";
import Classroom from "./pages/Classroom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Feature block routes */}
          <Route path="/children-courses" element={<NotFound />} />
          <Route path="/women-courses" element={<NotFound />} />
          <Route path="/live-courses" element={<NotFound />} />
          <Route path="/sos-partner" element={<NotFound />} />
          <Route path="/sos-havrouta" element={<NotFound />} />
          
          {/* Subject routes */}
          <Route path="/subjects/:subjectId" element={<NotFound />} />
          
          {/* Platform functionality */}
          <Route path="/search" element={<SearchResults />} />
          <Route path="/teachers/:teacherId" element={<TeacherProfile />} />
          <Route path="/booking/:teacherId" element={<NotFound />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/classroom/:sessionId" element={<Classroom />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard/student" element={<NotFound />} />
          <Route path="/dashboard/teacher" element={<NotFound />} />
          <Route path="/admin" element={<NotFound />} />
          
          {/* Auth routes */}
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
