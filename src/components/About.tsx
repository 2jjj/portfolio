import { Card } from "@/components/ui/card";
import { Code2, Rocket, Target } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Code2, value: "4+", label: "Anos de Experiência" },
    { icon: Rocket, value: "20+", label: "Projetos Completos" },
    { icon: Target, value: "100%", label: "Dedicação" },
  ];

  return (
    <section id="about" className="py-24 px-4 md:px-6 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre <span className="text-gradient">Mim</span>
          </h2>
          <p className="text-muted-foreground text-lg">Construindo o futuro linha por linha</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in">
            <p className="text-lg leading-relaxed">
              Desde os 13 anos mergulhado no mundo da programação, transformei curiosidade em expertise. 
              Especializado em criar experiências digitais que não apenas funcionam, mas impressionam.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Com experiência em desenvolvimento full stack, já construí diversos projetos para Discord, 
              APIs robustas e aplicações web modernas. Minha stack principal inclui JavaScript, React, 
              Next.js e Node.js - sempre buscando aprender e aplicar as tecnologias mais recentes.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Atualmente em busca de oportunidades de estágio ou emprego, tanto em front-end quanto 
              back-end, onde possa contribuir com minha paixão por código limpo e soluções inovadoras.
            </p>
          </div>

          <div className="grid gap-6 animate-scale-in">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="p-6 bg-card border-border/50 hover:border-primary/50 transition-colors hover-lift"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;