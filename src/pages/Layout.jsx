import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* تخطيط التطبيق الرئيس */
const Layout = () => {
  const { user, logout } = useAuth();       // ⬅️ بيانات ودوال المصادقة
  const location = useLocation();
  const navigate = useNavigate();

  /* لمعرفة الرابط النشط وإعطاء لون مختلف */
  const isActive = (path) => location.pathname === path;

  /* تسجيل الخروج وإعادة التوجيه لصفحة تسجيل الدخول */
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a] text-white">
      {/* الشريط العلوي */}
      <header className="h-[55px] w-full flex justify-end items-center bg-[#1e1e1e] px-6 border-b-2 border-[#414141] shadow-sm z-10">
        <span className="mr-4 text-lg font-semibold">
          {user?.username ?? "مستخدم"}
        </span>

        <button
          onClick={handleLogout}
          className="rounded bg-[#f44336] px-4 py-2 text-sm text-white transition hover:bg-[#ff2020]"
        >
          Logout
        </button>
      </header>

      {/* الشريط الجانبي + المحتوى */}
      <div className="flex flex-1">
        {/* الشريط الجانبي */}
        <aside className="w-[220px] bg-[#2f2f2f] border-r border-[#323232] px-2 py-6">
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

        {/* منطقة المحتوى الرئيس */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
