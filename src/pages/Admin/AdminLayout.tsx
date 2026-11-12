import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, User, Wrench, Globe, FileText, LogOut, Menu, Sun, Moon, Search, Briefcase } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Command } from "cmdk";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/carreira", label: "Carreira", icon: Briefcase },
  { href: "/admin/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/admin/sobre", label: "Sobre", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/site", label: "Hero / Site", icon: Globe },
  { href: "/admin/curriculo", label: "Currículo", icon: FileText },
];

const SidebarContent = ({ collapsed }: { collapsed?: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <>
      <div className="admin-sidebar-header">
        <h2>{collapsed ? "A" : "Admin"}</h2>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => {
          const active = item.href === "/admin"
            ? location.pathname === "/admin"
            : location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`admin-nav-item ${active ? "active" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <button
          className="admin-nav-item"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={collapsed ? (theme === "dark" ? "Modo claro" : "Modo escuro") : undefined}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && (theme === "dark" ? "Modo Claro" : "Modo Escuro")}
        </button>
        <button className="admin-nav-item admin-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          {!collapsed && "Sair"}
        </button>
      </div>
    </>
  );
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-sidebar-collapse">
          <button onClick={() => setCollapsed((c) => !c)} className="admin-collapse-btn" aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}>
            <Menu size={16} />
          </button>
        </div>
        <SidebarContent collapsed={collapsed} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <button className="admin-mobile-menu-btn" aria-label="Abrir navegacao">
            <Menu size={20} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[240px]">
          <div className="admin-sidebar h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      <main className="admin-content" key={location.pathname}>
        <Outlet />
      </main>

      <Command.Dialog
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        label="Comandos Admin"
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
          {navItems.map((item) => (
            <Command.Item
              key={item.href}
              onSelect={() => { setCmdOpen(false); navigate(item.href); }}
              className="cmd-item"
            >
              <item.icon size={16} />
              {item.label}
            </Command.Item>
          ))}
        </Command.List>
      </Command.Dialog>
    </div>
  );
};

export default AdminLayout;
