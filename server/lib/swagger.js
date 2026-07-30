import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio API - Pedro Sakamoto",
      version: "1.0.0",
      description: "API do portfolio pessoal com gerenciamento de projetos, skills, sobre e geracao de curriculo.",
    },
    servers: [
      { url: "http://localhost:3001", description: "Desenvolvimento" },
      { url: "https://pedrosakamoto.dev", description: "Producao" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./server/routes/*.js"],
};

let spec = null;
try {
  spec = swaggerJsdoc(options);
} catch (err) {
  console.warn("[Swagger] Erro ao gerar spec:", err?.message || err);
  spec = { openapi: "3.0.0", info: { title: "Portfolio API", version: "1.0.0" }, paths: {} };
}

export const swaggerSpec = spec;
