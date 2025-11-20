import { useState, useEffect, createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./lib/storage";
import Sidebar from "./components/Sidebar";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AddTask from "./pages/AddTask";
import Categories from "./pages/Categories";
import CalendarView from "./pages/CalendarView";
import Reports from "./pages/Reports";
import Notes from "./pages/Notes";
import Reminders from "./pages/Reminders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { cn } from "./lib/utils";

const queryClient = new QueryClient();

// Sidebar Context
interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-background">
                      {/* Left Sidebar */}
                      <Sidebar />

                      {/* Main Content Area */}
                      <div className={cn(
                        "transition-all duration-300",
                        isCollapsed ? "lg:ml-[80px]" : "lg:ml-[260px]"
                      )}>
                        <Navigation />
                        <main className="min-h-[calc(100vh-4rem)]">
                          <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/tasks" element={<Home />} />
                            <Route path="/add-task" element={<AddTask />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/calendar" element={<CalendarView />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/notes" element={<Notes />} />
                            <Route path="/reminders" element={<Reminders />} />
                            <Route path="/settings" element={<Settings />} />
                            {/* Catch-all route */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SidebarContext.Provider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
