import { lazy, Suspense, useEffect } from "react";
import Lenis from "lenis";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { registerLenis } from "@/lib/scroll";
import StartAllFab from "@/components/StartAllFab";

const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Curriculo = lazy(() => import("./pages/Curriculo"));
const Arquitetura = lazy(() => import("./pages/Arquitetura"));
const Vagas = lazy(() => import("./pages/Vagas"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminCareer = lazy(() => import("./pages/Admin/AdminCareer"));
const AdminProjects = lazy(() => import("./pages/Admin/AdminProjects"));
const AdminProjectForm = lazy(() => import("./pages/Admin/AdminProjectForm"));
const AdminAbout = lazy(() => import("./pages/Admin/AdminAbout"));
const AdminSkills = lazy(() => import("./pages/Admin/AdminSkills"));
const AdminSite = lazy(() => import("./pages/Admin/AdminSite"));
const AdminResume = lazy(() => import("./pages/Admin/AdminResume"));

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

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-3 bg-background text-foreground">
      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
      <span className="text-sm text-muted-foreground">Carregando...</span>
    </div>
  );
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);
    registerLenis(lenis);

    return () => {
      registerLenis(null);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.add("is-in");
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
      document.querySelectorAll<HTMLElement>(".marker-fill:not(.visible)").forEach((element) => {
        observer.observe(element);
      });
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((element) => {
        observer.observe(element);
      });
    };

    observeRevealElements();

    // Fallback: nunca deixe conteúdo invisível para sempre se o observer falhar.
    const revealFallback = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.visible), .marker-fill:not(.visible), [data-reveal]:not(.is-in)")
        .forEach((element) => {
          element.classList.add("visible");
          element.classList.add("is-in");
        });
    }, 1500);

    const mutationObserver = new MutationObserver(() => observeRevealElements());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(revealFallback);
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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projetos/:slug" element={<ProjectDetail />} />
            <Route path="/curriculo" element={<Curriculo />} />
            <Route path="/vagas" element={<Vagas />} />
            <Route path="/arquitetura" element={<Arquitetura />} />
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
              <Route path="carreira" element={<AdminCareer />} />
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
        </Suspense>
        <StartAllFab />
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;


