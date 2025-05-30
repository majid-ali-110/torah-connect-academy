
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import FindTeachers from "./pages/FindTeachers";
import TeacherProfile from "./pages/TeacherProfile";
import ChildrenCourses from "./pages/ChildrenCourses";
import SearchResults from "./pages/SearchResults";
import Classroom from "./pages/Classroom";
import Payment from "./pages/Payment";
import FindPartner from "./pages/FindPartner";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/find-teachers" element={<FindTeachers />} />
              <Route path="/teacher/:id" element={<TeacherProfile />} />
              <Route path="/children-courses" element={<ChildrenCourses />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/classroom/:id" element={<Classroom />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/find-partner" element={<FindPartner />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
