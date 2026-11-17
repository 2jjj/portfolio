import type { ResumeData } from "@/types";

export type AuditStatus = "pass" | "warn" | "fail";

export interface AuditCheck {
  id: string;
  label: string;
  status: AuditStatus;
  weight: number;
  detail: string;
  fix: string;
}

export interface ResumeAudit {
  score: number;
  grade: string;
  checks: AuditCheck[];
  suggestions: string[];
  prompt: string;
  stats: {
    bullets: number;
    quantifiedBullets: number;
    words: number;
    skills: number;
    projects: number;
  };
}

const ACTION_VERBS = [
  "construÃ­",
  "construi",
  "modelei",
  "implementei",
  "cobri",
  "criei",
  "integrei",
  "desenhei",
  "desenvolvi",
  "estruturei",
  "liderei",
  "reduzi",
  "aumentei",
  "otimizei",
  "automatizei",
  "migrei",
  "documentei",
  "testei",
  "refatorei",
  "entreguei",
  "built",
  "designed",
  "implemented",
  "created",
  "integrated",
  "developed",
  "reduced",
  "improved",
  "automated",
  "migrated",
  "tested",
  "shipped",
  "led",
];

const ATS_KEYWORDS = [
  "api",
  "sql",
  "node",
  "typescript",
  "postgresql",
  "docker",
  "git",
  "teste",
  "test",
  "rest",
];

const FIRST_PERSON = /\b(eu|meu|minha|i am|my)\b/i;

