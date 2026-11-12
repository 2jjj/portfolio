import { Router } from "express";
import { z } from "zod";
import pool from "../db.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, validateQuery } from "../lib/validate.js";
import { createAuditLog } from "../lib/audit.js";
import {
  createJob,
  formatSalary,
  matchJob,
  normalizeKey,
  searchable,
} from "../lib/job-normalize.js";

const router = Router();

const SOURCES = ["remotive", "jobicy", "arbeitnow", "remoteok"];
const CACHE_TTL = 10 * 60 * 1000;
const REQUEST_TIMEOUT = 8000;
const cache = new Map();

async function fetchJson(url, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "portfolio-career-hq/1.0",
        ...headers,
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function cached(key, loader) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.at < CACHE_TTL) return entry.promise;
  const promise = loader().catch((error) => {
    cache.delete(key);
    throw error;
  });
  cache.set(key, { at: Date.now(), promise });
  return promise;
}

async function fetchRemotive(query) {
  const params = new URLSearchParams({ limit: "60" });
  if (query) params.set("search", query);
  const data = await fetchJson(`https://remotive.com/api/remote-jobs?${params}`);
  return (data.jobs || []).map((job) => createJob({
    id: job.id,
    source: "remotive",
    title: job.title,
    company: job.company_name,
    url: job.url,
    applyUrl: job.url,
    location: job.candidate_required_location,
    remote: true,
    salary: job.salary,
    tags: [...(job.tags || []), job.job_type, job.category].filter(Boolean),
    description: job.description,
    publishedAt: job.publication_date,
  }));
}

async function fetchJobicy() {
  const data = await fetchJson("https://jobicy.com/api/v2/remote-jobs?count=50&geo=brazil&industry=engineering");
  return (data.jobs || []).map((job) => createJob({
    id: job.id,
    source: "jobicy",
    title: job.jobTitle,
    company: job.companyName,
    url: job.url,
    applyUrl: job.url,
    location: job.jobGeo,
    remote: true,
    salary: formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency || "USD", job.salaryPeriod),
    tags: [...(job.jobIndustry || []), ...(job.jobType || []), job.jobLevel].filter(Boolean),
    description: job.jobDescription || job.jobExcerpt,
    publishedAt: job.pubDate,
  }));
}

async function fetchArbeitnow() {
  const data = await fetchJson("https://www.arbeitnow.com/api/job-board-api");
  return (data.data || []).map((job) => createJob({
    id: job.slug,
    source: "arbeitnow",
    title: job.title,
    company: job.company_name,
    url: job.url,
    applyUrl: job.url,
    location: job.location,
    remote: Boolean(job.remote),
    tags: [...(job.tags || []), ...(job.job_types || [])],
    description: job.description,
    publishedAt: job.created_at,
  }));
}

async function fetchRemoteOk() {
  const data = await fetchJson("https://remoteok.com/api");
  return (Array.isArray(data) ? data : [])
    .filter((job) => job && job.id && job.position)
    .map((job) => createJob({
      id: job.id,
      source: "remoteok",
      title: job.position,
      company: job.company,
      url: job.url,
      applyUrl: job.apply_url || job.url,
      location: job.location,
      remote: true,
      salary: formatSalary(job.salary_min, job.salary_max),
      tags: job.tags || [],
      description: job.description,
      publishedAt: job.date || job.epoch,
    }));
}

const fetchers = {
  remotive: fetchRemotive,
  jobicy: fetchJobicy,
  arbeitnow: fetchArbeitnow,
  remoteok: fetchRemoteOk,
};

function sourceKey(source, query) {
  return source === "remotive" ? `${source}:${normalizeKey(query)}` : source;
}

