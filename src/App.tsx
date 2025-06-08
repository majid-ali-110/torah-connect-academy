
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Layout from './components/Layout';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";
import TeacherProfile from "./pages/TeacherProfile";
import FindTeachers from "./pages/FindTeachers";
import Chat from "./pages/Chat";
import VideoCall from "./pages/VideoCall";
import Classroom from "./pages/Classroom";
import ChildrenCourses from "./pages/ChildrenCourses";
import WomenCourses from "./pages/WomenCourses";
import MaleCourses from "./pages/MaleCourses";
import BeitMidrash from "./pages/BeitMidrash";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Payment from "./pages/Payment";
import RabbisDirectory from "./pages/RabbisDirectory";
import SearchResults from "./pages/SearchResults";
import FindPartner from "./pages/FindPartner";
import Inscription from "./pages/Inscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/teacher-dashboard" element={<Layout><TeacherDashboard /></Layout>} />
                <Route path="/student-dashboard" element={<Layout><StudentDashboard /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/teacher/:id" element={<Layout><TeacherProfile /></Layout>} />
                <Route path="/find-teachers" element={<Layout><FindTeachers /></Layout>} />
                <Route path="/search" element={<Layout><SearchResults /></Layout>} />
                <Route path="/chat" element={<Layout><Chat /></Layout>} />
                <Route path="/video-call/:roomId" element={<VideoCall />} />
                <Route path="/classroom/:id" element={<Layout><Classroom /></Layout>} />
                <Route path="/children-courses" element={<Layout><ChildrenCourses /></Layout>} />
                <Route path="/women-courses" element={<Layout><WomenCourses /></Layout>} />
                <Route path="/male-courses" element={<Layout><MaleCourses /></Layout>} />
                <Route path="/beit-midrash" element={<Layout><BeitMidrash /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/support" element={<Layout><Support /></Layout>} />
                <Route path="/terms" element={<Layout><Terms /></Layout>} />
                <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
                <Route path="/cookies" element={<Layout><Cookies /></Layout>} />
                <Route path="/faq" element={<Layout><FAQ /></Layout>} />
                <Route path="/blog" element={<Layout><Blog /></Layout>} />
                <Route path="/payment" element={<Layout><Payment /></Layout>} />
                <Route path="/rabbis" element={<Layout><RabbisDirectory /></Layout>} />
                <Route path="/find-partner" element={<Layout><FindPartner /></Layout>} />
                <Route path="/inscription" element={<Layout><Inscription /></Layout>} />
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
