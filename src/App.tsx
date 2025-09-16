import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/providers/Web3Provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex h-screen bg-background text-foreground">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/spectator" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Spectator Mode</h2><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
                <Route path="/analytics" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Analytics</h2><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
                <Route path="/pool" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">JIT Pool</h2><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
                <Route path="/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Settings</h2><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;
