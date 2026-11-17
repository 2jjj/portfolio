import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: rota inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <p className="section-label">Erro 404</p>
        <h1
          className="mb-4 text-5xl font-extrabold tracking-tight"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          PÃ¡gina nÃ£o encontrada
        </h1>
        <p className="mb-8 text-muted-foreground">
          O endereÃ§o <code className="text-primary">{location.pathname}</code> nÃ£o existe neste
          portfÃ³lio.
        </p>
        <Link to="/" className="btn btn-primary">
          Voltar para o inÃ­cio
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
