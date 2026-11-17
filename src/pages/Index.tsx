import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
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
        <About />
        <Skills />
        <Projects />
        <Work />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Index;
