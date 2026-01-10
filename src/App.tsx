import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ComplaintProvider } from "@/contexts/ComplaintContext";
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
              <Route path="/" element={<Landing />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/track" element={<Track />} />
              <Route path="/track/:id" element={<Track />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/officer" element={<OfficerDashboard />} />
              <Route path="/authority" element={<AuthorityDashboard />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/escalations" element={<Escalations />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ComplaintProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
