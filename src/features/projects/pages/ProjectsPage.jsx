import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  fetchProjects,
  fetchStudents,
  fetchTasks,
} from "../services/projectsService";
import ProjectCard from "../components/ProjectCard";
import ProjectFilters from "../components/ProjectFilters";
import ProjectModal from "../components/ProjectModal";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const isStudent = user.role === "student";

  useEffect(() => {
    if (!user.token) return;

    fetchProjects(user.token).then(setProjects).catch(console.error);
    fetchStudents(user.token).then(setStudents).catch(console.error);
    fetchTasks(user.token).then(setTasks).catch(console.error);
  }, [user.token]);

  const filteredProjects = projects
    .filter((p) => statusFilter === "All" || p.status === statusFilter)
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );

  function handleCreated(project) {
    setProjects((prev) => [...prev, project]);
  }

  const filteredTasks = tasks
    .filter((t) => selectedProject?._id === t.project?._id)
    .filter((t) => statusFilter === "All" || t.status === statusFilter)
    .filter(
      (t) =>
        t.taskname.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
    );

  return (
    <section className="p-5">
      <h2 className="mb-3 text-xl text-[#4da6ff]">Projects Overview</h2>

      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onAddClick={() => setShowModal(true)}
        isStudent={isStudent}
      />

      <div className="grid grid-cols-1 gap-5 p-10 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length === 0 ? (
          <p>no projects found....</p>
        ) : (
          filteredProjects.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              role={user.role}
              onSelect={setSelectedProject}
            />
          ))
        )}
      </div>

      {selectedProject && (
        <aside className="fixed right-0 top-0 h-full w-1/3 overflow-y-auto border-l border-gray-700 bg-[#1e1e1e] p-10">
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute right-4 top-14 text-2xl font-bold text-white hover:text-red-500"
          >
            ×
          </button>
          <h2 className="mb-2 text-xl font-bold text-cyan-400">
            {selectedProject.title}
          </h2>
          <p className="mb-1">
            <strong>Description:</strong> {selectedProject.description}
          </p>
          <p className="mb-1">
            <strong>Category:</strong> {selectedProject.category}
          </p>
          <p className="mb-1">
            <strong>Students:</strong>{" "}
            {selectedProject.students.map((s) => s.UserName).join(", ")}
          </p>

          <h3 className="mt-4 text-lg font-bold text-teal-300">Tasks</h3>
          {filteredTasks.length ? (
            filteredTasks.map((t, i) => (
              <div
                key={t._id}
                className="mt-2 rounded border bg-[#2c2c2c] p-2"
              >
                <p>
                  <strong>Task #:</strong> {i + 1}
                </p>
                <p>
                  <strong>Name:</strong> {t.taskname}
                </p>
                <p>
                  <strong>Description:</strong> {t.description}
                </p>
                <p>
                  <strong>Assigned:</strong> {t.assignedTo?.UserName || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {t.status}
                </p>
              </div>
            ))
          ) : (
            <p className="mt-2 text-gray-400">No tasks found.</p>
          )}
        </aside>
      )}

      <ProjectModal
        open={showModal}
        onClose={() => setShowModal(false)}
        students={students}
        onCreated={handleCreated}
      />
    </section>
  );
}
