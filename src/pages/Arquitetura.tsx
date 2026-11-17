import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BookOpen, Github, ShieldCheck } from "lucide-react";
import Footer from "@/components/Footer";

const Arquitetura = () => {
  useEffect(() => {
    document.title = "Arquitetura — Pedro Sakamoto";
  }, []);

  return (
    <>
      <header className="case-topbar">
        <Link to="/" className="navbar-brand" aria-label="Voltar para o início">
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
            <h1 className="arch-title">Como este portfólio funciona</h1>
            <p className="arch-subtitle">
              Um SPA React conversando com uma API Express e PostgreSQL, com
              autenticação, migrations, fallback local e deploy serverless. O
              código do site é o case.
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
              <small>React 18 · TypeScript · Vite · React Query</small>
            </div>
            <div className="arch-arrow">↓ HTTPS</div>
            <div className="arch-node arch-node-wide">
              <strong>Vercel</strong>
              <small>Static build + serverless function</small>
              <div className="arch-split">
                <div className="arch-node">
                  <strong>SPA</strong>
                  <small>Rotas, páginas e fallback local</small>
                </div>
                <div className="arch-node">
                  <strong>API</strong>
                  <small>Express 5 · /api/* · Zod · JWT</small>
                </div>
              </div>
            </div>
            <div className="arch-arrow">↓ SQL parametrizado</div>
            <div className="arch-node">
              <strong>PostgreSQL</strong>
              <small>Supabase · migrations versionadas · índices</small>
            </div>
            <div className="arch-arrow">↔ integrações</div>
            <div className="arch-split">
              <div className="arch-node">
                <strong>GitHub API</strong>
                <small>Importação de repositórios</small>
              </div>
              <div className="arch-node">
                <strong>Formspree</strong>
                <small>Formulário de contato sem backend próprio</small>
              </div>
            </div>
          </div>

          <div className="arch-grid">
            <article className="arch-card">
              <h2>Front-end</h2>
              <ul>
                <li>React 18 + TypeScript + Vite</li>
                <li>React Query para cache e retry</li>
                <li>Rotas públicas em chunks separados</li>
                <li>Tailwind + CSS customizado</li>
                <li>Lenis com respeito a reduced motion</li>
              </ul>
            </article>

            <article className="arch-card">
              <h2>API</h2>
              <ul>
                <li>Express 5 em função serverless</li>
                <li>Validação de entrada com Zod</li>
                <li>JWT de acesso + refresh em cookie httpOnly</li>
                <li>Helmet, CORS e rate limit</li>
                <li>Swagger em <code>/api/docs</code></li>
              </ul>
            </article>

            <article className="arch-card">
              <h2>Dados</h2>
              <ul>
                <li>PostgreSQL com migrations versionadas</li>
                <li>JSONB para tags e métricas de case</li>
                <li>Índices por categoria, destaque e slug</li>
                <li>Soft delete com <code>deleted_at</code></li>
                <li>Audit log para mutações do admin</li>
              </ul>
            </article>

            <article className="arch-card">
              <h2>Deploy</h2>
              <ul>
                <li>Build estático + API na Vercel</li>
                <li>Variáveis de ambiente no painel</li>
                <li>Migrations no cold start</li>
                <li>PWA com precache enxuto</li>
                <li>CI com lint, typecheck, testes e build</li>
              </ul>
            </article>

            <article className="arch-card">
              <h2>Qualidade</h2>
              <ul>
                <li>Vitest + Testing Library</li>
                <li>Supertest para integração da API</li>
                <li>ESLint + TypeScript strict</li>
                <li>Testes de integração com banco dedicado</li>
                <li>Build verificado antes do deploy</li>
              </ul>
            </article>

            <article className="arch-card">
              <h2>Resiliência</h2>
              <ul>
                <li>Fallback local para projetos, skills e sobre</li>
                <li>Retry nas queries públicas</li>
                <li>Estado de erro no formulário de contato</li>
                <li>Conteúdo não some se a API falhar</li>
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
                <p>Projetos, tags, links, destaque, slug e conteúdo do case study.</p>
              </div>
              <div className="arch-schema-row">
                <code>site_info</code>
                <p>Hero, sobre, estatísticas e skills em chave-valor.</p>
              </div>
              <div className="arch-schema-row">
                <code>refresh_tokens</code>
                <p>Refresh tokens revogáveis para o painel administrativo.</p>
              </div>
              <div className="arch-schema-row">
                <code>audit_logs</code>
                <p>Registro de criação, edição e remoção de conteúdo.</p>
              </div>
              <div className="arch-schema-row">
                <code>schema_migrations</code>
                <p>Controle das migrations executadas no deploy.</p>
              </div>
            </div>
          </section>

          <section className="arch-block">
            <div className="section-label">Autenticação</div>
            <h2 className="arch-block-title">Fluxo do admin</h2>
            <ol className="arch-steps">
              <li>Login com senha única, comparada via bcrypt.</li>
              <li>API devolve um access token curto e grava o refresh em cookie httpOnly.</li>
              <li>O front usa o access token nas rotas protegidas.</li>
              <li>O refresh token é revogado no logout e rotacionado a cada renovação.</li>
              <li>Rate limit específico protege o endpoint de login.</li>
            </ol>
          </section>

          <section className="arch-block">
            <div className="section-label">Trade-offs</div>
            <h2 className="arch-block-title">O que ficou de fora e por quê</h2>
            <ul className="arch-list">
              <li>
                <strong>SSR:</strong> o site é pequeno e o SEO principal cabe no
                HTML estático. Prerender por rota fica para quando os cases
                precisarem de indexação individual.
              </li>
              <li>
                <strong>Biblioteca de UI completa:</strong> componentes Radix são
                carregados só onde são usados; o público não paga pelo admin.
              </li>
              <li>
                <strong>PDF no servidor:</strong> o PDF é gerado no navegador sob
                demanda para manter a função serverless leve.
              </li>
              <li>
                <strong>Microsserviços:</strong> um único Express resolve o
                escopo; separar seria complexidade sem tráfego.
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
