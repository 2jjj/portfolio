import { Card } from "@/components/ui/card";
import { Code2, Rocket, Target } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Code2, value: "4+", label: "Anos de Experiência" },
    { icon: Rocket, value: "7+", label: "Projetos Completos" },
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
              Desenvolvedor back-end com 4 anos de experiência, especializado em construir APIs robustas, sistemas escaláveis e integrações com plataformas externas.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Comecei a programar aos 13 anos e fui direto para a prática — meu primeiro projeto real foi um bot para Discord que chegou a rodar em mais de <strong>1.000 servidores verificados</strong>, com sistemas completos de moderação, economia e entretenimento.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Hoje meu foco é back-end: arquitetura de APIs, banco de dados, autenticação e infraestrutura. Tenho noção de front-end suficiente para colaborar em projetos full stack, mas onde eu realmente entrego valor é no servidor.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Atualmente aprofundando conhecimentos em <strong>Docker</strong> e containerização.
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