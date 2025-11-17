import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Adicionado o CheckCircle para o toast de sucesso
import { Github, Linkedin, Mail, Send, Loader2, CheckCircle } from "lucide-react"; 
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [isLoading, setIsLoading] = useState(false); 
  
  // A URL do Formspree para onde o formulário será enviado.
  // URL ATUALIZADA: https://formspree.io/f/xldaqbnp
  const FORMSPREE_URL = "https://formspree.io/f/xldaqbnp";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData(e.currentTarget);
      
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: data, 
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // JSX complexo para o 'description' (que geralmente aceita ReactNode)
        toast({
          title: "Sucesso no Envio!", // Agora é uma string simples para evitar o erro TS
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" /> {/* Ícone branco para contraste */}
              Recebi sua mensagem e responderei o mais rápido possível. Obrigado! 🎉
            </div>
          ),
          // CLASSES ADICIONADAS PARA FORÇAR O FUNDO VERDE E TEXTO BRANCO
          className: "bg-emerald-500 text-white border-emerald-600 shadow-lg",
          variant: "default", 
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        // Falha: tenta ler a mensagem de erro detalhada
        const result = await response.json();
        const errorMessage = result.errors && result.errors.length > 0 
          ? result.errors.map((err: any) => err.message).join(', ') 
          : "Erro ao enviar a mensagem. Tente novamente ou use o email direto.";

        toast({
          title: "Erro no Envio",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro na comunicação:", error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/2jjj",
      color: "hover:bg-primary"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
      color: "hover:bg-primary"
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:pedrosakamoto27@gmail.com",
      color: "hover:bg-accent"
    },
  ];

  return (
    <section id="contact" className="py-24 px-4 md:px-6 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Entre em <span className="text-gradient">Contato</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Estou disponível para oportunidades de estágio ou emprego!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8 animate-slide-in">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Vamos trabalhar juntos?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Estou em busca de oportunidades para aplicar minhas habilidades em desenvolvimento 
                web, tanto front-end quanto back-end. Se você tem uma vaga ou projeto interessante, 
                adoraria conversar!
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Minhas Redes</h4>
              <div className="grid grid-cols-3 gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-6 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-all hover-lift flex flex-col items-center gap-2 ${social.color}`}
                  >
                    <social.icon className="h-6 w-6" />
                    <span className="text-sm">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Disponibilidade:</strong> Imediata para estágio ou emprego
                <br />
                <strong className="text-foreground">Localização:</strong> Remoto ou presencial
                <br />
                <strong className="text-foreground">Áreas de interesse:</strong> Front-end, Back-end, Full Stack
              </p>
            </Card>
          </div>

          {/* Formulário de Contato com Formspree (AJAX Submission) */}
          <Card className="p-8 bg-card border-border/50 animate-scale-in">
            <h3 className="text-2xl font-semibold mb-6">Envie uma Mensagem</h3>
            
            {/* O envio agora é tratado pela função handleSubmit no onSubmit */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="text-sm font-medium mb-2 block">
                  Nome
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  name="name" // Essencial: Formspree usa este nome
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-2 block">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@email.com"
                  name="_replyto" // Essencial: Formspree usa _replyto para o email do remetente
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="text-sm font-medium mb-2 block">
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  placeholder="Conte-me sobre a oportunidade..."
                  name="message" // Essencial: Formspree usa este nome
                  className="min-h-[150px]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full group"
                disabled={isLoading} // Desabilita durante o carregamento
              >
                {/* Se estiver carregando, mostra o spinner, senão, mostra o ícone de envio */}
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                )}
                {isLoading ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;