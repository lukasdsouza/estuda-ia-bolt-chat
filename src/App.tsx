import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RequireAuthEstudaia } from "./components/estudaia/Auth/RequireAuthEstudaia";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ChatInterface from "./pages/ChatInterface";

// New Estuda.ia pages
import EstudaiaHomePage from "./pages/estudaia/EstudaiaHomePage";
import EstudaiaLoginPage from "./pages/estudaia/EstudaiaLoginPage";
import EstudaiaSignupPage from "./pages/estudaia/EstudaiaSignupPage";
import EstudaiaStudentPage from "./pages/estudaia/EstudaiaStudentPage";
import EstudaiaAdminPage from "./pages/estudaia/EstudaiaAdminPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'admin' | 'student' }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute allowedRole="student">
            <ChatInterface />
          </ProtectedRoute>
        } 
      />
      
      {/* New Estuda.ia routes */}
      <Route path="/estudaia" element={<EstudaiaHomePage />} />
      <Route path="/estudaia/login" element={<EstudaiaLoginPage />} />
      <Route path="/estudaia/signup" element={<EstudaiaSignupPage />} />
      <Route 
        path="/estudaia/student" 
        element={
          <RequireAuthEstudaia>
            <EstudaiaStudentPage />
          </RequireAuthEstudaia>
        } 
      />
      <Route 
        path="/estudaia/admin" 
        element={
          <RequireAuthEstudaia adminOnly={true}>
            <EstudaiaAdminPage />
          </RequireAuthEstudaia>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