function loadProfileContext() {
  return cached("profile-context", async () => {
    const { rows } = await pool.query("SELECT key, value FROM site_info");
    const site = {};
    for (const row of rows) site[row.key] = row.value;

    let skills = [];
    try {
      const parsed = JSON.parse(site.skills || "[]");
      if (Array.isArray(parsed)) skills = parsed.map((skill) => skill.title).filter(Boolean);
    } catch {
      skills = [];
    }

    let projects = [];
    try {
      const result = await pool.query(
        "SELECT title, slug, tags, github, live, featured FROM projects ORDER BY order_index ASC, created_at DESC LIMIT 40"
      );
      projects = result.rows.map((project) => {
        let tags = project.tags;
        if (typeof tags === "string") {
          try { tags = JSON.parse(tags); } catch { tags = []; }
        }
        return {
          title: project.title,
          slug: project.slug || String(project.title).toLowerCase().replace(/\s+/g, "-"),
          tags: Array.isArray(tags) ? tags : [],
          github: project.github || "",
          live: project.live || "",
          featured: project.featured ? 1 : 0,
        };
      });
    } catch {
      projects = [];
    }

    if (skills.length === 0) {
      skills = [...new Set(projects.flatMap((project) => project.tags))].slice(0, 20);
    }

    const siteUrl = String(site.site_url || "https://www.pedrosakamoto.site").replace(/\/$/, "");
    const resumePath = site.resume_path || "/curriculo";
    const resumeUrl = /^https?:\/\//i.test(resumePath)
      ? resumePath
      : `${siteUrl}${resumePath.startsWith("/") ? "" : "/"}${resumePath}`;

    return {
      skills: [...new Set(skills)],
      projects,
      links: {
        github: site.github_url || "https://github.com/2jjj",
        linkedin: site.linkedin_url || "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
        email: site.public_email || "pedrosakamoto27@gmail.com",
        site: siteUrl,
        resume: resumeUrl,
        location: site.location || "Ribeirão Preto, SP",
        availability: site.availability || "Disponibilidade imediata",
      },
      role: String(site.hero_phrases || "").includes("Back-end") ? "Back-end Developer" : "Full Stack Developer",
    };
  });
}

const searchSchema = z.object({
  q: z.string().max(80).optional().default(""),
  location: z.string().max(80).optional().default(""),
  remote: z.enum(["0", "1"]).optional().default("0"),
  sources: z.string().max(120).optional().default(""),
  limit: z.coerce.number().min(1).max(60).optional().default(30),
});

router.get("/sources", authenticateToken, (_req, res) => {
  res.json([
    { id: "remotive", label: "Remotive", url: "https://remotive.com" },
    { id: "jobicy", label: "Jobicy", url: "https://jobicy.com" },
    { id: "arbeitnow", label: "Arbeitnow", url: "https://www.arbeitnow.com" },
    { id: "remoteok", label: "Remote OK", url: "https://remoteok.com" },
  ]);
});

