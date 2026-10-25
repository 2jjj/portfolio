const projectMetric = {
  type: "object",
  required: ["label", "value"],
  properties: {
    label: { type: "string", example: "Linguagem" },
    value: { type: "string", example: "Go" },
  },
};

const project = {
  type: "object",
  properties: {
    id: { type: "integer", example: 1 },
    title: { type: "string", example: "gofetch" },
    slug: { type: "string", example: "gofetch" },
    description: { type: "string" },
    summary: { type: "string" },
    category: { type: "string", example: "Back-End" },
    tags: { type: "array", items: { type: "string" }, example: ["Go", "HTTP"] },
    image: { type: "string" },
    github: { type: "string" },
    live: { type: "string" },
    featured: { type: "integer", example: 0 },
    order_index: { type: "integer", example: 1 },
    problem: { type: "string" },
    architecture: { type: "string" },
    decisions: { type: "string" },
    results: { type: "string" },
    role: { type: "string", example: "Autor" },
    timeline: { type: "string", example: "2026" },
    metrics: { type: "array", items: projectMetric },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
  },
};

const projectInput = {
  type: "object",
  required: ["title", "category"],
  properties: {
    title: { type: "string", maxLength: 80 },
    slug: { type: "string", maxLength: 80 },
    description: { type: "string", maxLength: 500 },
    summary: { type: "string", maxLength: 500 },
    category: { type: "string", enum: ["Back-End", "Front-End", "Full Stack", "DevOps", "Mobile", "Outro"] },
    tags: { type: "array", items: { type: "string" }, maxItems: 10 },
    image: { type: "string" },
    github: { type: "string" },
    live: { type: "string" },
    featured: { oneOf: [{ type: "boolean" }, { type: "integer" }] },
    problem: { type: "string", maxLength: 5000 },
    architecture: { type: "string", maxLength: 5000 },
    decisions: { type: "string", maxLength: 5000 },
    results: { type: "string", maxLength: 5000 },
    role: { type: "string", maxLength: 80 },
    timeline: { type: "string", maxLength: 80 },
    metrics: { type: "array", items: projectMetric, maxItems: 8 },
  },
};

const skill = {
  type: "object",
  properties: {
    title: { type: "string", example: "Node.js" },
    category: { type: "string", example: "Back-End" },
    level: { type: "integer", example: 80 },
    color: { type: "string", example: "#00D4FF" },
  },
};

const error = {
  type: "object",
  properties: {
    error: { type: "string", example: "Projeto nao encontrado" },
  },
};

