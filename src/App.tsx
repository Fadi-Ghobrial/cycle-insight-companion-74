
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
import Learn from "./pages/Learn";
import LearnCategory from "./pages/LearnCategory";
import ArticleDetail from "./pages/ArticleDetail";
import Layout from "./components/layout/Layout";
import { AppAuthProvider } from "./lib/auth-provider";
import MilestonesPage from "./pages/Milestones";  // Add this import

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
            <Route path="/learn/:category" element={<LearnCategory />} />
            <Route path="/learn/article/:articleId" element={<ArticleDetail />} />
            <Route path="/milestones" element={<MilestonesPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