function bullets(resume: ResumeData): string[] {
  return resume.experiences
    .flatMap((experience) => experience.description.split("\n"))
    .map((line) => line.replace(/^[-*â€¢]\s*/, "").trim())
    .filter(Boolean);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function hasNumber(text: string): boolean {
  return /\d/.test(text);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function statusFor(ratio: number): AuditStatus {
  if (ratio >= 0.999) return "pass";
  if (ratio >= 0.5) return "warn";
  return "fail";
}

export function auditResume(resume: ResumeData): ResumeAudit {
  const bulletList = bullets(resume);
  const quantified = bulletList.filter(hasNumber);
  const quantifiedRatio = bulletList.length ? quantified.length / bulletList.length : 0;
  const strongStarts = bulletList.filter((bullet) => {
    const first = bullet.toLowerCase().split(/\s+/)[0] || "";
    return ACTION_VERBS.includes(first.replace(/[^\p{L}]/gu, ""));
  });
  const actionRatio = bulletList.length ? strongStarts.length / bulletList.length : 0;

  const haystack = [
    resume.summary,
    resume.title,
    ...resume.experiences.map((experience) => `${experience.role} ${experience.description}`),
    ...resume.projects.map((project) => `${project.name} ${project.description} ${project.tech}`),
    ...resume.skills.map((skill) => skill.name),
  ]
    .join(" ")
    .toLowerCase();

  const keywordsFound = ATS_KEYWORDS.filter((keyword) => haystack.includes(keyword));
  const keywordRatio = keywordsFound.length / ATS_KEYWORDS.length;

  const contactFields = [resume.email, resume.phone, resume.github, resume.linkedin, resume.location].filter(
    (value) => Boolean(value && value.trim())
  );
  const contactRatio = contactFields.length / 5;

  const summaryLength = resume.summary.trim().length;
  let summaryRatio = 1;
  let summaryDetail = `${summaryLength} caracteres â€” tamanho bom para leitura rÃ¡pida.`;
  if (summaryLength < 180) {
    summaryRatio = summaryLength / 180;
    summaryDetail = `${summaryLength} caracteres â€” curto demais para convencer em 10 segundos.`;
  } else if (summaryLength > 720) {
    summaryRatio = 0.5;
    summaryDetail = `${summaryLength} caracteres â€” longo; recrutador lÃª por cima.`;
  } else if (FIRST_PERSON.test(resume.summary)) {
    summaryRatio = 0.75;
    summaryDetail = "Bom tamanho, mas escrito em primeira pessoa (comum, porÃ©m menos objetivo).";
  }

  const skillsCount = resume.skills.length;
  let skillsRatio = 1;
  let skillsDetail = `${skillsCount} habilidades listadas.`;
  if (skillsCount < 8) {
    skillsRatio = skillsCount / 8;
    skillsDetail = `${skillsCount} habilidades â€” o filtro ATS vai perder palavras-chave.`;
  } else if (skillsCount > 24) {
    skillsRatio = 0.6;
    skillsDetail = `${skillsCount} habilidades â€” muitas; escolha as que aparecem nas vagas.`;
  }

  const linkedProjects = resume.projects.filter((project) => project.link?.trim());
  const projectsRatio = clamp(resume.projects.length / 3, 0, 1);

  const educationRatio = resume.education.some(
    (education) => education.degree && education.institution
  )
    ? 1
    : 0;

  const experienceRatio = resume.experiences.length
    ? clamp(bulletList.length / (resume.experiences.length * 2), 0, 1)
    : 0;

  const languagesRatio = resume.languages.length >= 2 ? 1 : resume.languages.length / 2;

  const checks: AuditCheck[] = [
    {
      id: "contact",
      label: "Contato completo",
      weight: 10,
      status: statusFor(contactRatio),
      detail: `${contactFields.length}/5 campos preenchidos (e-mail, telefone, GitHub, LinkedIn, localizaÃ§Ã£o).`,
      fix: "Preencha e-mail, telefone/WhatsApp, GitHub, LinkedIn e cidade. Recrutador nÃ£o procura: ele fecha a aba.",
    },
    {
      id: "summary",
      label: "Resumo que vende em 10 segundos",
      weight: 12,
      status: statusFor(summaryRatio),
      detail: summaryDetail,
      fix: "Escreva 3 frases: quem vocÃª Ã©, o que constrÃ³i e um resultado concreto. Sem 'apaixonado por tecnologia'.",
    },
    {
      id: "education",
      label: "FormaÃ§Ã£o acadÃªmica",
      weight: 10,
      status: statusFor(educationRatio),
      detail: educationRatio
        ? `${resume.education.length} formaÃ§Ã£o(Ãµes) cadastrada(s).`
        : "Nenhuma formaÃ§Ã£o cadastrada.",
      fix: "Adicione o curso e a instituiÃ§Ã£o. Para estÃ¡gio e jÃºnior, formaÃ§Ã£o Ã© filtro eliminatÃ³rio.",
    },
    {
      id: "experience",
      label: "ExperiÃªncia com bullets",
      weight: 12,
      status: statusFor(experienceRatio),
      detail: `${bulletList.length} bullets em ${resume.experiences.length} experiÃªncia(s).`,
      fix: "Cada experiÃªncia precisa de 2 a 4 bullets: o que vocÃª fez, com qual tecnologia e qual foi o resultado.",
    },
    {
      id: "quantified",
      label: "Resultados com nÃºmero",
      weight: 15,
      status: statusFor(quantifiedRatio / 0.4),
      detail: `${quantified.length} de ${bulletList.length} bullets tÃªm nÃºmero, mÃ©trica ou percentual.`,
      fix: "Troque 'melhorei o sistema' por 'reduzi o tempo de resposta de 800ms para 120ms'. NÃºmero vence adjetivo.",
    },
    {
      id: "actions",
      label: "Verbos de aÃ§Ã£o no inÃ­cio",
      weight: 10,
      status: statusFor(actionRatio / 0.6),
      detail: `${strongStarts.length} de ${bulletList.length} bullets comeÃ§am com verbo forte.`,
      fix: "Comece cada bullet com verbo: construÃ­, modelei, implementei, reduzi, automatizei, documentei.",
    },
    {
      id: "skills",
      label: "Habilidades na medida",
      weight: 10,
      status: statusFor(skillsRatio),
      detail: skillsDetail,
      fix: "Liste entre 10 e 20 skills, agrupadas por categoria, usando os mesmos termos das vagas.",
    },
    {
      id: "projects",
      label: "Projetos com link",
      weight: 8,
      status: statusFor(projectsRatio) === "pass" && linkedProjects.length < 3 ? "warn" : statusFor(projectsRatio),
      detail: `${resume.projects.length} projeto(s), ${linkedProjects.length} com link.`,
      fix: "Coloque 3 projetos com link clicÃ¡vel. Projeto sem link Ã© afirmaÃ§Ã£o sem prova.",
    },
    {
      id: "keywords",
      label: "Palavras-chave para ATS",
      weight: 8,
      status: statusFor(keywordRatio / 0.6),
      detail: `${keywordsFound.length}/${ATS_KEYWORDS.length} termos essenciais: ${keywordsFound.join(", ") || "nenhum"}.`,
      fix: "Inclua Node, TypeScript, PostgreSQL, SQL, Docker, Git, API REST e testes no texto â€” nÃ£o sÃ³ na lista de skills.",
    },
    {
      id: "languages",
      label: "Idiomas",
      weight: 5,
      status: statusFor(languagesRatio),
      detail: `${resume.languages.length} idioma(s).`,
      fix: "Liste portuguÃªs e inglÃªs com nÃ­vel real. InglÃªs tÃ©cnico jÃ¡ abre vaga remota.",
    },
  ];

  const score = Math.round(
    checks.reduce((total, check) => {
      const factor = check.status === "pass" ? 1 : check.status === "warn" ? 0.5 : 0;
      return total + check.weight * factor;
    }, 0)
  );

  const suggestions = checks
    .filter((check) => check.status !== "pass")
    .sort((a, b) => b.weight - a.weight)
    .map((check) => check.fix);

  if (linkedProjects.length < 3) {
    suggestions.push("Adicione o link de pelo menos 3 projetos (GitHub ou demo) para o recrutador clicar.");
  }

  return {
    score,
    grade: score >= 90 ? "Pronto para aplicar" : score >= 75 ? "Bom â€” dÃ¡ para afiar" : score >= 55 ? "MÃ©dio â€” falta prova" : "Fraco â€” reescreva",
    checks,
    suggestions,
    prompt: buildResumePrompt(resume),
    stats: {
      bullets: bulletList.length,
      quantifiedBullets: quantified.length,
      words: countWords(
        [resume.summary, ...bulletList, resume.title].join(" ")
      ),
      skills: skillsCount,
      projects: resume.projects.length,
    },
  };
}

export function buildResumePrompt(resume: ResumeData, jobDescription = ""): string {
  const target = resume.targetRole || resume.title;
  return [
    "VocÃª Ã© um recrutador tÃ©cnico sÃªnior e especialista em currÃ­culos ATS.",
    `Objetivo: melhorar o currÃ­culo abaixo para a vaga/cargo: ${target}.`,
    jobDescription ? `DescriÃ§Ã£o da vaga:\n${jobDescription}` : "Sem descriÃ§Ã£o de vaga: otimize para back-end jÃºnior/estÃ¡gio.",
    "",
    "Regras:",
    "- Mantenha tudo verdadeiro. NÃ£o invente empresa, tempo ou nÃºmero.",
    "- Escreva em portuguÃªs do Brasil, tom direto, sem primeira pessoa.",
    "- Cada bullet comeÃ§a com verbo de aÃ§Ã£o e inclui tecnologia + resultado mensurÃ¡vel quando existir.",
    "- Resumo com no mÃ¡ximo 4 linhas.",
    "- Liste palavras-chave da vaga no texto e nas habilidades.",
    "- Devolva JSON vÃ¡lido no mesmo formato do currÃ­culo, mais uma lista de 5 mudanÃ§as explicadas.",
    "",
    "CurrÃ­culo atual:",
    "```json",
    JSON.stringify(resume, null, 2),
    "```",
  ].join("\n");
}

export function resumeToText(resume: ResumeData): string {
  const lines: string[] = [resume.name, resume.title, ""];
  const contact = [resume.email, resume.phone, resume.location, resume.linkedin, resume.github, resume.site]
    .filter(Boolean)
    .join(" | ");
  if (contact) lines.push(contact, "");

  if (resume.summary) lines.push("RESUMO", resume.summary, "");

  if (resume.experiences.length) {
    lines.push("EXPERIÃŠNCIA");
    for (const experience of resume.experiences) {
      lines.push(
        `${experience.role} â€” ${experience.company} (${[experience.startDate, experience.endDate].filter(Boolean).join(" â€“ ")})`
      );
      for (const bullet of experience.description.split("\n").filter(Boolean)) {
        lines.push(`- ${bullet.trim()}`);
      }
      lines.push("");
    }
  }

  if (resume.education.length) {
    lines.push("FORMAÃ‡ÃƒO");
    for (const education of resume.education) {
      lines.push(
        `${education.degree} â€” ${education.institution} (${[education.startDate, education.endDate].filter(Boolean).join(" â€“ ")})`
      );
    }
    lines.push("");
  }

  if (resume.skills.length) {
    lines.push("HABILIDADES");
    const grouped: Record<string, string[]> = {};
    for (const skill of resume.skills) {
      grouped[skill.category] = [...(grouped[skill.category] || []), skill.name];
    }
    for (const [category, items] of Object.entries(grouped)) {
      lines.push(`${category}: ${items.join(", ")}`);
    }
    lines.push("");
  }

  if (resume.projects.length) {
    lines.push("PROJETOS");
    for (const project of resume.projects) {
      lines.push(`- ${project.name}: ${project.description} (${project.tech}) ${project.link}`);
    }
    lines.push("");
  }

  if (resume.languages.length) {
    lines.push("IDIOMAS");
    for (const language of resume.languages) lines.push(`${language.name}: ${language.level}`);
  }

  return lines.join("\n").trim();
}
