import { type FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSiteInfo } from "@/hooks/use-public-api";
import retrato from "@/assets/profile.jpeg";

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL || "https://formspree.io/f/xldaqbnp";

/**
 * Contato — "Sentence, portrait, two links".
 * Frase a esquerda, retrato no meio, e-mail e LinkedIn a direita.
 * O formulario fica embaixo, na propria margem, sem moldura decorativa.
 */
const Contact = () => {
  const { toast } = useToast();
  const { data: site } = useSiteInfo();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const email = site?.public_email || "pedrosakamoto27@gmail.com";
  const location = site?.location || "Ribeirão Preto, SP";
  const availability = site?.availability || "Disponibilidade imediata";
  const linkedinUrl =
    site?.linkedin_url || "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/";
  const githubUrl = site?.github_url || "https://github.com/2jjj";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        toast({ title: "Mensagem enviada", description: "Respondo o mais rápido possível." });
        setForm({ name: "", email: "", message: "" });
      } else {
        const result = await response.json().catch(() => ({}));
        const message = result?.errors?.[0]?.message || "Erro ao enviar. Tente novamente.";
        toast({ title: "Erro", description: message, variant: "destructive" });
      }
    } catch {
      toast({
        title: "Sem conexão",
        description: (
          <span>
            Não foi possível enviar. Escreva para{" "}
            <a href={`mailto:${email}`} className="underline">
              {email}
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
    <section id="contact" className="band">
      <div className="page">
        <div className="contact-row reveal">
          <p className="contact-sentence">
            Aceito vaga júnior, estágio e projeto fechado.
          </p>

          <div className="contact-portrait">
            <img src={retrato} alt="Pedro Sakamoto" width={170} height={170} loading="lazy" />
          </div>

          <div className="contact-links">
            <p className="contact-question">Por onde respondo primeiro?</p>
            <a className="contact-link" href={`mailto:${email}`}>
              {email}
            </a>
            <a className="contact-link" href={linkedinUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="contact-link" href={githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <p className="contact-note">
              {location} · {availability} · retorno no mesmo dia
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form" aria-label="Formulário de contato">
          <div className="contact-fields">
            <div className="field-group">
              <label className="field-label" htmlFor="contact-name">
                Nome
              </label>
              <input
                id="contact-name"
                className="field-input"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={80}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Seu nome"
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="contact-email">
                E-mail
              </label>
              <input
                id="contact-email"
                className="field-input"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                maxLength={120}
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seuemail@email.com"
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="contact-message">
              Mensagem
            </label>
            <textarea
              id="contact-message"
              className="field-textarea"
              name="message"
              rows={5}
              minLength={10}
              maxLength={4000}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Conte sobre a vaga ou o projeto, com prazo."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
