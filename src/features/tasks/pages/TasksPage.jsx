import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import {
  fetchTasks,
  fetchProjects,
  deleteTask,
} from "../services/tasksService";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";

export default function TasksPage() {
  const { user } = useAuth();
  const isStudent = user.role === "student";

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!user.token) return;
    fetchTasks(user.token).then(setTasks).catch(console.error);
    fetchProjects(user.token).then(setProjects).catch(console.error);
  }, [user.token]);

  const studentsList = useMemo(() => {
    if (!initialData) return [];
    const proj = projects.find((p) => p._id === initialData.projectId);
    return proj?.students || [];
  }, [initialData, projects]);

  function openModal(taskId = null) {
    if (taskId) {
      const selected = tasks.find((t) => t._id === taskId);
      setInitialData({
        ...selected,
        projectId: selected.project?._id || "",
      });
      setEditMode(true);
    } else {
      setInitialData(null);
      setEditMode(false);
    }
    setShowModal(true);
  }

  function handleSaved(updatedTask) {
    if (editMode) {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    } else {
      setTasks((prev) => [...prev, updatedTask]);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(user.token, id);
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  }

  return (
    <section className="p-5 text-[#ccc]">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-xl text-cyan-400">Tasks</h2>
        <button
          onClick={() => openModal()}
          className="ml-auto rounded bg-[#0066ff] px-4 py-2 text-white hover:bg-[#1a5ed1]"
        >
          Create Task
        </button>
      </div>

      <TaskTable
        tasks={tasks}
        currentUser={user}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <TaskModal
        open={showModal}
        onClose={() => setShowModal(false)}
        projects={projects}
        studentsList={studentsList}
        currentUser={user}
        editMode={editMode}
        initialData={initialData}
        onSaved={handleSaved}
      />
    </section>
  );
}
