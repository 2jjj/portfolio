import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProjects from "./pages/Admin/AdminProjects";
import AdminProjectForm from "./pages/Admin/AdminProjectForm";
import AdminAbout from "./pages/Admin/AdminAbout";
import AdminSkills from "./pages/Admin/AdminSkills";
import AdminSite from "./pages/Admin/AdminSite";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

const App = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const observeRevealElements = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.visible)").forEach((element) => {
        observer.observe(element);
      });
    };

    observeRevealElements();

    const mutationObserver = new MutationObserver(() => observeRevealElements());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ParticlesCanvas />
      <div className="page-progress-bar" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="projetos" element={<AdminProjects />} />
            <Route path="projetos/novo" element={<AdminProjectForm />} />
            <Route path="projetos/:id" element={<AdminProjectForm />} />
            <Route path="sobre" element={<AdminAbout />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="site" element={<AdminSite />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
