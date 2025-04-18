import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Track from "./pages/Track";
import Calendar from "./pages/Calendar";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Layout from "./components/layout/Layout";
import { AppAuthProvider } from "./lib/auth-provider";

// Initialize store
import { useAppStore } from "./lib/store";

const queryClient = new QueryClient();

const App = () => {
  // Initialize the store (this ensures it's created early)
  useAppStore.getState();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index" element={<Index />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/track" element={<Track />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
