import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail, Send, Loader2, CheckCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const FORMSPREE_URL = "https://formspree.io/f/xldaqbnp";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData(e.currentTarget);
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        toast({
          title: "Sucesso no Envio!",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" />
              Recebi sua mensagem e responderei o mais rápido possível. Obrigado! 🎉
            </div>
          ),
          className: "bg-emerald-500 text-white border-emerald-600 shadow-lg",
          variant: "default",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        const result = await response.json();
        const errorMessage = result.errors && result.errors.length > 0
          ? result.errors.map((err: any) => err.message).join(", ")
          : "Erro ao enviar a mensagem. Tente novamente ou use o email direto.";
        toast({ title: "Erro no Envio", description: errorMessage, variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Erro de Conexão", description: "Não foi possível conectar ao servidor.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com/2jjj" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/" },
    { icon: Mail, label: "Email", href: "mailto:pedrosakamoto27@gmail.com" },
  ];

  return (
    <section id="contact" className="section bg-secondary/30">
      <div className="section-inner">
        <div className="section-label">Contato</div>
        <h2 className="section-title">
          Pronto para <span>conversar</span>?
        </h2>
        <p className="section-copy reveal" style={{ animationDelay: "0.1s" }}>
          Envie uma mensagem sobre estágio, emprego ou projeto. Estou disponível para oportunidades desafiadoras em back-end e full stack.
        </p>

        <div className="contact-grid">
          <div className="contact-panel reveal" style={{ animationDelay: "0.2s" }}>
            <h3 className="contact-heading">Vamos construir sua próxima API?</h3>
            <p className="contact-text">
              Tenho experiência em arquiteturas escaláveis, integrações com serviços externos e soluções com Node.js. Se a sua equipe procura um desenvolvedor back-end focado em estabilidade e performance, vamos conversar.
            </p>

            <div className="contact-socials">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-social"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </a>
              ))}
            </div>

            <Card className="contact-card">
              <p className="contact-card-text">
                <strong>Disponibilidade:</strong> Imediata
                <br />
                <strong>Localização:</strong> Ribeirão Preto, SP
                <br />
                <strong>Foco:</strong> Back-end, APIs, Full Stack
              </p>
            </Card>
          </div>

          <Card className="contact-form-card reveal" style={{ animationDelay: "0.25s" }}>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="field-group">
                <label htmlFor="name" className="field-label">Nome</label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="field-input"
                />
              </div>

              <div className="field-group">
                <label htmlFor="email" className="field-label">Email</label>
                <Input
                  id="email"
                  name="_replyto"
                  type="email"
                  placeholder="seuemail@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="field-input"
                />
              </div>

              <div className="field-group">
                <label htmlFor="message" className="field-label">Mensagem</label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Conte-me sobre a oportunidade..."
                  className="field-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
