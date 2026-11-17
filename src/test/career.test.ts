import { describe, it, expect } from "vitest";
import { buildApplicationKit, formatRelativeDate, STATUS_LABELS } from "@/lib/application-kit";
import type { CareerLinks, JobResult } from "@/types";

const links: CareerLinks = {
  github: "https://github.com/2jjj",
  linkedin: "https://linkedin.com/in/pedro",
  email: "pedro@example.com",
  site: "https://pedrosakamoto.site",
  resume: "https://pedrosakamoto.site/curriculo",
  location: "Ribeirão Preto, SP",
  availability: "Disponibilidade imediata",
};

const job: JobResult = {
  id: "1",
  source: "remotive",
  title: "Backend Engineer",
  company: "Acme",
  url: "https://example.com/job",
  applyUrl: "https://example.com/apply",
  location: "Worldwide",
  remote: true,
  salary: "USD 100k",
  tags: ["Node.js", "PostgreSQL"],
  description: "We are looking for a backend engineer. Requirements: Node.js and PostgreSQL.",
  publishedAt: new Date().toISOString(),
  matchScore: 88,
  matchedSkills: ["Node.js", "PostgreSQL"],
  missingSkills: ["Go"],
  topProjects: [
    {
      title: "gofetch",
      slug: "gofetch",
      tags: ["Go"],
      github: "https://github.com/2jjj/gofetch",
      live: "",
      featured: 1,
      matchedTags: ["Go"],
    },
  ],
};

describe("application kit", () => {
  it("linka perfil, vaga, LinkedIn, GitHub, curriculo e email", () => {
    const kit = buildApplicationKit(job, links);
    const urls = kit.links.map((link) => link.url);
    expect(urls).toContain(job.applyUrl);
    expect(urls).toContain(links.linkedin);
    expect(urls).toContain(links.github);
    expect(urls).toContain(links.resume);
    expect(urls.some((url) => url.startsWith("mailto:"))).toBe(true);
    expect(kit.links.length).toBe(8);
  });

  it("gera carta em ingles quando a vaga esta em ingles", () => {
    const kit = buildApplicationKit(job, links);
    expect(kit.coverLetter.startsWith("Hi Acme team")).toBe(true);
    expect(kit.pitch).toContain("Node.js");
    expect(kit.checklist.length).toBeGreaterThan(3);
  });

  it("formata datas relativas e labels de status", () => {
    expect(formatRelativeDate(new Date().toISOString())).toBe("hoje");
    expect(STATUS_LABELS.interview).toBe("Entrevista");
  });
});
