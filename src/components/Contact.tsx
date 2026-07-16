import { Github, Linkedin, Mail, Send, Loader2, CheckCircle, MapPin, Clock } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL || "https://formspree.io/f/xldaqbnp";

interface FormFields {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormFields>({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

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
          title: "Mensagem enviada!",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" />
              Recebi sua mensagem e responderei o mais rapido possivel.
            </div>
          ),
          className: "bg-emerald-500 text-white border-emerald-600 shadow-lg",
          variant: "default",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        const result = await response.json();
        const errorMessage = result.errors && result.errors.length > 0
          ? result.errors.map((err: { message: string }) => err.message).join(", ")
          : "Erro ao enviar. Tente novamente.";
        toast({ title: "Erro", description: errorMessage, variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Erro de Conexao", description: "Nao foi possivel conectar ao servidor.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="section-inner">
        <div className="section-label">Contato</div>
        <h2 className="section-title">
          Vamos <span>conversar</span>?
        </h2>
        <p className="section-copy">
          Envie uma mensagem sobre estagio, emprego ou projeto. Estou disponivel para oportunidades desafiadoras.
        </p>

        <div className="contact-grid">
          <div className="contact-info-col">
            <div className="contact-info-list">
              <a href="https://github.com/2jjj" target="_blank" rel="noreferrer" className="contact-info-item">
                <div className="contact-info-icon"><Github size={18} /></div>
                <div>
                  <div className="contact-info-label">GitHub</div>
                  <div className="contact-info-value">2jjj</div>
                </div>
              </a>
              <a href="https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/" target="_blank" rel="noreferrer" className="contact-info-item">
                <div className="contact-info-icon"><Linkedin size={18} /></div>
                <div>
                  <div className="contact-info-label">LinkedIn</div>
                  <div className="contact-info-value">pedro-sakamoto</div>
                </div>
              </a>
              <a href="mailto:pedrosakamoto27@gmail.com" className="contact-info-item">
                <div className="contact-info-icon"><Mail size={18} /></div>
                <div>
                  <div className="contact-info-label">Email</div>
                  <div className="contact-info-value">pedrosakamoto27@gmail.com</div>
                </div>
              </a>
            </div>

            <div className="contact-status">
              <div className="contact-status-item">
                <Clock size={16} />
                <span>Disponibilidade Imediata</span>
              </div>
              <div className="contact-status-item">
                <MapPin size={16} />
                <span>Ribeirao Preto, SP</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="field-group">
              <label htmlFor="name" className="field-label">Nome</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="email" className="field-label">Email</label>
              <input
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
              <textarea
                id="message"
                name="message"
                placeholder="Conte-me sobre a oportunidade..."
                className="field-textarea"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Send size={18} /> Enviar Mensagem
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
