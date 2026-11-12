import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio").max(80, "Maximo 80 caracteres"),
  description: z.string().max(500, "Maximo 500 caracteres").optional().default(""),
  category: z.enum(["Back-End", "Front-End", "Full Stack", "DevOps", "Mobile", "Outro"]).optional().default("Back-End"),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
  image: z.string().max(500).optional().default(""),
  github: z.string().max(500).optional().default(""),
  live: z.string().max(500).optional().default(""),
  featured: z.union([z.boolean(), z.number()]).optional().default(false),
  slug: z.string().max(80).optional(),
  summary: z.string().max(500).optional(),
  problem: z.string().max(5000).optional(),
  architecture: z.string().max(5000).optional(),
  decisions: z.string().max(5000).optional(),
  results: z.string().max(5000).optional(),
  role: z.string().max(80).optional(),
  timeline: z.string().max(80).optional(),
  metrics: z
    .array(
      z.object({
        label: z.string().min(1).max(60),
        value: z.string().min(1).max(60),
      })
    )
    .max(8)
    .optional(),
});

export const projectUpdateSchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio").max(80).optional(),
  description: z.string().max(500).optional(),
  category: z.enum(["Back-End", "Front-End", "Full Stack", "DevOps", "Mobile", "Outro"]).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  image: z.string().max(500).optional(),
  github: z.string().max(500).optional(),
  live: z.string().max(500).optional(),
  featured: z.union([z.boolean(), z.number()]).optional(),
  slug: z.string().max(80).optional(),
  summary: z.string().max(500).optional(),
  problem: z.string().max(5000).optional(),
  architecture: z.string().max(5000).optional(),
  decisions: z.string().max(5000).optional(),
  results: z.string().max(5000).optional(),
  role: z.string().max(80).optional(),
  timeline: z.string().max(80).optional(),
  metrics: z
    .array(
      z.object({
        label: z.string().min(1).max(60),
        value: z.string().min(1).max(60),
      })
    )
    .max(8)
    .optional(),
});

export const skillSchema = z.object({
  title: z.string().min(1, "Nome da skill e obrigatorio").max(40),
  category: z.string().min(1).max(30),
  level: z.number().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor deve ser hexadecimal"),
});

export const skillsUpdateSchema = z.object({
  skills: z.array(skillSchema).min(1, "Pelo menos uma skill e obrigatoria"),
});

export const aboutUpdateSchema = z.object({
  about_text: z.string().max(2000).optional(),
  about_secondary: z.string().max(2000).optional(),
});

export const resumeDataSchema = z
  .object({
    name: z.string().max(120).optional(),
    title: z.string().max(160).optional(),
    targetRole: z.string().max(200).optional(),
    email: z.string().max(160).optional(),
    phone: z.string().max(60).optional(),
    location: z.string().max(160).optional(),
    linkedin: z.string().max(300).optional(),
    github: z.string().max(300).optional(),
    site: z.string().max(300).optional(),
    summary: z.string().max(4000).optional(),
    experiences: z.array(z.record(z.unknown())).max(20).optional(),
    education: z.array(z.record(z.unknown())).max(20).optional(),
    skills: z.array(z.record(z.unknown())).max(80).optional(),
    projects: z.array(z.record(z.unknown())).max(30).optional(),
    languages: z.array(z.record(z.unknown())).max(20).optional(),
    certifications: z.array(z.record(z.unknown())).max(30).optional(),
    updatedAt: z.string().max(40).optional(),
  })
  .passthrough();

export const siteUpdateSchema = z.object({
  hero_description: z.string().max(500).optional(),
  stats_years: z.string().max(10).optional(),
  stats_projects: z.string().max(10).optional(),
  hero_phrases: z.array(z.string().max(60)).max(20).optional(),
  github_url: z.string().max(300).optional(),
  linkedin_url: z.string().max(300).optional(),
  public_email: z.string().max(160).optional(),
  site_url: z.string().max(300).optional(),
  location: z.string().max(120).optional(),
  availability: z.string().max(120).optional(),
  resume_path: z.string().max(200).optional(),
  resume_data: resumeDataSchema.optional(),
  resume_data_en: resumeDataSchema.optional(),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Senha e obrigatoria"),
});

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return res.status(400).json({ error: "Dados invalidos", details: errors });
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return res.status(400).json({ error: "Parametros invalidos", details: errors });
    }
    req.validatedQuery = result.data;
    next();
  };
}
