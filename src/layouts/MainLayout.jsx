import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1a1a] text-white">
      <header className="z-10 flex h-[55px] w-full items-center justify-end border-b-2 border-[#414141] bg-[#1e1e1e] px-6 shadow-sm">
        <span className="mr-4 text-lg font-semibold">
          {user?.UserName ?? "مستخدم"}
        </span>

        <button
          onClick={handleLogout}
          className="rounded bg-[#f44336] px-4 py-2 text-sm text-white transition hover:bg-[#ff2020]"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1">
        <aside className="w-[220px] border-r border-[#323232] bg-[#2f2f2f] px-2 py-6">
          <nav>
            <ul className="list-none p-0">
              {[
                { path: "/home", label: "Home" },
                { path: "/projects", label: "Projects" },
                { path: "/tasks", label: "Tasks" },
                { path: "/chat", label: "Chat" },
              ].map(({ path, label }) => (
                <li key={path} className="mb-4">
                  <Link
                    to={path}
                    className={`block rounded px-4 py-3 font-bold ${
                      isActive(path)
                        ? "bg-[#027bff] text-white"
                        : "bg-[#444444] text-[#ccc] hover:bg-[#2f2f2f] hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
