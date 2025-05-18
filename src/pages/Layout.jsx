import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Layout = ({ adminName }) => {
  const location = useLocation(); 

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      {/* Top Nav */}
      <header className="h-[55px] w-full flex justify-end items-center bg-[#1e1e1e] px-6 border-b-2 border-[#414141] shadow-sm z-10">
        <span className="font-semibold text-white mr-4 text-lg">{adminName}</span>
        <button
          onClick={() => alert("Logout")}
          className="bg-[#f44336] text-white px-4 py-2 rounded text-sm hover:bg-[#ff2020]"
        >
          Logout
        </button>
      </header>

      {/* Sidebar + Page */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          id="sidebar"
          className="w-[220px] bg- #2f2f2f border-r border-[#323232] px-2 py-6"
        >
          <nav className="menu">
            <ul className="list-none p-0">
              <li className="mb-4">
                <Link
                  to="/home"
                  className={`block px-4 py-3 rounded font-bold ${
                    isActive("/home")
                      ? "bg-[#027bff] text-white"
                      : "bg-[#444444] text-[#ccc] hover:bg-[#2f2f2f] hover:text-white"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/projects"
                  className={`block px-4 py-3 rounded ${
                    isActive("/projects")
                      ? "bg-[#027bff] text-white"
                      : "bg-[#444444] text-[#ccc] hover:bg-[#2f2f2f] hover:text-white"
                  }`}
                >
                  Projects
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/tasks"
                  className={`block px-4 py-3 rounded ${
                    isActive("/tasks")
                      ? "bg-[#027bff] text-white"
                      : "bg-[#444444] text-[#ccc] hover:bg-[#2f2f2f] hover:text-white"
                  }`}
                >
                  Tasks
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/chat"
                  className={`block px-4 py-3 rounded ${
                    isActive("/chat")
                      ? "bg-[#027bff] text-white"
                      : "bg-[#444444] text-[#ccc] hover:bg-[#2f2f2f] hover:text-white"
                  }`}
                >
                  Chat
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
