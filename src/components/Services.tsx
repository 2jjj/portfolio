import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "@/lib/services";

const featured = services.filter((service) => service.id !== "ajuste");

const Services = () => {
  return (
    <section id="servicos" className="section services-section">
      <div className="section-inner">
        <div className="section-label">Serviços</div>
        <h2 className="section-title marker-fill">
          O que eu <span>resolvo</span>
        </h2>
        <p className="section-copy">
          Preço fixo, escopo curto e entrega combinada. Sou júnior e cobro abaixo do mercado de
          propósito: quero os primeiros clientes e você quer algo que funcione. Sai todo mundo
          ganhando.
        </p>

        <div className="services-grid">
          {featured.map((service) => (
            <article
              key={service.id}
              className={`service-card ${service.tag ? "is-featured" : ""}`}
              data-reveal
            >
              {service.tag && (
                <span className="service-tag">
                  <Sparkles size={12} /> {service.tag}
                </span>
              )}
              <header className="service-head">
                <h3>{service.title}</h3>
                <div className="service-price">
                  <strong>{service.price}</strong>
                  <span>/{service.unit}</span>
                </div>
              </header>
              <p className="service-summary">{service.summary}</p>
              <ul className="service-list">
                {service.includes.map((item) => (
                  <li key={item}>
                    <Check size={14} /> {item}
                  </li>
                ))}
              </ul>
              <footer className="service-foot">
                <span className="service-delivery">{service.delivery}</span>
                <a
                  className="service-link"
                  href={`mailto:pedrosakamoto27@gmail.com?subject=${encodeURIComponent(
                    `Orçamento: ${service.title}`
                  )}`}
                >
                  Pedir orçamento <ArrowRight size={14} />
                </a>
              </footer>
            </article>
          ))}
        </div>

        <div className="services-cta">
          <p>
            Ajuste rápido sai por <strong>R$ 90/hora</strong>. Pagamento no Pix, metade para
            começar.
          </p>
          <Link to="/servicos" className="btn btn-outline">
            Ver pacotes e prazos <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
