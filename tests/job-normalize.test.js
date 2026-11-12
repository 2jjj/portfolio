import { describe, it, expect } from "vitest";
import {
  createJob,
  formatSalary,
  matchJob,
  searchable,
  stripHtml,
} from "../server/lib/job-normalize.js";

describe("job normalization", () => {
  it("remove HTML, scripts e entidades", () => {
    const raw = '<p>Back-end &amp; APIs</p><script>alert("x")</script><style>.x{}</style>';
    expect(stripHtml(raw)).toBe("Back-end & APIs");
  });

  it("normaliza uma vaga e descarta URLs invalidas", () => {
    const job = createJob({
      id: 42,
      source: "remotive",
      title: " Backend Engineer ",
      company: " Acme ",
      url: "https://example.com/job",
      applyUrl: "javascript:alert(1)",
      location: "Worldwide",
      remote: true,
      tags: ["Node.js", "Node.js", "PostgreSQL"],
      description: "<p>Build APIs</p>",
      publishedAt: "2026-10-20T10:00:00Z",
    });

    expect(job.id).toBe("42");
    expect(job.title).toBe("Backend Engineer");
    expect(job.applyUrl).toBe("");
    expect(job.tags).toEqual(["Node.js", "PostgreSQL"]);
    expect(job.description).toBe("Build APIs");
  });

  it("formata salario anual", () => {
    expect(formatSalary(140000, 170000, "USD", "yearly")).toBe("USD 140k–170k/ano");
    expect(formatSalary(0, 0)).toBe("");
  });
});

describe("job matching", () => {
  const context = {
    skills: ["Node.js", "PostgreSQL", "Go", "Docker", "React", "TypeScript"],
    projects: [
      {
        title: "gofetch",
        slug: "gofetch",
        tags: ["Go", "HTTP"],
        github: "https://github.com/2jjj/gofetch",
        live: "",
        featured: 1,
      },
      {
        title: "reconkit",
        slug: "reconkit",
        tags: ["Python", "Security"],
        github: "https://github.com/2jjj/reconkit",
        live: "",
        featured: 0,
      },
    ],
  };

  const job = createJob({
    id: "job-1",
    source: "remotive",
    title: "Backend Engineer",
    company: "Acme",
    url: "https://example.com/job",
    location: "Worldwide",
    remote: true,
    tags: ["Node.js", "PostgreSQL", "Go", "Docker", "React"],
    description: "Build reliable APIs with Node.js and PostgreSQL. Experience with Go and Docker.",
    publishedAt: new Date().toISOString(),
  });

  it("encontra skills, projetos e score alto", () => {
    const match = matchJob(job, context);
    expect(match.matchedSkills).toEqual(expect.arrayContaining(["Node.js", "PostgreSQL", "Go", "Docker"]));
    expect(match.missingSkills).toEqual([]);
    expect(match.matchScore).toBeGreaterThanOrEqual(65);
    expect(match.topProjects[0].title).toBe("gofetch");
  });

  it("filtra por query, localizacao e remoto", () => {
    expect(searchable(job, "backend apis", "Brasil", true)).toBe(true);
    expect(searchable(job, "designer", "Brasil", true)).toBe(false);
    expect(searchable({ ...job, remote: false }, "", "Brasil", true)).toBe(false);
  });
});
