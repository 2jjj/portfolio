import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";

const Projects = () => {
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      title: "Resolute",
      description: "Projeto foi um sucesso, bot foi verificado e esteve em mais de 1000 servidores, multi-funcional com sistema de moderação, economia e entretenimento.",
      image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80",
      tags: ["Discord.js", "Node.js", "MongoDB"],
      category: "backend",
      github: "https://github.com/2jjj/resolute",
      demo: null,
      isOpenSource: true
    }.
    {
      title: "Status correios",
      description: "Um simples site que verifica se os correios está de greve ou não.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      tags: ["React", "React.js", "Vite"],
      category: "frontend",
      github: "https://github.com/2jjj/greve",
      demo: "https://demo.com",
      isOpenSource: true
    },
    {
      title: "API Fetch discord info",
      description: "API escalável que fornece informações detalhadas sobre usuários e servidores do Discord.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
      tags: ["Node.js", "Express"],
      category: "backend",
      github: "https://github.com/2jjj/fetch_discord_info_site",
      demo: null,
      isOpenSource: true
    }
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