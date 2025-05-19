import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const defaultStudents = [
  "Ali Yaseen",
  "Braa Aeesh",
  "Ibn Al-Jawzee",
  "Ibn Malik",
  "Ayman Outom",
  "Salah Salah",
  "Yahya Leader",
  "Salam Kareem",
  "Isaac Nasir",
  "Saeed Salam",
];

const getStatusColor = (status) => {
  switch (status) {
    case "In Progress":
      return "text-[#64c767]";
    case "Completed":
      return "text-[#4794d3]";
    case "Pending":
      return "text-[#cd9746]";
    case "On Hold":
      return "text-[#887b55]";
    case "Cancelled":
      return "text-[#d14c43]";
    default:
      return "text-black";
  }
};

export default function TasksPage() {
  const { user: currentUser } = useAuth();
  const isStudent =
    (currentUser?.role || "").toString().toLowerCase() === "student";

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [sortBy, setSortBy] = useState("status");
  const selectRef = useRef(null);
  const [form, setForm] = useState({
    project: "",
    name: "",
    description: "",
    student: "",
    status: "",
    dueDate: "",
  });

  const storedStudents = (
    JSON.parse(localStorage.getItem("students")) || []
  ).map((s) => (typeof s === "object" ? s.username : s));

  const studentsList = Array.from(
    new Set([...storedStudents, ...defaultStudents])
  );

  const studentProjects = isStudent
    ? (window.fakeProjectsData || [])
        .filter((p) =>
          p.students.split(", ").includes(currentUser.username)
        )
        .map((p) => p.title)
    : [];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    filterAndSet(stored);
  }, []);

  const filterAndSet = (all) => {
    const filtered = isStudent
      ? all.filter((t) => t.student === currentUser.username)
      : (currentUser.role || "") === "Teacher"
      ? all.filter((t) => t.createdBy === currentUser.username)
      : all;
    setTasks(filtered);
  };

  const handleSort = (e) => {
    const val = e.target.value;
    setSortBy(val);
    const sorted = [...tasks].sort((a, b) => {
      if (val === "dueDate")
        return new Date(a.dueDate) - new Date(b.dueDate);
      return a[val].localeCompare(b[val]);
    });
    setTasks(sorted);
  };

  const openModal = (idx = null) => {
    setEditIdx(idx);
    if (idx !== null) setForm({ ...tasks[idx] });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setForm({
      project: "",
      name: "",
      description: "",
      student: "",
      status: "",
      dueDate: "",
    });
    setEditIdx(null);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.id]: e.target.value });

  const saveTasks = (arr) => {
    localStorage.setItem("tasks", JSON.stringify(arr));
    filterAndSet(arr);
  };

  const handleSubmit = () => {
    const { project, name, description, student, status, dueDate } = form;
    if (!project || !name || !description || !status || !dueDate)
      return alert("Please fill all fields");

    const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (editIdx !== null) {
      const originalIdx = allTasks.findIndex(
        (t) => t.id === tasks[editIdx].id
      );
      allTasks[originalIdx] = { ...allTasks[originalIdx], ...form };
      saveTasks(allTasks);
    } else {
      const newTask = {
        id: allTasks.length ? allTasks[allTasks.length - 1].id + 1 : 1,
        project,
        name,
        description,
        student: isStudent ? currentUser.username : student,
        studentNumber:
          (JSON.parse(localStorage.getItem("students")) || []).find(
            (s) => s.username === student
          )?.universityID || "N/A",
        status,
        dueDate,
        createdBy: isStudent ? currentUser.username : currentUser.username,
      };
      allTasks.push(newTask);
      saveTasks(allTasks);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    const all = JSON.parse(localStorage.getItem("tasks")) || [];
    const updated = all.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  return (
    <section className="tasks-page p-5 text-[#ccc]">
      <div className="task-controls mb-5 flex items-center gap-3">
        <label htmlFor="sortTasks">Sort By:</label>
        <select
          id="sortTasks"
          value={sortBy}
          onChange={handleSort}
          ref={selectRef}
          className="rounded bg-[#2b2b2b] px-3 py-2 text-[#d8d5d5]"
        >
          <option value="status">Task Status</option>
          <option value="project">Project</option>
          <option value="dueDate">Due Date</option>
          <option value="student">Assigned Student</option>
        </select>

        <button
          onClick={() => openModal()}
          className="ml-auto rounded bg-[#0066ff] px-4 py-2 text-[#ebe6e6] hover:bg-[#1a5ed1]"
        >
          Create a New Task
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded border border-[#444] bg-[#1e1e1e] p-5 text-white">
            <button
              className="absolute right-3 top-2 text-xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="mb-5 text-2xl text-[#027bff]">
              {editIdx !== null ? "Edit Task" : "Create New Task"}
            </h2>

            <label className="font-bold" htmlFor="project">
              Project Title:
            </label>
            <select
              id="project"
              value={form.project}
              onChange={handleChange}
              className="mb-3 w-full rounded bg-[#333333] p-2"
            >
              <option value="">Select a project</option>
              {isStudent
                ? studentProjects.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))
                : [
                    "Website Redesign",
                    "Mobile App Development",
                    "Data Analysis Project",
                    "Machine Learning Model",
                    "E-commerce Platform",
                  ].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
            </select>

            <label className="font-bold" htmlFor="name">
              Task Name:
            </label>
            <input
              id="name"
              value={form.name}
              onChange={handleChange}
              className="mb-3 w-full rounded bg-[#333333] p-2"
            />

            <label className="font-bold" htmlFor="description">
              Description:
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mb-3 w-full rounded bg-[#333333] p-2"
            />

            <label className="font-bold" htmlFor="student">
              Assigned Student:
            </label>
            <select
              id="student"
              value={form.student}
              onChange={handleChange}
              disabled={isStudent}
              className="mb-3 w-full rounded bg-[#333333] p-2"
            >
              {isStudent ? (
                <option value={currentUser.username}>
                  {currentUser.username}
                </option>
              ) : (
                studentsList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              )}
            </select>

            <label className="font-bold" htmlFor="status">
              Status:
            </label>
            <select
              id="status"
              value={form.status}
              onChange={handleChange}
              className="mb-3 w-full rounded bg-[#333333] p-2"
            >
              <option value="">Select a status</option>
              {[
                "In Progress",
                "Completed",
                "Pending",
                "On Hold",
                "Cancelled",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <label className="font-bold" htmlFor="dueDate">
              Due Date:
            </label>
            <input
              type="date"
              id="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="mb-5 w-full rounded bg-[#333333] p-2"
            />

            <button
              onClick={handleSubmit}
              className="w-full rounded bg-[#4caf50] py-2 font-bold hover:bg-[#029a1b]"
            >
              {editIdx !== null ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
      )}

      {/* الجدول */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full text-left">
          <thead className="bg-[#333] text-white">
            <tr>
              <th className="p-2">Task ID</th>
              <th className="p-2">Project</th>
              <th className="p-2">Task Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Assigned Student</th>
              <th className="p-2">Status</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, idx) => (
              <tr key={t.id} className="border-b border-[#444]">
                <td className="p-2">{t.id}</td>
                <td className="p-2">{t.project}</td>
                <td className="p-2">{t.name}</td>
                <td className="p-2">{t.description}</td>
                <td className="p-2">{t.student}</td>
                <td className={`p-2 ${getStatusColor(t.status)}`}>
                  {t.status}
                </td>
                <td className="p-2">{t.dueDate}</td>
                <td className="flex gap-2 p-2">
                  <button
                    onClick={() => openModal(idx)}
                    className="underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-400 underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
