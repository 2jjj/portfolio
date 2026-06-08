import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import profilePic from "@/assets/profile.jpeg";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative min-h-[68vh] py-16 flex items-center justify-center overflow-hidden">
     
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Hero background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-background/90 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/95 to-background"></div>
      </div>
      

      <div 
        className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-violet-500/10 rounded-full blur-[120px] opacity-70 animate-slow-pulse"
        style={{ zIndex: -10 }} 
      ></div>
      
      <div 
        className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-violet-500/10 rounded-full blur-[120px] opacity-70 animate-slow-pulse" 
        style={{ animationDelay: '2.5s', zIndex: -10 }}
      ></div>
      
     
      <div className="container relative z-10 px-4 md:px-6 max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
          
          <div className="relative group animate-slide-up">

            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-xl opacity-10 group-hover:opacity-100 animate-glow transition duration-1000"></div>
            
            <div className="relative w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full border-4 border-primary/30 overflow-hidden bg-secondary flex items-center justify-center hover-lift">
              <img 
                src={profilePic} 
                alt="Pedro Sakamoto" 
                className="w-full h-full object-cover block rounded-full"
              />
            </div>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-gradient">Pedro Sakamoto</span>
              <br />
              <span className="text-foreground">Back-End Developer</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Especializado em APIs, bancos de dados e sistemas escaláveis com Node.js. Construindo soluções de servidor com foco em performance e manutenção.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="md" 
              onClick={() => scrollToSection('projects')}
              className="group relative overflow-hidden glow-primary"
            >
              <span className="relative z-10">Ver Projetos</span>
              <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Button>
            <Button 
              size="md" 
              variant="outline" 
              onClick={() => scrollToSection('contact')}
              className="border-primary/50 hover:border-primary hover:glow-primary transition-all duration-300"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contato
            </Button>
          </div>
          
          <div className="flex gap-6 pt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <a 
              href="https://github.com/2jjj" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-secondary hover:bg-primary hover-lift transition-all duration-300 hover:glow-primary hover:scale-110"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="https://linkedin.com/in/pedro-sakamoto-3b94091a1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-secondary hover:bg-primary hover-lift transition-all duration-300 hover:glow-primary hover:scale-110"
            >
              <Linkedin className="h-6 w-6" />  
            </a>
            <a 
              href="mailto:pedrosakamoto27@gmail.com"
              className="p-3 rounded-full bg-secondary hover:bg-accent hover-lift transition-all duration-300 hover:glow-accent hover:scale-110"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;