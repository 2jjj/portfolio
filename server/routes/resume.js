import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

function generateResume(data) {
  const {
    name = "",
    title = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    github = "",
    summary = "",
    experiences = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
  } = data;

  const lines = [];

  // Header
  lines.push(`${name.toUpperCase()}`);
  if (title) lines.push(title);
  const contactParts = [];
  if (email) contactParts.push(email);
  if (phone) contactParts.push(phone);
  if (location) contactParts.push(location);
  if (linkedin) contactParts.push(linkedin);
  if (github) contactParts.push(github);
  if (contactParts.length > 0) lines.push(contactParts.join(" | "));
  lines.push("");

  // Summary
  if (summary) {
    lines.push("RESUMO PROFISSIONAL");
    lines.push("─".repeat(40));
    lines.push(summary);
    lines.push("");
  }

  // Experience
  if (experiences.length > 0) {
    lines.push("EXPERIÊNCIA PROFISSIONAL");
    lines.push("─".repeat(40));
    for (const exp of experiences) {
      const dateStr = [exp.startDate, exp.endDate || "Presente"].filter(Boolean).join(" – ");
      lines.push(`${exp.role || ""}  ·  ${exp.company || ""}`);
      if (dateStr.trim()) lines.push(dateStr);
      if (exp.location) lines.push(exp.location);
      if (exp.description) {
        const bullets = exp.description.split("\n").filter(Boolean);
        for (const bullet of bullets) {
          lines.push(`  • ${bullet.trim()}`);
        }
      }
      lines.push("");
    }
  }

  // Education
  if (education.length > 0) {
    lines.push("FORMAÇÃO ACADÊMICA");
    lines.push("─".repeat(40));
    for (const edu of education) {
      const dateStr = [edu.startDate, edu.endDate || "Presente"].filter(Boolean).join(" – ");
      lines.push(`${edu.degree || ""}  ·  ${edu.institution || ""}`);
      if (dateStr.trim()) lines.push(dateStr);
      if (edu.description) lines.push(edu.description);
      lines.push("");
    }
  }

  // Skills
  if (skills.length > 0) {
    lines.push("HABILIDADES");
    lines.push("─".repeat(40));

    const grouped = {};
    for (const skill of skills) {
      const cat = skill.category || "Geral";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(skill.name || skill.title || "");
    }

    for (const [cat, items] of Object.entries(grouped)) {
      lines.push(`  ${cat}: ${items.join(", ")}`);
    }
    lines.push("");
  }

  // Projects
  if (projects.length > 0) {
    lines.push("PROJETOS DESTACADOS");
    lines.push("─".repeat(40));
    for (const proj of projects) {
      lines.push(`  • ${proj.name || proj.title || ""}`);
      if (proj.description) lines.push(`    ${proj.description}`);
      if (proj.tech) lines.push(`    Tecnologias: ${proj.tech}`);
      if (proj.link) lines.push(`    ${proj.link}`);
      lines.push("");
    }
  }

  // Languages
  if (languages.length > 0) {
    lines.push("IDIOMAS");
    lines.push("─".repeat(40));
    for (const lang of languages) {
      lines.push(`  ${lang.name || ""}: ${lang.level || ""}`);
    }
    lines.push("");
  }

  // Certifications
  if (certifications.length > 0) {
    lines.push("CERTIFICAÇÕES");
    lines.push("─".repeat(40));
    for (const cert of certifications) {
      const parts = [cert.name, cert.issuer, cert.date].filter(Boolean).join(" – ");
      lines.push(`  • ${parts}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function generateResumeHTML(data) {
  const {
    name = "",
    title = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    github = "",
    summary = "",
    experiences = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
  } = data;

  let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Currículo - ${name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', 'Segoe UI', sans-serif; color: #1a1a1a; padding: 2.5rem; max-width: 800px; margin: 0 auto; font-size: 13px; line-height: 1.5; }
  h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 2px; }
  .title { font-size: 13px; color: #555; margin-bottom: 6px; }
  .contact { font-size: 11.5px; color: #666; margin-bottom: 18px; }
  .section { margin-bottom: 16px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #0066cc; border-bottom: 1.5px solid #0066cc; padding-bottom: 3px; margin-bottom: 8px; }
  .exp-item { margin-bottom: 10px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
  .exp-role { font-weight: 700; font-size: 13px; }
  .exp-date { font-size: 11.5px; color: #888; white-space: nowrap; }
  .exp-company { font-size: 12px; color: #555; }
  .exp-location { font-size: 11px; color: #999; }
  .exp-desc { margin-top: 4px; }
  .exp-desc li { margin-bottom: 2px; margin-left: 14px; color: #333; }
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
  .skill-cat { font-weight: 600; }
  .project-item { margin-bottom: 6px; }
  .project-name { font-weight: 700; }
  .project-tech { font-size: 11px; color: #666; }
  .lang-item { display: inline-block; margin-right: 16px; }
  .cert-item { margin-bottom: 3px; margin-left: 14px; }
</style>
</head>
<body>
<h1>${name}</h1>`;

  if (title) html += `\n<div class="title">${title}</div>`;

  const contactParts = [];
  if (email) contactParts.push(email);
  if (phone) contactParts.push(phone);
  if (location) contactParts.push(location);
  if (linkedin) contactParts.push(linkedin);
  if (github) contactParts.push(github);
  if (contactParts.length > 0) html += `\n<div class="contact">${contactParts.join(" &nbsp;|&nbsp; ")}</div>`;

  if (summary) {
    html += `\n<div class="section">
<div class="section-title">Resumo Profissional</div>
<p>${summary}</p>
</div>`;
  }

  if (experiences.length > 0) {
    html += `\n<div class="section"><div class="section-title">Experiência Profissional</div>`;
    for (const exp of experiences) {
      const dateStr = [exp.startDate, exp.endDate || "Presente"].filter(Boolean).join(" – ");
      html += `<div class="exp-item">`;
      html += `<div class="exp-header"><span class="exp-role">${exp.role || ""}</span><span class="exp-date">${dateStr}</span></div>`;
      html += `<div class="exp-company">${exp.company || ""}${exp.location ? " · " + exp.location : ""}</div>`;
      if (exp.description) {
        html += `<ul class="exp-desc">`;
        for (const line of exp.description.split("\n").filter(Boolean)) {
          html += `<li>${line.trim()}</li>`;
        }
        html += `</ul>`;
      }
      html += `</div>`;
    }
    html += `</div>`;
  }

  if (education.length > 0) {
    html += `\n<div class="section"><div class="section-title">Formação Acadêmica</div>`;
    for (const edu of education) {
      const dateStr = [edu.startDate, edu.endDate || "Presente"].filter(Boolean).join(" – ");
      html += `<div class="exp-item">`;
      html += `<div class="exp-header"><span class="exp-role">${edu.degree || ""}</span><span class="exp-date">${dateStr}</span></div>`;
      html += `<div class="exp-company">${edu.institution || ""}</div>`;
      if (edu.description) html += `<p style="margin-top:3px;color:#555">${edu.description}</p>`;
      html += `</div>`;
    }
    html += `</div>`;
  }

  if (skills.length > 0) {
    html += `\n<div class="section"><div class="section-title">Habilidades</div><div class="skills-grid">`;
    const grouped = {};
    for (const skill of skills) {
      const cat = skill.category || "Geral";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(skill.name || skill.title || "");
    }
    for (const [cat, items] of Object.entries(grouped)) {
      html += `<div><span class="skill-cat">${cat}:</span> ${items.join(", ")}</div>`;
    }
    html += `</div></div>`;
  }

  if (projects.length > 0) {
    html += `\n<div class="section"><div class="section-title">Projetos Destacados</div>`;
    for (const proj of projects) {
      html += `<div class="project-item"><span class="project-name">${proj.name || proj.title || ""}</span>`;
      if (proj.description) html += ` – ${proj.description}`;
      if (proj.tech) html += `<div class="project-tech">Tecnologias: ${proj.tech}</div>`;
      html += `</div>`;
    }
    html += `</div>`;
  }

  if (languages.length > 0) {
    html += `\n<div class="section"><div class="section-title">Idiomas</div>`;
    for (const lang of languages) {
      html += `<span class="lang-item">${lang.name}: ${lang.level}</span>`;
    }
    html += `</div>`;
  }

  if (certifications.length > 0) {
    html += `\n<div class="section"><div class="section-title">Certificações</div>`;
    for (const cert of certifications) {
      const parts = [cert.name, cert.issuer, cert.date].filter(Boolean).join(" – ");
      html += `<div class="cert-item">• ${parts}</div>`;
    }
    html += `</div>`;
  }

  html += `\n</body></html>`;
  return html;
}

// Generate resume (authenticated)
router.post("/generate", authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const text = generateResume(data);
    const html = generateResumeHTML(data);
    res.json({ text, html });
  } catch (err) {
    console.error("[Resume Generator Error]", err);
    res.status(500).json({ error: "Erro ao gerar currículo" });
  }
});

export default router;
