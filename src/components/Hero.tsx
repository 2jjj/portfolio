import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, FileText, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useState, useEffect } from "react";

const Hero = () => {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Mantendo este bloco básico para evitar erros de hooks,
    // mas sem lógica de performance crítica.
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Hero background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-background/90 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/95 to-background"></div>
      </div>
      
      {/* --- EFEITO DE LUZ (AURA ROXA SUAVE) DO FUNDO --- */}
      {/* Bolhas grandes roxas (bg-violet-500/10) */}
      <div 
        className="absolute -top-60 -left-60 w-[700px] h-[700px] bg-violet-500/10 rounded-full blur-[150px] opacity-70 animate-slow-pulse"
        style={{ zIndex: -10 }} 
      ></div>
      
      <div 
        className="absolute -bottom-60 -right-60 w-[700px] h-[700px] bg-violet-500/10 rounded-full blur-[150px] opacity-70 animate-slow-pulse" 
        style={{ animationDelay: '2.5s', zIndex: -10 }}
      ></div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
          {/* Photo placeholder */}
          <div className="relative group animate-slide-up">
            {/* --- MUDANÇA: INSET REDUZIDO PARA -inset-0.5 para um raio menor e OPACIDADE BAIXA para suavidade --- */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-xl opacity-10 group-hover:opacity-100 animate-glow transition duration-1000"></div>
            {/* ------------------------------------------- */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-primary/30 overflow-hidden bg-secondary flex items-center justify-center hover-lift">
              <div className="text-muted-foreground text-center p-4">
                <p className="text-sm">Sua foto aqui</p>
                <p className="text-xs mt-2">Substitua em<br/>src/assets/profile.jpg</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-gradient">Full Stack</span>
              <br />
              <span className="text-foreground">Developer</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              17 anos. 4 anos de experiência. Especializado em JavaScript, React, Next.js e Node.js
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg" 
              onClick={() => scrollToSection('projects')}
              className="group relative overflow-hidden glow-primary"
            >
              <span className="relative z-10">Ver Projetos</span>
              <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection('contact')}
              className="border-primary/50 hover:border-primary hover:glow-primary transition-all duration-300"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contato
            </Button>
          </div>
          
          <div className="flex gap-6 pt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-secondary hover:bg-primary hover-lift transition-all duration-300 hover:glow-primary hover:scale-110"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-secondary hover:bg-primary hover-lift transition-all duration-300 hover:glow-primary hover:scale-110"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a 
              href="mailto:seu@email.com"
              className="p-3 rounded-full bg-secondary hover:bg-accent hover-lift transition-all duration-300 hover:glow-accent hover:scale-110"
            >
              <Mail className="h-6 w-6" />
            </a>
            <a 
              href="/resume.pdf" 
              target="_blank"
              className="p-3 rounded-full bg-secondary hover:bg-accent hover-lift transition-all duration-300 hover:glow-accent hover:scale-110"
            >
              <FileText className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;