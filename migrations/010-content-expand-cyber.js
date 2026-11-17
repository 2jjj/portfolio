/**
 * 010 — Conteúdo expandido: mais frentes de atuação, agenda real
 * (turma manhã na Unaerp, atendimento 13h–19h e à noite) e skills
 * com as linguagens e a frente cyber do git.
 */

const SKILLS = JSON.stringify([
  { title: "React", category: "Front-End", level: 85, color: "#61DAFB" },
  { title: "Next.js", category: "Front-End", level: 72, color: "#E7E7E7" },
  { title: "HTML & CSS", category: "Front-End", level: 78, color: "#E34F26" },
  { title: "TypeScript", category: "Linguagem", level: 80, color: "#3178C6" },
  { title: "JavaScript", category: "Linguagem", level: 80, color: "#F7DF1E" },
  { title: "Java", category: "Linguagem", level: 55, color: "#F89820" },
  { title: "Python", category: "Linguagem", level: 65, color: "#3776AB" },
  { title: "Go", category: "Linguagem", level: 45, color: "#00ADD8" },
  { title: "Node.js", category: "Back-End", level: 82, color: "#00D4FF" },
  { title: "Express", category: "Back-End", level: 75, color: "#A5F3FF" },
  { title: "Spring Boot", category: "Back-End", level: 55, color: "#6DB33F" },
  { title: "PostgreSQL", category: "Banco de Dados", level: 72, color: "#336791" },
  { title: "SQL", category: "Banco de Dados", level: 70, color: "#E48E00" },
  { title: "Docker", category: "DevOps", level: 62, color: "#2496ED" },
  { title: "Git", category: "DevOps", level: 80, color: "#FF6B35" },
  { title: "Shell / Bash", category: "DevOps", level: 58, color: "#89E051" },
  { title: "Playwright", category: "Qualidade", level: 68, color: "#2EAD33" },
  { title: "Recon (bug bounty)", category: "Cyber", level: 55, color: "#FF6A58" },
  { title: "Segurança em APIs (JWT/RBAC/HMAC)", category: "Cyber", level: 60, color: "#F54900" },
]);

const ABOUT_TEXT =
  "Dev full stack em Ribeirão Preto. Construo do banco à interface: sites, e-commerces, bots de WhatsApp, automações, APIs com Pix, painéis admin e SaaS de ponta a ponta. Gosto de entender o problema antes da primeira linha — modelagem, contrato de API e o que acontece quando algo falha.";

const ABOUT_SECONDARY =
  "Venho de projetos próprios e de cliente: um sistema de vendas no WhatsApp em operação na Kamikaze Sports (219 produtos, 568 variações, 63 testes automatizados), um SaaS de importação com checkout Pix e webhooks com HMAC, um e-commerce completo em Next.js com Prisma e PostgreSQL e este site — React no front, Express e PostgreSQL no back, com JWT, migrations e deploy na Vercel. Do lado ofensivo: criei o reconkit, uma CLI de recon para bug bounty em Python (subdomínios, port scan, HTTP probe, headers, segredos e fingerprinting), e aplico JWT, RBAC, bcrypt, Helmet e rate limiting em tudo que entra em produção. Também faço extensões Chrome, plugins de Vencord, scrapers e CLIs pequenas que resolvem o meu dia a dia. Estudo Engenharia da Computação na Unaerp (turma da manhã, 07:00–12:45) e atendo das 13h às 19h — e à noite quando precisa. Se você precisa de site, bot, API ou automação, os serviços e o preço estão na página de serviços.";

const HERO_DESCRIPTION =
  "Sites, e-commerces, bots de WhatsApp, automações e APIs com Pix — do banco à tela, com deploy. Engenharia da Computação na Unaerp.";

const HERO_PHRASES =
  '["Full Stack Developer","Sites, bots e APIs com Pix","Do banco à tela","Recon & bug bounty"]';

const AVAILABILITY = "Seg a sex, 13h às 19h · e à noite quando precisa";

export async function up(pgm) {
  await pgm.sql(`INSERT INTO site_info (key, value) VALUES ('about_text', $new$${ABOUT_TEXT}$new$) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`);
  await pgm.sql(`INSERT INTO site_info (key, value) VALUES ('about_secondary', $new$${ABOUT_SECONDARY}$new$) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`);
  await pgm.sql(`INSERT INTO site_info (key, value) VALUES ('hero_description', $new$${HERO_DESCRIPTION}$new$) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`);
  await pgm.sql(`INSERT INTO site_info (key, value) VALUES ('hero_phrases', $new$${HERO_PHRASES}$new$) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`);
  await pgm.sql(`INSERT INTO site_info (key, value) VALUES ('availability', $new$${AVAILABILITY}$new$) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`);
  await pgm.sql(`INSERT INTO site_info (key, value) VALUES ('skills', $new$${SKILLS}$new$) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`);
}
