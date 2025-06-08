
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import FindTeachers from "./pages/FindTeachers";
import TeacherProfile from "./pages/TeacherProfile";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import VideoCall from "./pages/VideoCall";
import ChildrenCourses from "./pages/ChildrenCourses";
import WomenCourses from "./pages/WomenCourses";
import MaleCourses from "./pages/MaleCourses";
import LiveCourses from "./pages/LiveCourses";
import FindPartner from "./pages/FindPartner";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<FindTeachers />} />
              <Route path="/teacher/:id" element={<TeacherProfile />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/video-call/:roomId" element={<VideoCall />} />
              <Route path="/children-courses" element={<ChildrenCourses />} />
              <Route path="/women-courses" element={<WomenCourses />} />
              <Route path="/male-courses" element={<MaleCourses />} />
              <Route path="/live-courses" element={<LiveCourses />} />
              <Route path="/find-partner" element={<FindPartner />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Support />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
