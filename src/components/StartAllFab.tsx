import { Play } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const StartAllFab = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin") || pathname === "/curriculo" || pathname === "/vagas")
    return null;

  return (
    <Link
      className="startall-fab"
      to="/projetos/startanewday"
      title="Ver o StartANewDay — o app que automatiza a busca por vagas"
    >
      <Play size={15} fill="currentColor" aria-hidden="true" />
      <span className="startall-label">START ALL</span>
    </Link>
  );
};

export default StartAllFab;
