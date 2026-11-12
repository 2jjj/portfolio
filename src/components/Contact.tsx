import { Github, Linkedin, Mail, Send, Loader2, CheckCircle, MapPin, Clock } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSiteInfo } from "@/hooks/use-public-api";

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL || "https://formspree.io/f/xldaqbnp";

const handleFromUrl = (url: string, fallback: string) => {
  const clean = url.replace(/\/$/, "");
  const handle = clean.split("/").filter(Boolean).pop();
  return handle || fallback;
};

interface FormFields {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const { toast } = useToast();
  const { data: site } = useSiteInfo();
  const [formData, setFormData] = useState<FormFields>({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const githubUrl = site?.github_url || "https://github.com/2jjj";
  const linkedinUrl = site?.linkedin_url || "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/";
  const email = site?.public_email || "pedrosakamoto27@gmail.com";
  const location = site?.location || "Ribeirão Preto, SP";
  const availability = site?.availability || "Disponibilidade imediata";

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
              Recebi sua mensagem e responderei o mais rápido possível.
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
      toast({
        title: "Erro de conexão",
        description: (
          <span>
            Não foi possível conectar. Tente novamente ou{" "}
            <a href={`mailto:${email}`} className="underline">
              envie por e-mail
            </a>
            .
          </span>
        ),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="section-inner">
        <div className="section-label">Contato</div>
        <h2 className="section-title marker-fill">
          Vamos <span>conversar</span>?
        </h2>
        <p className="section-copy">
          Envie uma mensagem sobre estágio, vaga back-end ou projeto. Estou disponível para oportunidades desafiadoras.
        </p>

        <div className="contact-grid">
          <div className="contact-info-col">
            <div className="contact-info-list">
              <a href={githubUrl} target="_blank" rel="noreferrer" className="contact-info-item">
                <div className="contact-info-icon"><Github size={18} /></div>
                <div>
                  <div className="contact-info-label">GitHub</div>
                  <div className="contact-info-value">{handleFromUrl(githubUrl, "2jjj")}</div>
                </div>
              </a>
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="contact-info-item">
                <div className="contact-info-icon"><Linkedin size={18} /></div>
                <div>
                  <div className="contact-info-label">LinkedIn</div>
                  <div className="contact-info-value">{handleFromUrl(linkedinUrl, "pedro-sakamoto")}</div>
                </div>
              </a>
              <a href={`mailto:${email}`} className="contact-info-item">
                <div className="contact-info-icon"><Mail size={18} /></div>
                <div>
                  <div className="contact-info-label">Email</div>
                  <div className="contact-info-value">{email}</div>
                </div>
              </a>
            </div>

            <div className="contact-status">
              <div className="contact-status-item">
                <Clock size={16} />
                <span>{availability}</span>
              </div>
              <div className="contact-status-item">
                <MapPin size={16} />
                <span>{location}</span>
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
                maxLength={80}
                autoComplete="name"
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="email" className="field-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seuemail@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                maxLength={120}
                autoComplete="email"
                inputMode="email"
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
                minLength={10}
                maxLength={4000}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isLoading}
              aria-busy={isLoading}
            >
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
