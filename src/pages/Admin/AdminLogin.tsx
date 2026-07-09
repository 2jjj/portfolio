import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/admin-api";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token } = await api.login(password);
      localStorage.setItem("admin_token", token);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <Lock size={32} className="admin-login-icon" />
        <h1>Painel Administrativo</h1>
        <p className="admin-login-sub">Insira a senha para acessar</p>

        <form onSubmit={handleSubmit}>
          <div className="admin-password-field">
            <input
              type={show ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="button" className="admin-password-toggle" onClick={() => setShow(!show)}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="admin-btn" disabled={loading || !password}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
