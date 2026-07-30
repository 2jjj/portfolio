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
});

export const projectUpdateSchema = projectSchema.partial();

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

export const siteUpdateSchema = z.object({
  hero_description: z.string().max(500).optional(),
  stats_years: z.string().max(10).optional(),
  stats_projects: z.string().max(10).optional(),
  stats_dedication: z.string().max(10).optional(),
  hero_phrases: z.array(z.string().max(60)).max(20).optional(),
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
    req.query = result.data;
    next();
  };
}
