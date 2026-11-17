import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BookOpen, Github, ShieldCheck } from "lucide-react";
import Footer from "@/components/Footer";

const Arquitetura = () => {
  useEffect(() => {
    document.title = "Arquitetura â€” Pedro Sakamoto";
  }, []);

  return (
    <>
      <header className="case-topbar">
        <Link to="/" className="navbar-brand" aria-label="Voltar para o inÃ­cio">
          PS.
        </Link>
        <Link to="/#projects" className="case-back">
          <ArrowLeft size={16} /> Projetos
        </Link>
      </header>

      <main className="arch-page">
        <div className="section-inner">
          <header className="arch-hero">
            <div className="section-label">Arquitetura</div>
            <h1 className="arch-title">Como este portfÃ³lio funciona</h1>
            <p className="arch-subtitle">
              Um SPA React conversando com uma API Express e PostgreSQL, com
              autenticaÃ§Ã£o, migrations, fallback local e deploy serverless. O
              cÃ³digo do site Ã© o case.
            </p>
            <div className="arch-actions">
              <a href="/api/docs" target="_blank" rel="noreferrer" className="btn btn-primary">
                <BookOpen size={18} /> Ver API docs
              </a>
              <a href="/api/health" target="_blank" rel="noreferrer" className="btn btn-outline">
                <ShieldCheck size={18} /> Health check
              </a>
              <a
                href="https://github.com/2jjj"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                <Github size={18} /> GitHub
              </a>
            </div>
          </header>

          <div className="arch-diagram" aria-label="Diagrama da arquitetura">
            <div className="arch-node">
              <strong>Browser</strong>
              <small>React 18 Â· TypeScript Â· Vite Â· React Query</small>
            </div>
            <div className="arch-arrow">â†“ HTTPS</div>
            <div className="arch-node arch-node-wide">
              <strong>Vercel</strong>
              <small>Static build + serverless function</small>
              <div className="arch-split">
                <div className="arch-node">
                  <strong>SPA</strong>
                  <small>Rotas, pÃ¡ginas e fallback local</small>
                </div>
                <div className="arch-node">
                  <strong>API</strong>
                  <small>Express 5 Â· /api/* Â· Zod Â· JWT</small>
                </div>
              </div>
            </div>
            <div className="arch-arrow">â†“ SQL parametrizado</div>
            <div className="arch-node">
              <strong>PostgreSQL</strong>
              <small>Supabase Â· migrations versionadas Â· Ã­ndices</small>
            </div>
            <div className="arch-arrow">â†” integraÃ§Ãµes</div>
            <div className="arch-split">
              <div className="arch-node">
                <strong>GitHub API</strong>
                <small>ImportaÃ§Ã£o de repositÃ³rios</small>
              </div>
              <div className="arch-node">
                <strong>Formspree</strong>
                <small>FormulÃ¡rio de contato sem backend prÃ³prio</small>
              </div>
            </div>
          </div>

          <div className="arch-grid">
            <article className="arch-card">
              <h2>Front-end</h2>
              <ul>
                <li>React 18 + TypeScript + Vite</li>
                <li>React Query para cache e retry</li>
                <li>Rotas pÃºblicas em chunks separados</li>
                <li>Tailwind + CSS customizado</li>
                <li>Lenis com respeito a reduced motion</li>
              </ul>
            </article>

            <article className="arch-card">
              <h2>API</h2>
              <ul>
                <li>Express 5 em funÃ§Ã£o serverless</li>
                <li>ValidaÃ§Ã£o de entrada com Zod</li>
                <li>JWT de acesso + refresh em cookie httpOnly</li>
                <li>Helmet, CORS e rate limit</li>
                <li>Swagger em <code>/api/docs</code></li>
              </ul>
            </article>

            <article className="arch-card">
              <h2>Dados</h2>
              <ul>
                <li>PostgreSQL com migrations versionadas</li>
                <li>JSONB para tags e mÃ©tricas de case</li>
                <li>Ãndices por categoria, destaque e slug</li>
                <li>Soft delete com <code>deleted_at</code></li>
                <li>Audit log para mutaÃ§Ãµes do admin</li>
              </ul>
            </article>

            <article className="arch-card">
              <h2>Deploy</h2>
              <ul>
                <li>Build estÃ¡tico + API na Vercel</li>
                <li>VariÃ¡veis de ambiente no painel</li>
                <li>Migrations no cold start</li>
                <li>PWA com precache enxuto</li>
                <li>CI com lint, typecheck, testes e build</li>
              </ul>
            </article>

            <article className="arch-card">
              <h2>Qualidade</h2>
              <ul>
                <li>Vitest + Testing Library</li>
                <li>Supertest para integraÃ§Ã£o da API</li>
                <li>ESLint + TypeScript strict</li>
                <li>Testes de integraÃ§Ã£o com banco dedicado</li>
                <li>Build verificado antes do deploy</li>
              </ul>
            </article>

            <article className="arch-card">
              <h2>ResiliÃªncia</h2>
              <ul>
                <li>Fallback local para projetos, skills e sobre</li>
                <li>Retry nas queries pÃºblicas</li>
                <li>Estado de erro no formulÃ¡rio de contato</li>
                <li>ConteÃºdo nÃ£o some se a API falhar</li>
                <li>Health check exposto em <code>/api/health</code></li>
              </ul>
            </article>
          </div>

          <section className="arch-block">
            <div className="section-label">Modelo de dados</div>
            <h2 className="arch-block-title">Tabelas principais</h2>
            <div className="arch-schema">
              <div className="arch-schema-row">
                <code>projects</code>
                <p>Projetos, tags, links, destaque, slug e conteÃºdo do case study.</p>
              </div>
              <div className="arch-schema-row">
                <code>site_info</code>
                <p>Hero, sobre, estatÃ­sticas e skills em chave-valor.</p>
              </div>
              <div className="arch-schema-row">
                <code>refresh_tokens</code>
                <p>Refresh tokens revogÃ¡veis para o painel administrativo.</p>
              </div>
              <div className="arch-schema-row">
                <code>audit_logs</code>
                <p>Registro de criaÃ§Ã£o, ediÃ§Ã£o e remoÃ§Ã£o de conteÃºdo.</p>
              </div>
              <div className="arch-schema-row">
                <code>schema_migrations</code>
                <p>Controle das migrations executadas no deploy.</p>
              </div>
            </div>
          </section>

          <section className="arch-block">
            <div className="section-label">AutenticaÃ§Ã£o</div>
            <h2 className="arch-block-title">Fluxo do admin</h2>
            <ol className="arch-steps">
              <li>Login com senha Ãºnica, comparada via bcrypt.</li>
              <li>API devolve um access token curto e grava o refresh em cookie httpOnly.</li>
              <li>O front usa o access token nas rotas protegidas.</li>
              <li>O refresh token Ã© revogado no logout e rotacionado a cada renovaÃ§Ã£o.</li>
              <li>Rate limit especÃ­fico protege o endpoint de login.</li>
            </ol>
          </section>

          <section className="arch-block">
            <div className="section-label">Trade-offs</div>
            <h2 className="arch-block-title">O que ficou de fora e por quÃª</h2>
            <ul className="arch-list">
              <li>
                <strong>SSR:</strong> o site Ã© pequeno e o SEO principal cabe no
                HTML estÃ¡tico. Prerender por rota fica para quando os cases
                precisarem de indexaÃ§Ã£o individual.
              </li>
              <li>
                <strong>Biblioteca de UI completa:</strong> componentes Radix sÃ£o
                carregados sÃ³ onde sÃ£o usados; o pÃºblico nÃ£o paga pelo admin.
              </li>
              <li>
                <strong>PDF no servidor:</strong> o PDF Ã© gerado no navegador sob
                demanda para manter a funÃ§Ã£o serverless leve.
              </li>
              <li>
                <strong>MicrosserviÃ§os:</strong> um Ãºnico Express resolve o
                escopo; separar seria complexidade sem trÃ¡fego.
              </li>
            </ul>
          </section>

          <div className="arch-footer">
            <p>
              Quer ver a API por dentro? Abra{" "}
              <a href="/api/docs" target="_blank" rel="noreferrer">
                /api/docs <ArrowUpRight size={14} />
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Arquitetura;
