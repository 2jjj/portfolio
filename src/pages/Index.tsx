import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import About from "@/components/About";
import Manifesto from "@/components/Manifesto";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Work from "@/components/Work";
import GitHubSection from "@/components/GitHubSection";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import CodeChallenge from "@/components/CodeChallenge";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Ticker />
        <About />
        <Manifesto />
        <Skills />
        <Projects />
        <Work />
        <GitHubSection />
        <Services />
        <Contact />
        <CodeChallenge />
      </main>
      <Footer />
    </>
  );
};

export default Index;
