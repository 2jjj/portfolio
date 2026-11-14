import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import GitHubSection from "@/components/GitHubSection";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";

const Index = () => {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Projects />
        <Services />
        <GitHubSection />
        <Contact />
      </main>
      <Footer />
      <ScrollProgress />
      <CommandPalette />
    </>
  );
};

export default Index;
