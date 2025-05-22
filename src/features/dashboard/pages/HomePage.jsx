import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { fetchDashboardCounts } from "../services/dashboardService";
import StatCard from "../components/StatCard";
import DashboardChart from "../components/DashboardChart";

export default function HomePage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    studentCount: 0,
    projectCount: 0,
    taskCount: 0,
    finishedProjectsCount: 0,
  });

  useEffect(() => {
    if (!user?.token) return;

    fetchDashboardCounts(user.token)
      .then(setCounts)
      .catch((e) => console.error("Dashboard fetch failed:", e));
  }, [user?.token]);

  const isStudent = user?.role === "student";

  return (
    <div className="min-h-screen overflow-hidden text-white">
      <header className="flex items-center justify-between p-5 font-bold text-[#0574ee]">
        <h1 className="text-xl">Welcome to the Task Management System</h1>
        <span>{new Date().toLocaleString()}</span>
      </header>

      <section className="flex flex-wrap gap-6 px-10">
        <StatCard title="Number of Projects" value={counts.projectCount} />
        {!isStudent && (
          <StatCard title="Number of Students" value={counts.studentCount} />
        )}
        <StatCard title="Number of Tasks" value={counts.taskCount} />
        <StatCard
          title="Finished Projects"
          value={counts.finishedProjectsCount}
        />
      </section>

      <DashboardChart data={counts} isStudent={isStudent} />
    </div>
  );
}
