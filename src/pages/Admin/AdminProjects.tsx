import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ExternalLink, Github } from "lucide-react";
import { api } from "@/lib/admin-api";

const AdminProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    api.projects.list().then(setProjects).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este projeto?")) return;
    try {
      await api.projects.delete(id);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Projetos</h1>
        <Link to="/admin/projetos/novo" className="admin-btn">
          <Plus size={16} />
          Novo Projeto
        </Link>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : projects.length === 0 ? (
        <p className="admin-empty">Nenhum projeto cadastrado.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Título</th>
                <th>Categoria</th>
                <th>Tags</th>
                <th>Links</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.order_index}</td>
                  <td className="admin-table-title">{p.title}</td>
                  <td><span className="admin-badge">{p.category}</span></td>
                  <td>
                    <div className="admin-tags">
                      {(p.tags || []).map((t: string) => (
                        <span key={t} className="admin-tag">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="admin-table-links">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer"><Github size={16} /></a>
                      )}
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noreferrer"><ExternalLink size={16} /></a>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button onClick={() => navigate(`/admin/projetos/${p.id}`)} className="admin-btn-icon" title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="admin-btn-icon danger" title="Remover">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
