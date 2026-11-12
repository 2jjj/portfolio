import type { ApplicationKit, CareerLinks, JobResult, JobStatus } from "@/types";

export const JOB_STATUSES: JobStatus[] = ["saved", "applied", "interview", "offer", "rejected"];

export const STATUS_LABELS: Record<JobStatus, string> = {
  saved: "Salva",
  applied: "Aplicada",
  interview: "Entrevista",
  offer: "Oferta",
  rejected: "Recusada",
};

export const SOURCE_LABELS: Record<string, string> = {
  remotive: "Remotive",
  jobicy: "Jobicy",
  arbeitnow: "Arbeitnow",
  remoteok: "Remote OK",
};

export function buildApplicationKit(job: JobResult, links: CareerLinks): ApplicationKit {
  const skills = job.matchedSkills.length > 0 ? job.matchedSkills.slice(0, 5) : job.tags.slice(0, 5);
  const projects = job.topProjects.length > 0 ? job.topProjects : [];
  const projectLine = projects[0]
    ? `${projects[0].title}${projects[0].live ? ` (${projects[0].live})` : projects[0].github ? ` (${projects[0].github})` : ""}`
    : "meu portfolio";
  const isEnglish = /responsibilities|requirements|about the role|what you will do|we are looking/i.test(job.description);

  const linkedinSearch = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}&location=${encodeURIComponent(job.location || "Brazil")}`;
  const githubSearch = `https://github.com/search?q=${encodeURIComponent(skills[0] || "backend")}&type=repositories`;
  const mailSubject = encodeURIComponent(isEnglish ? `Application: ${job.title}` : `Candidatura: ${job.title}`);
  const mailBody = encodeURIComponent(
    isEnglish
      ? `Hello ${job.company} team,\n\nI am applying for the ${job.title} role. My portfolio is at ${links.site} and my GitHub is ${links.github}.\n\nBest,\nPedro Sakamoto`
      : `Olá, time da ${job.company},\n\nTenho interesse na vaga de ${job.title}. Meu portfólio está em ${links.site} e meu GitHub em ${links.github}.\n\nAbraço,\nPedro Sakamoto`
  );

  const kitLinks: ApplicationKit["links"] = [
    { label: "Abrir vaga", url: job.applyUrl || job.url, icon: "globe" },
    { label: "Buscar no LinkedIn", url: linkedinSearch, icon: "search" },
    { label: "Meu LinkedIn", url: links.linkedin, icon: "linkedin" },
    { label: "Meu GitHub", url: links.github, icon: "github" },
    { label: "Meu site", url: links.site, icon: "globe" },
    { label: "Currículo", url: links.resume, icon: "file" },
    { label: "E-mail", url: `mailto:${links.email}?subject=${mailSubject}&body=${mailBody}`, icon: "mail" },
    { label: "Projetos no GitHub", url: githubSearch, icon: "search" },
  ];

  const pitch = isEnglish
    ? `I build backends that keep working when nobody is watching. I work with ${skills.join(", ") || "APIs, data and automation"} and recently shipped ${projectLine}.`
    : `Construo back-ends que continuam funcionando quando ninguém está olhando. Trabalho com ${skills.join(", ") || "APIs, dados e automação"} e recentemente entreguei ${projectLine}.`;

  const coverLetter = isEnglish
    ? `Hi ${job.company} team,\n\nI am applying for the ${job.title} role. My background is in backend development with ${skills.join(", ") || "APIs and data"}, and I like owning the part of the system that has to work when nobody is watching. Recent work includes ${projectLine}. You can see the rest of my projects at ${links.site} and ${links.github}.\n\nI would be glad to talk about how I can help your team.\n\nBest,\nPedro Sakamoto`
    : `Olá, time da ${job.company},\n\nTenho interesse na vaga de ${job.title}. Minha base é desenvolvimento back-end com ${skills.join(", ") || "APIs e dados"}, e gosto de cuidar da parte do sistema que precisa funcionar quando ninguém está olhando. Trabalhos recentes incluem ${projectLine}. O restante dos projetos está em ${links.site} e ${links.github}.\n\nFico à disposição para conversar sobre como posso ajudar o time.\n\nAbraço,\nPedro Sakamoto`;

  const checklist = [
    "Currículo aberto e revisado para a vaga",
    "LinkedIn e GitHub atualizados",
    "Projetos em destaque conferidos",
    "Pitch de 3 bullets ensaiado",
    "Carta revisada antes de enviar",
    "Link da vaga salvo no pipeline",
  ];

  return { links: kitLinks, pitch, coverLetter, checklist };
}

export function formatRelativeDate(value: string): string {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";
  const days = Math.floor((Date.now() - timestamp) / 86400000);
  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}sem`;
  return `${Math.floor(days / 30)}m`;
}
