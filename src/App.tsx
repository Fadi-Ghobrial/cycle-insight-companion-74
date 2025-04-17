import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

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
            <Route path="/calendar" element={<div className="min-h-screen bg-gray-50 p-4">Calendar Page (Coming Soon)</div>} />
            <Route path="/track" element={<div className="min-h-screen bg-gray-50 p-4">Track Page (Coming Soon)</div>} />
            <Route path="/insights" element={<div className="min-h-screen bg-gray-50 p-4">Insights Page (Coming Soon)</div>} />
            <Route path="/settings" element={<div className="min-h-screen bg-gray-50 p-4">Settings Page (Coming Soon)</div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
