import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ComplaintProvider } from "@/contexts/ComplaintContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Submit from "./pages/Submit";
import Track from "./pages/Track";
import Index from "./pages/Index";
import Maps from "./pages/Maps";
import Escalations from "./pages/Escalations";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import OfficerDashboard from "./pages/OfficerDashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ComplaintProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/track" element={<Track />} />
              <Route path="/track/:id" element={<Track />} />
              
              {/* Role-specific dashboards */}
              <Route 
                path="/citizen" 
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <CitizenDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/officer" 
                element={
                  <ProtectedRoute allowedRoles={["officer", "admin"]}>
                    <OfficerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/authority" 
                element={
                  <ProtectedRoute allowedRoles={["authority", "admin"]}>
                    <AuthorityDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin-only routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/maps" 
                element={
                  <ProtectedRoute allowedRoles={["admin", "authority", "officer"]}>
                    <Maps />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/escalations" 
                element={
                  <ProtectedRoute allowedRoles={["admin", "authority"]}>
                    <Escalations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute allowedRoles={["admin", "authority"]}>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ComplaintProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
