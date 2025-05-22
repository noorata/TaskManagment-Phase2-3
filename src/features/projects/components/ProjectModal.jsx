import { useState } from "react";
import { addProject } from "../services/projectsService";
import { useAuth } from "@/app/context/AuthContext";

const statusOptions = [
  { label: "In Progress", value: "InProgress" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "On Hold", value: "OnHold" },
  { label: "Cancelled", value: "Cancelled" },
];

export default function ProjectModal({ open, onClose, students, onCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    status: "InProgress",
    students: [],
  });

  if (!open) return null;

  async function handleSubmit() {
    if (
      !form.title ||
      !form.description ||
      !form.category ||
      !form.startDate ||
      !form.endDate ||
      form.students.length === 0
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const project = await addProject(user.token, form);
      onCreated(project);
      onClose();
      setForm({
        title: "",
        description: "",
        category: "",
        startDate: "",
        endDate: "",
        status: "InProgress",
        students: [],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add project");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-xl rounded bg-[#1e1e1e] p-5">
        <button
          className="absolute right-3 top-2 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="mb-4 text-2xl text-[#027bff]">Add New Project</h2>

        {[
          { id: "title", label: "Project Title" },
          { id: "description", label: "Project Description", textarea: true },
        ].map((f) => (
          <div className="mb-3" key={f.id}>
            <label className="mb-1 block font-bold">{f.label}</label>
            {f.textarea ? (
              <textarea
                rows={4}
                className="w-full rounded bg-[#333333] p-2"
                value={form[f.id]}
                onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
              />
            ) : (
              <input
                className="w-full rounded bg-[#333333] p-2"
                value={form[f.id]}
                onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
              />
            )}
          </div>
        ))}

        <div className="mb-3">
          <label className="mb-1 block font-bold">Students List:</label>
          <select
            multiple
            size={4}
            className="w-full rounded bg-[#333333] p-2 text-white"
            value={form.students}
            onChange={(e) =>
              setForm({
                ...form,
                students: Array.from(e.target.selectedOptions).map(
                  (o) => o.value
                ),
              })
            }
          >
            {students.map((s) => (
              <option key={s.id} value={s.UserName}>
                {s.UserName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="mb-1 block font-bold">Project Category:</label>
          <select
            className="w-full rounded bg-[#333333] p-2"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="" disabled>
              Select a category
            </option>
            {[
              "Web Development",
              "Mobile Development",
              "Data Science",
              "Machine Learning",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-3">
          {[
            { id: "startDate", label: "Starting Date" },
            { id: "endDate", label: "Ending Date" },
          ].map((d) => (
            <div key={d.id}>
              <label className="mb-1 block font-bold">{d.label}:</label>
              <input
                type="date"
                className="w-full rounded bg-[#333333] p-2"
                value={form[d.id]}
                onChange={(e) =>
                  setForm({ ...form, [d.id]: e.target.value })
                }
              />
            </div>
          ))}
        </div>

        <div className="mb-5">
          <label className="mb-1 block font-bold">Project Status:</label>
          <select
            className="w-full rounded bg-[#333333] p-2"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded bg-[#4caf50] py-2 font-bold hover:bg-[#029a1b]"
        >
          Add Project
        </button>
      </div>
    </div>
  );
}
