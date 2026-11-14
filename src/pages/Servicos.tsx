import { ArrowLeft, ArrowRight, Check, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { faq, mailto, services, steps, contact } from "@/lib/services";

const Servicos = () => {
  return (
    <>
      <header className="case-topbar">
        <Link to="/" className="navbar-brand" aria-label="Voltar para o início">
          PS.
        </Link>
        <div className="resume-topbar-actions">
          <Link to="/" className="case-back">
            <ArrowLeft size={16} /> Início
          </Link>
          <a className="btn btn-outline" href={mailto()}>
            <Mail size={16} /> Orçamento
          </a>
        </div>
      </header>

      <main className="services-page">
        <div className="section-inner">
          <div className="section-label">Serviços</div>
          <h1 className="services-title">
            Site, bot ou API
            <span> sem enrolação</span>
          </h1>
          <p className="services-sub">
            Eu construo a parte que precisa funcionar quando ninguém está olhando. Preço fixo,
            prazo curto e Pix no fim. Abaixo do mercado porque estou começando — não porque o
            trabalho é menor.
          </p>

          <div className="services-facts">
            <span>Preço fechado antes de começar</span>
            <span>50% no Pix, 50% na entrega</span>
            <span>Uma rodada de ajuste inclusa</span>
          </div>

          <div className="services-detail-grid">
            {services.map((service) => (
              <article key={service.id} className="service-detail" data-reveal>
                <div className="service-detail-head">
                  <div>
                    {service.tag && <span className="service-tag">{service.tag}</span>}
                    <h2>{service.title}</h2>
                  </div>
                  <div className="service-price">
                    <strong>{service.price}</strong>
                    <span>/{service.unit}</span>
                  </div>
                </div>
                <p>{service.summary}</p>
                <ul className="service-list">
                  {service.includes.map((item) => (
                    <li key={item}>
                      <Check size={14} /> {item}
                    </li>
                  ))}
                </ul>
                <footer className="service-foot">
                  <span className="service-delivery">entrega em {service.delivery}</span>
                  <a
                    className="service-link"
                    href={mailto(`Orçamento: ${service.title}`)}
                  >
                    Quero esse <ArrowRight size={14} />
                  </a>
                </footer>
              </article>
            ))}
          </div>

          <section className="services-block" aria-labelledby="como-funciona">
            <h2 id="como-funciona">Como funciona</h2>
            <ol className="services-steps">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="services-block" aria-labelledby="perguntas">
            <h2 id="perguntas">Perguntas diretas</h2>
            <div className="services-faq">
              {faq.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="services-contact">
            <div>
              <h2>Me manda o que você precisa</h2>
              <p>
                Uma frase já basta: o que é, para quando e quanto você pretende gastar. Respondo
                com preço e prazo no mesmo dia.
              </p>
            </div>
            <div className="services-contact-actions">
              <a className="btn btn-primary" href={mailto("Quero um orçamento")}>
                <Mail size={16} /> Enviar e-mail
              </a>
              <a
                className="btn btn-outline"
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} /> Chamar no LinkedIn
              </a>
            </div>
          </div>

          <p className="services-note">
            Sem contrato longo, sem taxa escondida. O código fica com você na entrega.
          </p>
        </div>
      </main>
    </>
  );
};

export default Servicos;
