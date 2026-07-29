import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "2jjj";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

router.get("/repos", authenticateToken, async (req, res, next) => {
  try {
    const { search, page = 1, per_page = 30 } = req.query;

    const params = new URLSearchParams({
      page: String(page),
      per_page: String(per_page),
      sort: "updated",
      direction: "desc",
    });

    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "portfolio-admin",
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    };

    if (search) {
      params.set("q", `${search} user:${GITHUB_USERNAME}`);
      params.delete("sort");
      params.delete("direction");

      const searchUrl = `https://api.github.com/search/repositories?${params}`;
      const searchRes = await fetch(searchUrl, { headers });

      if (!searchRes.ok) {
        const errText = await searchRes.text();
        return res.status(searchRes.status).json({ error: searchRes.status === 403 ? "Limite de requisições do GitHub atingido. Tente novamente mais tarde." : "Erro ao buscar repositórios" });
      }

      const searchData = await searchRes.json();
      const repos = searchData.items
        .filter((r) => r.owner.login === GITHUB_USERNAME)
        .map(formatRepo);

      return res.json({ repos, total: searchData.total_count });
    }

    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?${params}`;
    const gitRes = await fetch(url, { headers });

    if (!gitRes.ok) {
      const errText = await gitRes.text();
      return res.status(gitRes.status).json({ error: gitRes.status === 403 ? "Limite de requisições do GitHub atingido. Tente novamente mais tarde." : "Erro ao buscar repositórios" });
    }

    const repos = (await gitRes.json()).map(formatRepo);
    res.json({ repos, total: repos.length });
  } catch (err) {
    next(err);
  }
});

router.get("/repos/:repo", authenticateToken, async (req, res, next) => {
  try {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${req.params.repo}`;
    const gitRes = await fetch(url, { headers });

    if (!gitRes.ok) {
      const errText = await gitRes.text();
      return res.status(gitRes.status).json({ error: gitRes.status === 403 ? "Limite de requisições do GitHub atingido." : "Repositório não encontrado" });
    }

    const repo = await gitRes.json();
    res.json(formatRepo(repo));
  } catch (err) {
    next(err);
  }
});

function formatRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description || "",
    homepage: repo.homepage || "",
    html_url: repo.html_url,
    language: repo.language,
    topics: repo.topics || [],
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    open_issues_count: repo.open_issues_count,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    pushed_at: repo.pushed_at,
    default_branch: repo.default_branch,
    archived: repo.archived,
    fork: repo.fork,
    image: `https://opengraph.githubassets.com/1/${repo.full_name}`,
  };
}

export default router;
