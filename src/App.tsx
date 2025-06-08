
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import Profile from "@/pages/Profile";
import FindTeachers from "@/pages/FindTeachers";
import TeacherProfile from "@/pages/TeacherProfile";
import Chat from "@/pages/Chat";
import VideoCall from "@/pages/VideoCall";
import ChildrenCourses from "@/pages/ChildrenCourses";
import WomenCourses from "@/pages/WomenCourses";
import FindPartner from "@/pages/FindPartner";
import LiveCourses from "@/pages/LiveCourses";
import Classroom from "@/pages/Classroom";
import Payment from "@/pages/Payment";
import SearchResults from "@/pages/SearchResults";
import RabbisDirectory from "@/pages/RabbisDirectory";
import FAQ from "@/pages/FAQ";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Support from "@/pages/Support";
import BeitMidrash from "@/pages/BeitMidrash";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Cookies from "@/pages/Cookies";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/student" 
                element={
                  <ProtectedRoute>
                    <Layout><StudentDashboard /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/teacher" 
                element={
                  <ProtectedRoute>
                    <Layout><TeacherDashboard /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Layout><Profile /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/find-teachers" 
                element={<Layout><FindTeachers /></Layout>} 
              />
              <Route 
                path="/teacher/:id" 
                element={<Layout><TeacherProfile /></Layout>} 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Layout><Chat /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/video-call/:roomId" 
                element={
                  <ProtectedRoute>
                    <VideoCall />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/children-courses" 
                element={<Layout><ChildrenCourses /></Layout>} 
              />
              <Route 
                path="/women-courses" 
                element={<Layout><WomenCourses /></Layout>} 
              />
              <Route 
                path="/find-partner" 
                element={<Layout><FindPartner /></Layout>} 
              />
              <Route 
                path="/live-courses" 
                element={
                  <ProtectedRoute>
                    <LiveCourses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/classroom/:id" 
                element={
                  <ProtectedRoute>
                    <Layout><Classroom /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment" 
                element={
                  <ProtectedRoute>
                    <Layout><Payment /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/search" 
                element={<Layout><SearchResults /></Layout>} 
              />
              {/* New pages */}
              <Route 
                path="/rabbanim" 
                element={<RabbisDirectory />} 
              />
              <Route 
                path="/eleves" 
                element={<Layout><ChildrenCourses /></Layout>} 
              />
              <Route 
                path="/femmes" 
                element={<Layout><WomenCourses /></Layout>} 
              />
              <Route 
                path="/beit-hamidrash" 
                element={<BeitMidrash />} 
              />
              <Route 
                path="/faq" 
                element={<FAQ />} 
              />
              <Route 
                path="/blog" 
                element={<Blog />} 
              />
              <Route 
                path="/contact" 
                element={<Contact />} 
              />
              <Route 
                path="/support" 
                element={<Support />} 
              />
              <Route 
                path="/conditions" 
                element={<Terms />} 
              />
              <Route 
                path="/privacy" 
                element={<Privacy />} 
              />
              <Route 
                path="/cookies" 
                element={<Cookies />} 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
