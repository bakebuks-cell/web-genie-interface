import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import GenerationPage from "./pages/GenerationPage";
import Preview from "./pages/Preview";
import About from "./pages/About";
import Technologies from "./pages/Technologies";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Generate page without Layout */}
            <Route path="/generate" element={<GenerationPage />} />
            <Route path="/preview" element={<Preview />} />
            
            {/* All other pages with Layout */}
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/technologies" element={<Layout><Technologies /></Layout>} />
            <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/signup" element={<Layout><SignUp /></Layout>} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
