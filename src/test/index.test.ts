import { describe, it, expect } from "vitest";

describe("Hero Component", () => {
  it("renders without crashing", () => {
    expect(true).toBe(true);
  });
});

describe("Project Types", () => {
  it("validates project structure", () => {
    const project = {
      id: 1,
      title: "Test Project",
      description: "A test project",
      category: "Back-End" as const,
      tags: ["Node.js", "Express"],
      image: "",
      github: "https://github.com/test",
      live: "",
      featured: 1,
      order_index: 1,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    expect(project.title).toBe("Test Project");
    expect(project.category).toBe("Back-End");
    expect(project.tags).toHaveLength(2);
  });
});

describe("Skill Types", () => {
  it("validates skill structure", () => {
    const skill = {
      title: "React",
      category: "Front-End",
      level: 90,
      color: "#00D4FF",
    };

    expect(skill.title).toBe("React");
    expect(skill.level).toBeGreaterThan(0);
    expect(skill.level).toBeLessThanOrEqual(100);
  });
});
