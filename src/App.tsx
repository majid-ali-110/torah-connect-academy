import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import SearchResults from "./pages/SearchResults";
import TeacherProfile from "./pages/TeacherProfile";
import Payment from "./pages/Payment";
import Classroom from "./pages/Classroom";
import AuthPage from "./pages/AuthPage";
import FindTeachers from "./pages/FindTeachers";
import ChildrenCourses from "./pages/ChildrenCourses";
import FindPartner from "./pages/FindPartner";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/connexion" element={<Connexion />} />
            
            {/* Feature block routes */}
            <Route path="/children-courses" element={<ChildrenCourses />} />
            <Route path="/women-courses" element={<NotFound />} />
            <Route path="/live-courses" element={<NotFound />} />
            <Route path="/sos-partner" element={<FindPartner />} />
            <Route path="/sos-havrouta" element={<FindPartner />} />
            
            {/* Subject routes */}
            <Route path="/subjects/:subjectId" element={<NotFound />} />
            
            {/* Platform functionality */}
            <Route path="/search" element={<SearchResults />} />
            <Route path="/find-teachers" element={<FindTeachers />} />
            <Route path="/teachers/:teacherId" element={<TeacherProfile />} />
            <Route path="/booking/:teacherId" element={<NotFound />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="/classroom/:sessionId" element={<Classroom />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard/student" element={
              <ProtectedRoute requireRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/teacher" element={
              <ProtectedRoute requireRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<NotFound />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
