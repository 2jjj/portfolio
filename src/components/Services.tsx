import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "@/lib/services";

/**
 * Serviços — "Two-ended rows".
 * Preço e prazo ficam encostados no titulo; o que esta incluso abre
 * numa coluna larga ao lado. Nada de cartao.
 */
const Services = () => {
  const featured = services.filter((service) => service.id !== "ajuste");
  const ajuste = services.find((service) => service.id === "ajuste");

  return (
    <section id="servicos" className="band">
      <div className="page">
        <p className="band-kicker"><span className="num">06</span>Serviços</p>
        <div className="band-head reveal">
          <h2>Serviços</h2>
          <p>
            Preço fixo, escopo curto e entrega combinada. Pagamento no Pix, metade para começar.
          </p>
        </div>

        <div className="svc-list reveal reveal-stagger">
          {featured.map((service) => (
            <article className="svc-row" key={service.id}>
              <div>
                <h3 className="svc-title">{service.title}</h3>
                <div className="svc-price num">
                  {service.price} / {service.unit} · {service.delivery}
                </div>
              </div>

              <div>
                <p className="svc-desc">{service.summary}</p>
                <p className="svc-incl">{service.includes.join(" · ")}</p>
              </div>

              <a
                className="btn btn-ghost btn-sm svc-cta"
                href={`mailto:pedrosakamoto27@gmail.com?subject=${encodeURIComponent(
                  `Orçamento: ${service.title}`
                )}`}
              >
                Pedir orçamento <ArrowRight size={14} />
              </a>
            </article>
          ))}

          {ajuste && (
            <article className="svc-row">
              <div>
                <h3 className="svc-title">{ajuste.title}</h3>
                <div className="svc-price num">
                  {ajuste.price} / {ajuste.unit} · {ajuste.delivery}
                </div>
              </div>
              <div>
                <p className="svc-desc">{ajuste.summary}</p>
              </div>
              <a
                className="btn btn-ghost btn-sm svc-cta"
                href={`mailto:pedrosakamoto27@gmail.com?subject=${encodeURIComponent(
                  `Orçamento: ${ajuste.title}`
                )}`}
              >
                Pedir orçamento <ArrowRight size={14} />
              </a>
            </article>
          )}
        </div>

        <div className="svc-foot reveal">
          <p className="svc-foot-text">
            Escopo pequeno, bem feito e documentado. Sou júnior e cobro abaixo do mercado de
            propósito: quero os primeiros clientes e você quer algo que funcione.
          </p>
          <Link to="/servicos" className="btn btn-primary">
            Ver pacotes e prazos <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
