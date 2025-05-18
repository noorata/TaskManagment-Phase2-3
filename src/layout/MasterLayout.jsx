import React from "react";
import { Outlet } from "react-router-dom";

const MasterLayout = () => (
  <div className="flex flex-col min-h-screen bg-surface text-white">
    <main className="flex-1 p-4">
      <Outlet />
    </main>
  </div>
);

export default MasterLayout;