const auth = [{ bearerAuth: [] }];

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Portfolio API - Pedro Sakamoto",
    version: "1.0.0",
    description:
      "API do portfólio: projetos, cases, skills, site, GitHub, currículo e autenticação do admin.",
  },
  servers: [
    { url: "https://www.pedrosakamoto.site", description: "Produção" },
    { url: "http://localhost:3001", description: "Desenvolvimento" },
  ],
  tags: [
    { name: "Público", description: "Endpoints sem autenticação" },
    { name: "Projetos", description: "Projetos e cases" },
    { name: "Conteúdo", description: "Skills, site e sobre" },
    { name: "GitHub", description: "Repositórios públicos" },
    { name: "Admin", description: "Endpoints protegidos por JWT" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Project: project,
      ProjectInput: projectInput,
      Skill: skill,
      Error: error,
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Público"],
        summary: "Status da API e do banco",
        responses: {
          200: {
            description: "API saudável",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    env: { type: "string", example: "production" },
                    database: { type: "string", example: "connected" },
                    uptime: { type: "number" },
                  },
                },
              },
            },
          },
          503: { description: "Banco indisponível" },
        },
      },
    },
    "/api/projects/all": {
      get: {
        tags: ["Projetos"],
        summary: "Lista todos os projetos e cases",
        responses: {
          200: {
            description: "Lista de projetos",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Project" } },
              },
            },
          },
        },
      },
    },
    "/api/projects": {
      get: {
        tags: ["Projetos"],
        summary: "Lista paginada com busca e filtros",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "featured", in: "query", schema: { type: "integer", enum: [0, 1] } },
        ],
        responses: {
          200: {
            description: "Página de projetos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/Project" } },
                    pagination: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        total: { type: "integer" },
                        totalPages: { type: "integer" },
                        hasMore: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Admin"],
        summary: "Cria um projeto",
        security: auth,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ProjectInput" } },
          },
        },
        responses: {
          201: {
            description: "Projeto criado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Project" } },
            },
          },
          401: { description: "Não autenticado" },
          422: { description: "Payload inválido" },
        },
      },
    },
    "/api/projects/slug/{slug}": {
      get: {
        tags: ["Projetos"],
        summary: "Busca um projeto pelo slug",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            description: "Projeto encontrado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Project" } },
            },
          },
          404: {
            description: "Não encontrado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/api/projects/{id}": {
      get: {
        tags: ["Projetos"],
        summary: "Busca um projeto pelo id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: {
            description: "Projeto encontrado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Project" } },
            },
          },
          404: { description: "Não encontrado" },
        },
      },
      put: {
        tags: ["Admin"],
        summary: "Atualiza um projeto",
        security: auth,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ProjectInput" } },
          },
        },
        responses: {
          200: {
            description: "Projeto atualizado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Project" } },
            },
          },
          401: { description: "Não autenticado" },
        },
      },
      delete: {
        tags: ["Admin"],
        summary: "Remove um projeto (soft delete)",
        security: auth,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "Projeto removido" },
          401: { description: "Não autenticado" },
        },
      },
    },
    "/api/skills": {
      get: {
        tags: ["Conteúdo"],
        summary: "Lista skills",
        responses: {
          200: {
            description: "Skills",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Skill" } },
              },
            },
          },
        },
      },
      put: {
        tags: ["Admin"],
        summary: "Substitui a lista de skills",
        security: auth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["skills"],
                properties: {
                  skills: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Skill" },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Skills atualizadas" },
          401: { description: "Não autenticado" },
        },
      },
    },
    "/api/site": {
      get: {
        tags: ["Conteúdo"],
        summary: "Informações do site",
        responses: { 200: { description: "Hero, estatísticas e frases" } },
      },
      put: {
        tags: ["Admin"],
        summary: "Atualiza informações do site",
        security: auth,
        responses: {
          200: { description: "Informações atualizadas" },
          401: { description: "Não autenticado" },
        },
      },
    },
    "/api/about": {
      get: {
        tags: ["Conteúdo"],
        summary: "Texto da seção Sobre",
        responses: { 200: { description: "Sobre" } },
      },
      put: {
        tags: ["Admin"],
        summary: "Atualiza a seção Sobre",
        security: auth,
        responses: {
          200: { description: "Sobre atualizado" },
          401: { description: "Não autenticado" },
        },
      },
    },
    "/api/resume": {
      post: {
        tags: ["Admin"],
        summary: "Gera o HTML do currículo",
        security: auth,
        responses: {
          200: { description: "HTML gerado" },
          401: { description: "Não autenticado" },
        },
      },
    },
    "/api/github/public": {
      get: {
        tags: ["GitHub"],
        summary: "Repositórios públicos selecionados",
        responses: { 200: { description: "Lista de repositórios com cache" } },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Admin"],
        summary: "Login do admin",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["password"],
                properties: { password: { type: "string", format: "password" } },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Access token + refresh cookie",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { token: { type: "string" } },
                },
              },
            },
          },
          401: { description: "Senha incorreta" },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Admin"],
        summary: "Renova o access token",
        responses: {
          200: { description: "Novo access token" },
          401: { description: "Refresh ausente" },
          403: { description: "Refresh inválido ou revogado" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Admin"],
        summary: "Encerra a sessão e revoga o refresh",
        responses: { 200: { description: "Sessão encerrada" } },
      },
    },
  },
};
