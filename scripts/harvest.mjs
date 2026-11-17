/**
 * Colheita automática de oportunidades (vagas públicas + 99Freelas).
 *
 * Roda no GitHub Actions a cada 6h, publica jobs.json e freelance.json
 * de volta no repo — o site /vagas fica sempre atualizado, sem máquina
 * nenhuma online. Sem dependencias externas.
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(String(res.status));
  return res.text();
}

async function fetchJson(url) {
  const text = await fetchText(url, { accept: 'application/json' });
  return JSON.parse(text);
}

function stripTags(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function isRemote(text) {
  return /remote|remoto|anywhere|worldwide|home office/i.test(text || '');
}

function normalizeJob(entry, source) {
  const title = stripTags(entry.title || entry.position || entry.jobTitle || '');
  if (!title) return null;
  const location = stripTags(entry.location || entry.candidate_required_location || entry.jobGeo?.name || '');
  const company = stripTags(entry.company || entry.company_name || entry.companyName || entry.organization || '');
  const url = entry.url || entry.link || entry.applyUrl || entry.jobUrl || entry.absolute_url || '';
  const description = stripTags(entry.description || entry.excerpt || entry.content || '').slice(0, 600);
  const published = entry.pub_date || entry.publication_date || entry.date || entry.created_at || entry.updated_at || null;
  return {
    title,
    company: company || 'confidencial',
    location: location || (isRemote(description) ? 'Remoto' : 'Brasil'),
    remote: isRemote(`${location} ${description}`),
    url,
    description,
    publishedAt: published ? new Date(published).toISOString() : null,
    source,
    kind: /est[áa]gio|estagi|trainee|intern|aprendiz/i.test(title) ? 'estagio' : 'outros',
  };
}

const JOB_SOURCES = [
  {
    id: 'remotive',
    async load() {
      const data = await fetchJson('https://remotive.com/api/remote-jobs?limit=50');
      return (data.jobs || []).map((job) => normalizeJob({ ...job, company: job.company_name }, 'remotive'));
    },
  },
  {
    id: 'remoteok',
    async load() {
      const data = await fetchJson('https://remoteok.com/api');
      return (data || []).slice(1, 41).map((job) => normalizeJob(job, 'remoteok'));
    },
  },
  {
    id: 'arbeitnow',
    async load() {
      const data = await fetchJson('https://www.arbeitnow.com/api/job-board-api');
      return (data.data || []).map((job) => normalizeJob(job, 'arbeitnow'));
    },
  },
  {
    id: 'jobicy',
    async load() {
      const data = await fetchJson('https://jobicy.com/api/v2/remote-jobs?count=40');
      return (data.jobs || []).map((job) => normalizeJob({ ...job, company: job.companyName }, 'jobicy'));
    },
  },
  {
    id: 'weworkremotely',
    async load() {
      const xml = await fetchText('https://weworkremotely.com/remote-jobs.rss');
      return xml.split('<item>').slice(1).map((item) => {
        const title = stripTags((item.match(/<title>([\s\S]*?)<\/title>/) || [])[1]);
        const link = (item.match(/<link>([\s\S]*?)<\/link>/) || [])[1];
        const pub = (item.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1];
        const region = stripTags((item.match(/<region>([\s\S]*?)<\/region>/) || [])[1]);
        const company = stripTags((item.match(/<author>([\s\S]*?)<\/author>/) || [])[1]);
        return normalizeJob({ title, url: link, pub_date: pub, location: region, company }, 'weworkremotely');
      });
    },
  },
];

const ROLE_TERMS = [
  'desenvolvedor', 'developer', 'dev ', 'devs', 'engenheiro de software', 'software engineer',
  'full stack', 'fullstack', 'front end', 'front-end', 'frontend', 'back end', 'back-end', 'backend',
  'programador', 'devops', 'sre', 'site reliability', 'web developer', 'mobile developer',
  'estagiario', 'estagiária', 'estagio de desenvolvimento', 'trainee', 'junior developer',
  'desenvolvedor jr', 'estágio em ti',
];
const STACK_TERMS = [
  'react', 'node', 'java', 'spring', 'python', 'php', 'javascript', 'typescript', 'golang',
  'frontend', 'front-end', 'backend', 'back-end', 'full stack', 'fullstack', 'api',
  'postgres', 'mongodb', 'mysql', 'sqlite', 'graphql', 'vue', 'angular', 'next.js', 'nestjs',
  'express', 'django', 'flask', 'laravel', 'rails', 'kotlin', 'swift', 'android', 'ios', 'web',
];
const LEVEL_TERMS = ['estagio', 'estágio', 'estagiario', 'estagiária', 'trainee', 'junior', 'júnior', 'intern', 'aprendiz'];
const NOT_FOR_ME =
  /support|suporte|atendimento|atendente|auxiliar|analista|recepcionista|cobran|financeiro|recrutador|marketing|marketer|performance|growth|seo|social media|designer|animator|animacao|ux|ui designer|engenheiro civil|arquiteto|advogado|contador|professor|docente|medica|médica|enfermagen|almoxarife|vendedor|caixa|secretaria/i;
const SENIOR_TERMS = /senior|sr\.|\b lead\b|\blead\b|manager|\bhead\b|principal|staff engineer|especialista|expert|pleno/i;
const LOCAL_REGION = /brasil|brazil|latam|latin america|america latina|america do sul|portugal|lusophone/i;
const GLOBAL_REGION = /worldwide|anywhere|global|remote|remoto/i;
const ONLY_FOREIGN = /usa only|united states only|uk only|united kingdom only|canada only|germany only|france only|spain only|ireland only|netherlands only|poland only|sweden only|italy only|ukraine only|india only|poland|romania|bulgaria|greece|czech|turkey|egypt|nigeria|kenya|ghana|philippines|indonesia|vietnam|malaysia|hong kong|singapore|new zealand|australia only/i;

function isRelevantJob(job) {
  const title = String(job.title || '').toLowerCase();
  const description = String(job.description || '').toLowerCase();
  const location = String(job.location || '').toLowerCase();
  const text = `${title} ${description}`;
  if (NOT_FOR_ME.test(title)) return false;
  if (SENIOR_TERMS.test(title)) return false;
  if (ONLY_FOREIGN.test(location)) return false;
  const isRole = ROLE_TERMS.some((term) => title.includes(term));
  const isLevel = LEVEL_TERMS.some((term) => title.includes(term));
  if (!isRole && !isLevel) return false;
  const hasStack = STACK_TERMS.some((term) => text.includes(term));
  if (!hasStack && !isLevel) return false;
  if (/\.net\b|c#|dotnet|unity|sap\b|salesforce|sharepoint|magento|laravel|wordpress|shopify|power ?bi|tableau/.test(text)) {
    return false;
  }
  if (!LOCAL_REGION.test(location)) {
    if (!isLevel || !GLOBAL_REGION.test(location)) return false;
  }
  return true;
}

const ACHIEVABLE = /est[áa]gio|estagi|trainee|aprendiz|intern/i;
const JUNIOR = /j[uú]nior|jr\b|entry/i;

function heuristicScore(job) {
  const text = `${job.title} ${job.description || ''}`.toLowerCase();
  let score = 20;
  if (/est[áa]gio|estagi/i.test(job.title)) score += 25;
  if (/j[uú]nior|jr\b/i.test(job.title)) score += 15;
  if (STACK_TERMS.some((term) => text.includes(term))) score += 18;
  if (STACK_TERMS.slice(0, 8).some((term) => text.includes(term))) score += 6;
  if (/ribeir/i.test(String(job.location || ''))) score += 18;
  if (/brasil|brazil/i.test(String(job.location || ''))) score += 8;
  if (/remoto|remote|anywhere|worldwide/i.test(String(job.location || ''))) score += 6;
  if (/tempo integral|full[ -]?time|40h/i.test(text)) score -= 10;
  return Math.max(0, Math.min(97, Math.round(score)));
}

function toPublicJob(job, city) {
  return {
    id: job.url,
    title: job.title,
    company: job.company,
    location: job.location,
    remote: Boolean(job.remote),
    region: Boolean(city) && String(job.location || '').toLowerCase().includes(city),
    kind: /est[áa]gio|estagi|trainee|aprendiz|intern/i.test(job.title) ? 'estagio' : /j[uú]nior|jr\b|entry/i.test(job.title) ? 'junior' : 'outros',
    score: heuristicScore(job),
    url: job.url,
    applied: false,
    blocked: '',
    salary: '',
    posted: job.publishedAt ? new Date(job.publishedAt).toLocaleDateString('pt-BR') : '',
    seniority: '',
    emails: [],
    why: '',
    about: String(job.description || '').replace(/\s+/g, ' ').slice(0, 700),
    source: job.source,
    postedAt: job.publishedAt || null,
  };
}

const BASE = 'https://www.99freelas.com.br';
const UA_99 =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36';

function parseProjects(html) {
  const projects = [];
  const chunks = String(html || '').split(/<li class="[^"]*result-item[^"]*"/).slice(1);
  for (const chunk of chunks) {
    const id = (chunk.match(/data-id="(\d+)"/) || [])[1];
    const link = (chunk.match(/href="(\/project\/[^"?#]+)/) || [])[1];
    const title = stripTags((chunk.match(/class="title">([\s\S]*?)<\/h\d>/) || [])[1] || '');
    if (!id || !title || !link) continue;
    const infoRaw = (chunk.match(/<p class="info[^"]*">([\s\S]*?)<\/p>/) || [])[1] || '';
    const infoParts = stripTags(infoRaw).split('·').map((part) => part.trim());
    const dates = [...chunk.matchAll(/cp-datetime="(\d+)"/g)].map((match) => Number(match[1]));
    const proposals = Number((chunk.match(/Propostas:\s*<b>(\d+)<\/b>/) || [])[1] || 0);
    const interested = Number((chunk.match(/Interessados:\s*<b>(\d+)<\/b>/) || [])[1] || 0);
    const descriptionRaw = (chunk.match(/data-content="([\s\S]*?)"/) || [])[1] || '';
    const description = stripTags(descriptionRaw.replace(/<br\s*\/?>/gi, '\n'));
    projects.push({
      id,
      title,
      description,
      url: `${BASE}${link.split('?')[0]}`,
      category: infoParts[0] || '',
      level: infoParts[1] || '',
      publishedAt: dates[0] ? new Date(dates[0]).toISOString() : null,
      proposals,
      interested,
      exclusive: /flat_project_exclusive/.test(chunk),
    });
  }
  return projects;
}

const FREELANCE_QUERIES = ['react', 'node.js', 'typescript', 'java', 'api', 'landing page', 'whatsapp'];
const OUTSIDE = /tradu|rediça|ilustra|fotografia|cozinha|advogado|médic|enfermagem|dentista|design gráfic|identidade visual|logotipo|prospect|tráfego|social media|mídias sociais|vídeo|edição de vídeo/i;
const SOFT = /site|landing page|react|node|java|typescript|javascript|api|whatsapp|bot|automa|saas|sistema|painel|dashboard|wordpress|e-commerce|loja|script|aplicativo|desenvolvimento|frontend|backend/i;

function scoreFreelance(item) {
  const text = `${item.title} ${item.description || ''} ${item.category || ''}`.toLowerCase();
  let score = 24;
  const terms = ['react', 'next.js', 'node.js', 'typescript', 'javascript', 'java', 'python', 'spring', 'whatsapp', 'pix', 'api', 'saas', 'wordpress', 'postgresql', 'express', 'playwright'];
  for (const term of terms) if (text.includes(term)) score += 6;
  if (/whatsapp|pix/.test(text)) score += 6;
  if (/landing page|site\b/.test(text)) score += 6;
  if (/saas|sistema|painel|dashboard/.test(text)) score += 8;
  if (item.proposals === 0) score += 10;
  else if (item.proposals <= 3) score += 6;
  else if (item.proposals <= 8) score += 2;
  else if (item.proposals > 20) score -= 8;
  if (/iniciante|intermedi/i.test(String(item.level || ''))) score += 6;
  if (/especialista|advogado/i.test(String(item.level || ''))) score -= 8;
  return Math.max(5, Math.min(97, Math.round(score)));
}

async function fetchFreelance() {
  const seen = new Map();
  for (const query of FREELANCE_QUERIES) {
    try {
      const url = `${BASE}/projects?q=${encodeURIComponent(query)}`;
      const html = await fetchText(url);
      for (const project of parseProjects(html)) {
        if (!project.title) continue;
        if (seen.has(project.id)) {
          seen.get(project.id).hits = (seen.get(project.id).hits || 0) + 1;
          continue;
        }
        seen.set(project.id, project);
      }
    } catch (err) {
      console.log(`fonte 99freelas falhou (${query}): ${String(err.message || err)}`);
    }
  }
  const items = [...seen.values()].filter((item) => {
    const text = `${item.title} ${item.description || ''} ${item.category || ''}`;
    if (OUTSIDE.test(text)) return false;
    return SOFT.test(text);
  });
  return items
    .map((item) => ({ ...item, score: scoreFreelance(item), why: '' }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 40);
}

const outDir = path.join(process.cwd(), 'public');
mkdirSync(outDir, { recursive: true });

const city = 'ribeirao preto';

console.log('buscando vagas...');
const settled = await Promise.allSettled(JOB_SOURCES.map((source) => source.load()));
const raw = [];
settled.forEach((outcome) => {
  if (outcome.status === 'fulfilled') raw.push(...outcome.value);
});
const seen = new Set();
const jobs = raw
  .filter((job) => job && job.url && !seen.has(job.url) && seen.add(job.url))
  .filter(isRelevantJob)
  .map((job) => toPublicJob(job, city))
  .sort((a, b) => b.score - a.score);

const jobsFile = path.join(outDir, 'jobs.json');
if (existsSync(jobsFile)) {
  try {
    const previous = JSON.parse(readFileSync(jobsFile, 'utf8'));
    const keep = (previous.jobs || []).filter((job) => String(job.source || '') === 'linkedin');
    const byUrl = new Map();
    for (const job of keep) byUrl.set(job.url, job);
    for (const job of jobs) byUrl.set(job.url, job);
    const merged = [...byUrl.values()].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 120);
    writeFileSync(
      jobsFile,
      JSON.stringify({ at: new Date().toISOString(), count: merged.length, jobs: merged }, null, 2),
      'utf8'
    );
    console.log(`jobs.json: ${merged.length} vagas (merge com LinkedIn local)`);
    process.exit(0);
  } catch (err) {
    console.log(`merge falhou, mantendo ultima colheita: ${String(err.message || err)}`);
  }
}
if (jobs.length) {
  writeFileSync(
    jobsFile,
    JSON.stringify({ at: new Date().toISOString(), count: jobs.length, jobs }, null, 2),
    'utf8'
  );
  console.log(`jobs.json: ${jobs.length} vagas`);
} else {
  console.log('jobs.json: nenhuma vaga nova - mantendo o atual');
}

console.log('buscando projetos no 99Freelas...');
const freelance = await fetchFreelance();
if (freelance.length) {
  writeFileSync(
    path.join(outDir, 'freelance.json'),
    JSON.stringify({ at: new Date().toISOString(), count: freelance.length, source: '99freelas', items: freelance }, null, 2),
    'utf8'
  );
  console.log(`freelance.json: ${freelance.length} projetos`);
} else {
  console.log('freelance.json: 0 projetos (fonte bloqueou ou vazia) - mantendo o atual');
}
