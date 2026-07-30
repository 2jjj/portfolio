import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";

let app;
let adminToken = "";

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/portfolio_test";
  process.env.JWT_SECRET = "test-secret-key-for-testing";
  process.env.ADMIN_PASSWORD = "test-password-123";
  process.env.NODE_ENV = "test";
  process.env.GITHUB_USERNAME = "2jjj";

  const { default: expressApp } = await import("../server/app.js");
  app = expressApp;
});

describe("GET /api/health", () => {
  it("deve retornar status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status");
  });
});

describe("POST /api/auth/login", () => {
  it("deve rejeitar senha vazia", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve rejeitar senha incorreta", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "wrong-password" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Senha incorreta");
  });

  it("deve fazer login com sucesso", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "test-password-123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    adminToken = res.body.token;
  });
});

describe("GET /api/projects", () => {
  it("deve retornar lista de projetos", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
  });

  it("deve suportar paginacao", async () => {
    const res = await request(app).get("/api/projects?page=1&limit=5");
    expect(res.status).toBe(200);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(5);
  });
});

describe("POST /api/projects (autenticado)", () => {
  it("deve rejeitar sem token", async () => {
    const res = await request(app)
      .post("/api/projects")
      .send({ title: "Test Project" });
    expect(res.status).toBe(401);
  });

  it("deve rejeitar titulo vazio", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("details");
  });

  it("deve criar projeto com sucesso", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Projeto Teste",
        description: "Descricao do projeto teste",
        category: "Back-End",
        tags: ["Node.js", "Express"],
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Projeto Teste");
  });
});

describe("GET /api/site", () => {
  it("deve retornar informacoes do site", async () => {
    const res = await request(app).get("/api/site");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("hero_description");
  });
});

describe("GET /api/skills", () => {
  it("deve retornar lista de skills", async () => {
    const res = await request(app).get("/api/skills");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /api/about", () => {
  it("deve retornar dados sobre", async () => {
    const res = await request(app).get("/api/about");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("about_text");
  });
});

describe("POST /api/auth/refresh", () => {
  it("deve rejeitar sem cookie", async () => {
    const res = await request(app).post("/api/auth/refresh");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("deve fazer logout", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
  });
});
