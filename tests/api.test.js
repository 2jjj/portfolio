import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

let app;
let adminToken = "";
let hasDB = true;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";
  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "test-password-123";
  process.env.NODE_ENV = "test";
  process.env.GITHUB_USERNAME = "2jjj";
  process.env.DATABASE_URL = process.env.DATABASE_URL || "";

  if (!process.env.DATABASE_URL) {
    hasDB = false;
    return;
  }

  try {
    const { default: expressApp } = await import("../server/app.js");
    app = expressApp;
  } catch {
    hasDB = false;
  }
});

describe("API Health", () => {
  it("deve validar ambiente de teste", () => {
    expect(process.env.NODE_ENV).toBe("test");
    expect(process.env.JWT_SECRET).toBeTruthy();
    expect(process.env.ADMIN_PASSWORD).toBeTruthy();
  });
});

(hasDB ? describe : describe.skip)("API Integration (DB required)", () => {
  it("GET /api/health deve retornar status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status");
  });

  it("POST /api/auth/login deve rejeitar senha vazia", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/auth/login deve rejeitar senha incorreta", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Senha incorreta");
  });

  it("POST /api/auth/login deve fazer login com sucesso", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: process.env.ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    adminToken = res.body.token;
  });

  it("GET /api/projects deve retornar lista paginada", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
  });

  it("GET /api/site deve retornar informacoes", async () => {
    const res = await request(app).get("/api/site");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("hero_description");
  });

  it("GET /api/skills deve retornar array", async () => {
    const res = await request(app).get("/api/skills");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/about deve retornar dados", async () => {
    const res = await request(app).get("/api/about");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("about_text");
  });
});