router.get("/search", authenticateToken, validateQuery(searchSchema), async (req, res, next) => {
  try {
    const { q, location, remote, sources, limit } = req.validatedQuery;
    const requested = sources
      ? sources.split(",").map((source) => source.trim()).filter((source) => SOURCES.includes(source))
      : SOURCES;
    const activeSources = requested.length > 0 ? requested : SOURCES;
    const context = await loadProfileContext();

    const results = await Promise.allSettled(
      activeSources.map(async (source) => {
        const key = sourceKey(source, q);
        const jobs = await cached(key, () => fetchers[source](source === "remotive" ? q : ""));
        return { source, jobs };
      })
    );

    const jobs = [];
    const status = [];
    const seen = new Set();

    results.forEach((result, index) => {
      const source = activeSources[index];
      if (result.status === "rejected") {
        status.push({ source, ok: false, count: 0, error: result.reason?.name === "AbortError" ? "timeout" : "indisponivel" });
        return;
      }

      let count = 0;
      for (const job of result.value.jobs) {
        if (!job.title || !job.url) continue;
        if (!searchable(job, q, location, remote === "1")) continue;
        const key = `${normalizeKey(job.title)}|${normalizeKey(job.company)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        jobs.push({ ...job, ...matchJob(job, context) });
        count++;
      }
      status.push({ source, ok: true, count });
    });

    jobs.sort((a, b) => b.matchScore - a.matchScore || new Date(b.publishedAt) - new Date(a.publishedAt));
    res.set("Cache-Control", "private, max-age=0, must-revalidate");
    res.json({
      jobs: jobs.slice(0, limit),
      total: jobs.length,
      sources: status,
      profile: context.links,
      searchedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

function parseSaved(row) {
  const parseArray = (value) => {
    if (Array.isArray(value)) return value;
    try { return JSON.parse(value || "[]"); } catch { return []; }
  };
  return {
    ...row,
    remote: Boolean(row.remote),
    tags: parseArray(row.tags),
    matched_skills: parseArray(row.matched_skills),
    missing_skills: parseArray(row.missing_skills),
    top_projects: parseArray(row.top_projects),
  };
}

router.get("/saved", authenticateToken, async (req, res, next) => {
  try {
    const status = req.query.status;
    const params = [];
    let where = "";
    if (typeof status === "string" && ["saved", "applied", "interview", "offer", "rejected"].includes(status)) {
      where = "WHERE status = $1";
      params.push(status);
    }
    const { rows } = await pool.query(
      `SELECT * FROM job_applications ${where} ORDER BY updated_at DESC, id DESC`,
      params
    );
    res.json(rows.map(parseSaved));
  } catch (err) {
    next(err);
  }
});

const savedJobSchema = z.object({
  source: z.string().min(1).max(30),
  external_id: z.string().min(1).max(120),
  title: z.string().min(1).max(240),
  company: z.string().max(160).optional().default(""),
  url: z.string().max(1000).optional().default(""),
  apply_url: z.string().max(1000).optional().default(""),
  location: z.string().max(160).optional().default(""),
  remote: z.union([z.boolean(), z.number()]).optional().default(false),
  salary: z.string().max(120).optional().default(""),
  tags: z.array(z.string().max(60)).max(20).optional().default([]),
  description: z.string().max(8000).optional().default(""),
  match_score: z.number().min(0).max(100).optional().default(0),
  matched_skills: z.array(z.string().max(60)).max(30).optional().default([]),
  missing_skills: z.array(z.string().max(60)).max(20).optional().default([]),
  top_projects: z.array(z.object({
    title: z.string().max(120),
    slug: z.string().max(120),
    tags: z.array(z.string().max(60)).max(20).optional().default([]),
    github: z.string().max(1000).optional().default(""),
    live: z.string().max(1000).optional().default(""),
    featured: z.number().optional().default(0),
    matchedTags: z.array(z.string().max(60)).max(20).optional().default([]),
  })).max(3).optional().default([]),
  notes: z.string().max(4000).optional().default(""),
});

router.post("/saved", authenticateToken, validate(savedJobSchema), async (req, res, next) => {
  try {
    const job = req.body;
    const { rows } = await pool.query(
      `INSERT INTO job_applications (
         source, external_id, title, company, url, apply_url, location, remote,
         salary, tags, description, match_score, matched_skills, missing_skills,
         top_projects, notes
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       ON CONFLICT (source, external_id) DO UPDATE SET
         title = EXCLUDED.title,
         company = EXCLUDED.company,
         url = EXCLUDED.url,
         apply_url = EXCLUDED.apply_url,
         location = EXCLUDED.location,
         remote = EXCLUDED.remote,
         salary = EXCLUDED.salary,
         tags = EXCLUDED.tags,
         description = EXCLUDED.description,
         match_score = EXCLUDED.match_score,
         matched_skills = EXCLUDED.matched_skills,
         missing_skills = EXCLUDED.missing_skills,
         top_projects = EXCLUDED.top_projects,
         updated_at = NOW()
       RETURNING *`,
      [
        job.source, job.external_id, job.title, job.company, job.url, job.apply_url,
        job.location, job.remote ? 1 : 0, job.salary, JSON.stringify(job.tags),
        job.description, job.match_score, JSON.stringify(job.matched_skills),
        JSON.stringify(job.missing_skills), JSON.stringify(job.top_projects), job.notes,
      ]
    );

    await createAuditLog({
      action: "CREATE",
      entity: "job_application",
      entityId: String(rows[0].id),
      newData: { source: job.source, title: job.title, company: job.company },
      ip: req.ip,
    });

    res.status(201).json(parseSaved(rows[0]));
  } catch (err) {
    next(err);
  }
});

const updateSavedSchema = z.object({
  status: z.enum(["saved", "applied", "interview", "offer", "rejected"]).optional(),
  notes: z.string().max(4000).optional(),
  next_action_at: z.string().max(40).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "Nada para atualizar" });

router.patch("/saved/:id", authenticateToken, validate(updateSavedSchema), async (req, res, next) => {
  try {
    const { rows: existingRows } = await pool.query(
      "SELECT * FROM job_applications WHERE id = $1",
      [req.params.id]
    );
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: "Candidatura nao encontrada" });

    const statusChanged = req.body.status && req.body.status !== existing.status;
    const appliedAt = statusChanged && req.body.status === "applied" ? new Date() : existing.applied_at;
    const nextAction = req.body.next_action_at === undefined
      ? existing.next_action_at
      : req.body.next_action_at || null;

    const { rows } = await pool.query(
      `UPDATE job_applications SET
         status = COALESCE($1, status),
         notes = COALESCE($2, notes),
         next_action_at = $3,
         applied_at = $4,
         updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [req.body.status ?? null, req.body.notes ?? null, nextAction, appliedAt, req.params.id]
    );

    if (statusChanged) {
      await pool.query(
        `INSERT INTO job_application_events (application_id, from_status, to_status, note)
         VALUES ($1, $2, $3, $4)`,
        [req.params.id, existing.status, req.body.status, req.body.notes || ""]
      );
    }

    res.json(parseSaved(rows[0]));
  } catch (err) {
    next(err);
  }
});

router.get("/saved/:id/events", authenticateToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM job_application_events WHERE application_id = $1 ORDER BY created_at ASC",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.delete("/saved/:id", authenticateToken, async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM job_applications WHERE id = $1", [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: "Candidatura nao encontrada" });
    res.json({ message: "Candidatura removida" });
  } catch (err) {
    next(err);
  }
});

export default router;
