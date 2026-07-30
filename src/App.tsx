import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
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
import AdminResume from "./pages/Admin/AdminResume";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/admin/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("admin_token");
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    localStorage.removeItem("admin_token");
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function FallbackError({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">Algo deu errado</h1>
      <p className="text-muted-foreground max-w-md">
        {error instanceof Error ? error.message : "Ocorreu um erro inesperado. Tente recarregar a pagina."}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
      >
        Tentar novamente
      </button>
    </div>
  );
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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <ErrorBoundary FallbackComponent={FallbackError} onReset={() => window.location.reload()}>
                  <AdminLayout />
                </ErrorBoundary>
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
            <Route path="curriculo" element={<AdminResume />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
