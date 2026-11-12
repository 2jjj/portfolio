const SKILL_ALIASES = {
  "node.js": ["node.js", "nodejs", "node"],
  javascript: ["javascript", "js"],
  typescript: ["typescript", "ts"],
  postgresql: ["postgresql", "postgres", "pgsql"],
  "spring boot": ["spring boot", "springboot", "spring"],
  "next.js": ["next.js", "nextjs", "next"],
  react: ["react", "react.js", "reactjs"],
  tailwind: ["tailwind", "tailwindcss"],
  docker: ["docker", "containers", "container"],
  kubernetes: ["kubernetes", "k8s"],
  go: ["golang", "go lang", "go"],
  java: ["java"],
  python: ["python", "py"],
  mongodb: ["mongodb", "mongo"],
  sql: ["sql", "queries", "query"],
  rest: ["rest", "restful", "api"],
  graphql: ["graphql"],
  redis: ["redis"],
  aws: ["aws", "amazon web services"],
  linux: ["linux", "unix"],
  git: ["git", "github"],
  "ci/cd": ["ci/cd", "cicd", "continuous integration", "pipeline"],
  security: ["security", "seguranca", "pentest", "recon", "forense", "malware"],
  llm: ["llm", "ai", "artificial intelligence", "inteligencia artificial", "agentes"],
};

const TITLE_TERMS = [
  "backend", "back-end", "back end", "full stack", "fullstack", "developer",
  "desenvolvedor", "engineer", "engenheiro", "software", "api", "data",
];

export function stripHtml(value) {
  if (!value) return "";
  const withoutBlocks = String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(withoutBlocks)
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value) {
  const named = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    ndash: "–", mdash: "—", hellip: "…", rsquo: "’", lsquo: "‘",
    ldquo: "“", rdquo: "”", eacute: "é", atilde: "ã", ccedil: "ç",
  };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeText(value) {
  return stripHtml(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function normalizeKey(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, " ").trim();
}

function termMatches(text, term) {
  const normalized = normalizeText(term);
  if (!normalized) return false;
  if (normalized.includes(" ")) return text.includes(normalized);
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(text);
}

function aliasesFor(skill) {
  const key = normalizeKey(skill);
  return SKILL_ALIASES[key] || [normalizeText(skill)];
}

function detectTerms(text, candidates) {
  const found = [];
  for (const candidate of candidates) {
    const aliases = aliasesFor(candidate);
    if (aliases.some((alias) => termMatches(text, alias))) {
      found.push(candidate);
    }
  }
  return found;
}

function normalizeUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(String(value));
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function formatSalary(min, max, currency = "USD", period = "yearly") {
  const low = Number(min) || 0;
  const high = Number(max) || 0;
  if (!low && !high) return "";
  const suffix = period === "yearly" ? "/ano" : period === "hourly" ? "/h" : "";
  const format = (value) => value >= 1000 ? `${Math.round(value / 1000)}k` : String(value);
  if (low && high) return `${currency} ${format(low)}–${format(high)}${suffix}`;
  return `${currency} ${format(low || high)}${suffix}`;
}

function toIso(value) {
  if (!value) return new Date().toISOString();
  if (typeof value === "number") return new Date(value * 1000).toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function createJob(data) {
  return {
    id: String(data.id),
    source: data.source,
    title: String(data.title || "").trim(),
    company: String(data.company || "").trim(),
    url: normalizeUrl(data.url),
    applyUrl: normalizeUrl(data.applyUrl || data.url),
    location: String(data.location || "").trim(),
    remote: Boolean(data.remote),
    salary: String(data.salary || "").trim(),
    tags: Array.isArray(data.tags)
      ? [...new Set(data.tags.map((tag) => String(tag).trim()).filter(Boolean))].slice(0, 12)
      : [],
    description: stripHtml(data.description).slice(0, 6000),
    publishedAt: toIso(data.publishedAt),
  };
}

export function jobText(job) {
  return normalizeText(`${job.title} ${job.company} ${job.tags.join(" ")} ${job.description}`);
}

function matchProjects(job, projects) {
  const text = jobText(job);
  return projects
    .map((project) => {
      const caught = project.tags.filter((tag) => termMatches(text, tag));
      if (termMatches(text, project.title)) caught.unshift(project.title);
      return { ...project, matchedTags: [...new Set(caught)] };
    })
    .filter((project) => project.matchedTags.length > 0)
    .sort((a, b) => b.matchedTags.length - a.matchedTags.length || b.featured - a.featured)
    .slice(0, 3);
}

export function matchJob(job, context) {
  const text = jobText(job);
  const matchedSkills = detectTerms(text, context.skills);
  const jobTechTags = job.tags.filter((tag) => {
    const normalized = normalizeKey(tag);
    return Object.values(SKILL_ALIASES).flat().some((alias) => normalizeKey(alias) === normalized) ||
      Object.keys(SKILL_ALIASES).includes(normalized);
  });

  const knownSkills = new Set();
  for (const skill of context.skills) {
    knownSkills.add(normalizeKey(skill));
    for (const alias of aliasesFor(skill)) knownSkills.add(normalizeKey(alias));
  }
  const missingSkills = [...new Set(jobTechTags)]
    .filter((tag) => !knownSkills.has(normalizeKey(tag)))
    .filter((tag) => !matchedSkills.some((skill) => normalizeKey(skill) === normalizeKey(tag)))
    .slice(0, 5);

  const skillsScore = clamp(
    Math.round((matchedSkills.length / Math.max(5, Math.min(10, context.skills.length))) * 55),
    0,
    55
  );
  const titleScore = TITLE_TERMS.some((term) => termMatches(job.title, term)) ? 20 : 0;
  const remoteScore = job.remote ? 10 : 0;
  const locationScore = /brazil|brasil|latam|worldwide|anywhere|global|remote/i.test(job.location) ? 5 : 0;
  const ageDays = Math.max(0, (Date.now() - new Date(job.publishedAt).getTime()) / 86400000);
  const recencyScore = ageDays <= 7 ? 10 : ageDays <= 30 ? 7 : ageDays <= 90 ? 4 : 0;

  return {
    matchScore: clamp(skillsScore + titleScore + remoteScore + locationScore + recencyScore, 0, 100),
    matchedSkills,
    missingSkills,
    topProjects: matchProjects(job, context.projects),
  };
}

export function searchable(job, query, location, remoteOnly) {
  const text = jobText(job);
  const terms = normalizeText(query).split(/\s+/).filter((term) => term.length > 1);
  if (terms.length > 0 && !terms.every((term) => text.includes(term))) return false;
  if (remoteOnly && !job.remote) return false;
  if (location) {
    const wanted = normalizeText(location);
    const jobLocation = normalizeText(job.location);
    const flexible = /brazil|brasil|latam|worldwide|anywhere|global|remote/.test(jobLocation);
    if (!flexible && !jobLocation.includes(wanted)) return false;
  }
  return true;
}
