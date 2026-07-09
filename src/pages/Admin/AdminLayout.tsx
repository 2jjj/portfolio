import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, User, Wrench, Globe, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/admin/sobre", label: "Sobre", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/site", label: "Hero / Site", icon: Globe },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin</h2>
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
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
