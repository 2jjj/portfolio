import { Card } from "@/components/ui/card";
import { Code, Database, Layout, Server, Smartphone, Terminal } from "lucide-react";

const Skills = () => {
  const skills = [
    {
      icon: Layout,
      title: "Front-End Development",
      description: "React, Next.js, Tailwind CSS",
      color: "primary"
    },
    {
      icon: Server,
      title: "Back-End Development",
      description: "Node.js, Express, RESTful APIs",
      color: "accent"
    },
    {
      icon: Database,
      title: "Banco de Dados",
      description: "Supabase & MongoDB",
      color: "primary"
    },
    {
      icon: Code,
      title: "Linguagens",
      description: "JavaScript, nivel básico em GoLang",
      color: "accent"
    },
    {
      icon: Terminal,
      title: "DevOps & Tools",
      description: "Git, GitHub, Docker, Vercel",
      color: "primary"
    },
    {
      icon: Smartphone,
      title: "Desenvolvimento Discord",
      description: "Discord.js, Bots, Integrations, APIs",
      color: "accent"
    },
  ];

  return (
    <section id="skills" className="py-24 px-4 md:px-6 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Tecnologias que domino e utilizo para criar soluções extraordinárias
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border/50 hover:border-primary/50 transition-all hover-lift group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-lg mb-4 ${
                skill.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
              }`}>
                <skill.icon className={`h-6 w-6 ${
                  skill.color === 'primary' ? 'text-primary' : 'text-accent'
                }`} />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-gradient transition-colors">
                {skill.title}
              </h3>
              <p className="text-muted-foreground">
                {skill.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;