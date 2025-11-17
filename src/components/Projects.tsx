import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";

const Projects = () => {
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      title: "Discord Bot Avançado",
      description: "Bot multi-funcional com sistema de moderação, economia e entretenimento. Mais de 50 comandos customizáveis.",
      image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80",
      tags: ["Discord.js", "Node.js", "MongoDB"],
      category: "backend",
      github: "https://github.com",
      demo: null,
      isOpenSource: true
    },
    {
      title: "E-commerce Dashboard",
      description: "Painel administrativo completo com gestão de produtos, pedidos e analytics em tempo real.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      tags: ["React", "Next.js", "Tailwind"],
      category: "frontend",
      github: "https://github.com",
      demo: "https://demo.com",
      isOpenSource: true
    },
    {
      title: "API RESTful",
      description: "API escalável com autenticação JWT, rate limiting e documentação completa com Swagger.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
      tags: ["Node.js", "Express", "PostgreSQL"],
      category: "backend",
      github: "https://github.com",
      demo: null,
      isOpenSource: true
    },
    {
      title: "Portfolio Web Interativo",
      description: "Site portfolio com animações 3D, dark mode e design responsivo ultra-moderno.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
      tags: ["React", "Three.js", "Framer Motion"],
      category: "frontend",
      github: null,
      demo: "https://demo.com",
      isOpenSource: false
    },
    {
      title: "Sistema de Gestão",
      description: "Aplicação full-stack para gerenciamento de tarefas e projetos com colaboração em tempo real.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      tags: ["Next.js", "Supabase", "TypeScript"],
      category: "fullstack",
      github: "https://github.com",
      demo: "https://demo.com",
      isOpenSource: true
    },
    {
      title: "Discord Music Bot",
      description: "Bot de música com suporte para múltiplas plataformas, fila de reprodução e equalizador.",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
      tags: ["Discord.js", "Node.js", "Lavalink"],
      category: "backend",
      github: "https://github.com",
      demo: null,
      isOpenSource: true
    },
  ];

  const categories = [
    { id: "all", label: "Todos" },
    { id: "frontend", label: "Front-End" },
    { id: "backend", label: "Back-End" },
    { id: "fullstack", label: "Full Stack" },
  ];

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meus <span className="text-gradient">Projetos</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Seleção dos meus trabalhos mais recentes e relevantes
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={filter === cat.id ? "default" : "outline"}
                onClick={() => setFilter(cat.id)}
                className={filter === cat.id ? "glow-primary" : ""}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-all hover-lift group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-gradient transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {project.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-2">
                  {project.isOpenSource && project.github && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.demo && (
                    <Button 
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;