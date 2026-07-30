import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { Search, FolderKanban, User, Wrench, Settings, FileText, ExternalLink, Home } from "lucide-react";

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  const isAdmin = !!localStorage.getItem("admin_token");

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Comandos"
        className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg rounded-xl border bg-popover text-popover-foreground shadow-2xl"
      >
        <div className="flex items-center border-b px-3">
          <Search size={16} className="mr-2 opacity-50" />
          <Command.Input
            placeholder="Buscar comandos..."
            className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Command.List className="max-h-64 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            Nenhum resultado encontrado.
          </Command.Empty>

          <Command.Group heading="Navegacao">
            <Command.Item
              onSelect={() => run(() => window.scrollTo({ top: 0, behavior: "smooth" }))}
              className="cmd-item"
            >
              <Home size={16} />
              Inicio
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }))}
              className="cmd-item"
            >
              <FolderKanban size={16} />
              Projetos
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" }))}
              className="cmd-item"
            >
              <Wrench size={16} />
              Skills
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }))}
              className="cmd-item"
            >
              <User size={16} />
              Contato
            </Command.Item>
          </Command.Group>

          {isAdmin && (
            <Command.Group heading="Admin">
              <Command.Item
                onSelect={() => run(() => navigate("/admin"))}
                className="cmd-item"
              >
                <Settings size={16} />
                Dashboard
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => navigate("/admin/projetos"))}
                className="cmd-item"
              >
                <FolderKanban size={16} />
                Projetos
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => navigate("/admin/skills"))}
                className="cmd-item"
              >
                <Wrench size={16} />
                Skills
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => navigate("/admin/sobre"))}
                className="cmd-item"
              >
                <User size={16} />
                Sobre
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => navigate("/admin/curriculo"))}
                className="cmd-item"
              >
                <FileText size={16} />
                Curriculo
              </Command.Item>
            </Command.Group>
          )}

          <Command.Group heading="Links">
            <Command.Item
              onSelect={() => run(() => window.open("https://github.com/2jjj", "_blank"))}
              className="cmd-item"
            >
              <ExternalLink size={16} />
              GitHub
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => window.open("https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/", "_blank"))}
              className="cmd-item"
            >
              <ExternalLink size={16} />
              LinkedIn
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
};

export default CommandPalette;
