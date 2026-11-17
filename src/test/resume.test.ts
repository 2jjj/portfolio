import { describe, expect, it } from "vitest";
import { DEFAULT_RESUME, DEFAULT_RESUME_EN } from "@/lib/resume-data";
import { auditResume, buildResumePrompt, resumeToText } from "@/lib/resume-audit";

describe("resume audit", () => {
  it("dÃ¡ nota alta para o currÃ­culo padrÃ£o", () => {
    const audit = auditResume(DEFAULT_RESUME);
    expect(audit.score).toBeGreaterThanOrEqual(75);
    expect(audit.checks).toHaveLength(10);
    expect(audit.stats.projects).toBeGreaterThanOrEqual(3);
  });

  it("penaliza currÃ­culo sem formaÃ§Ã£o, contato e nÃºmeros", () => {
    const weak = {
      ...DEFAULT_RESUME,
      email: "",
      github: "",
      linkedin: "",
      location: "",
      education: [],
      summary: "Curto.",
      experiences: [
        {
          role: "Dev",
          company: "X",
          startDate: "2025",
          endDate: "2025",
          location: "",
          description: "Fiz coisas legais",
        },
      ],
      skills: [],
      projects: [],
      languages: [],
    };

    const audit = auditResume(weak);
    expect(audit.score).toBeLessThan(40);
    expect(audit.checks.filter((check) => check.status === "fail").length).toBeGreaterThanOrEqual(5);
    expect(audit.suggestions.length).toBeGreaterThan(0);
  });

  it("gera prompt com o currÃ­culo em JSON", () => {
    const prompt = buildResumePrompt(DEFAULT_RESUME, "Vaga back-end Node.js");
    expect(prompt).toContain("Vaga back-end Node.js");
    expect(prompt).toContain('"name": "Pedro Sakamoto"');
    expect(prompt).toContain("NÃ£o invente");
  });

  it("exporta texto com as seÃ§Ãµes principais", () => {
    const text = resumeToText(DEFAULT_RESUME_EN);
    expect(text).toContain("EXPERIÃŠNCIA");
    expect(text).toContain("FORMAÃ‡ÃƒO");
    expect(text).toContain("HABILIDADES");
    expect(text).toContain("Unaerp");
  });
});
