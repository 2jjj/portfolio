import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";

const ParticlesCanvas = lazy(() => import("@/components/ParticlesCanvas"));
const CustomCursor = lazy(() => import("@/components/CustomCursor"));

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <ScrollProgress />
      <CommandPalette />
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>
      <Suspense fallback={null}>
        <ParticlesCanvas />
      </Suspense>
    </main>
  );
};

export default Index;
