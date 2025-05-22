import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addTask, updateTask } from "../services/tasksService";

export default function TaskModal({
  open,
  onClose,
  projects,
  studentsList,
  currentUser,
  editMode,
  initialData,
  onSaved,
}) {
  const [form, setForm] = useState({
    projectId: "",
    projecttitle: "",
    taskname: "",
    description: "",
    assignedTo: currentUser.UserName,
    status: "",
    dueDate: "",
  });

  useEffect(() => {
    if (editMode && initialData) {
      setForm({ ...initialData });
    }
  }, [editMode, initialData]);

  const isStudent = currentUser.role === "student";

  function handleChange(e) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

    if (id === "projectId") {
      const p = projects.find((pr) => pr._id === value);
      setForm((prev) => ({
        ...prev,
        projecttitle: p?.title || "",
      }));
    }
  }

  async function handleSubmit() {
    try {
      const token = currentUser.token;

      if (!token) {
        toast.error("You are not logged in");
        return;
      }

      let saved;
      if (editMode) {
        saved = await updateTask(token, initialData._id, form);
        toast.success("✅ Task updated");
      } else {
        saved = await addTask(token, form);
        toast.success("✅ Task added");
      }

      onSaved(saved);
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save task");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded bg-[#1e1e1e] p-5 text-white">
        <button className="absolute right-3 top-2 text-xl" onClick={onClose}>
          &times;
        </button>

        <h2 className="mb-5 text-2xl text-[#027bff]">
          {editMode ? "Edit Task" : "Create New Task"}
        </h2>

        <label className="font-bold" htmlFor="projectId">
          Project Title:
        </label>
        <select
          id="projectId"
          value={form.projectId}
          onChange={handleChange}
          className="mb-3 w-full rounded bg-[#333333] p-2"
        >
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        {[
          { id: "taskname", label: "Task Name" },
          { id: "description", label: "Description", textarea: true },
        ].map((f) => (
          <div key={f.id}>
            <label className="font-bold" htmlFor={f.id}>
              {f.label}:
            </label>
            {f.textarea ? (
              <textarea
                id={f.id}
                rows={4}
                className="mb-3 w-full rounded bg-[#333333] p-2"
                value={form[f.id]}
                onChange={handleChange}
              />
            ) : (
              <input
                id={f.id}
                className="mb-3 w-full rounded bg-[#333333] p-2"
                value={form[f.id]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        <label className="font-bold" htmlFor="assignedTo">
          Assigned Student:
        </label>
        <select
          id="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          disabled={isStudent}
          className="mb-3 w-full rounded bg-[#333333] p-2"
        >
          {isStudent ? (
            <option value={currentUser.UserName}>{currentUser.UserName}</option>
          ) : (
            studentsList.map((st) => (
              <option key={st.id} value={st.UserName}>
                {st.UserName}
              </option>
            ))
          )}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold" htmlFor="status">
              Status:
            </label>
            <select
              id="status"
              value={form.status}
              onChange={handleChange}
              className="mb-3 w-full rounded bg-[#333333] p-2"
            >
              {[
                { label: "In Progress", value: "InProgress" },
                { label: "Completed", value: "Completed" },
                { label: "Pending", value: "Pending" },
                { label: "On Hold", value: "OnHold" },
                { label: "Cancelled", value: "Cancelled" },
              ].map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold" htmlFor="dueDate">
              Due Date:
            </label>
            <input
              type="date"
              id="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="mb-3 w-full rounded bg-[#333333] p-2"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded bg-[#4caf50] py-2 font-bold hover:bg-[#029a1b]"
        >
          {editMode ? "Update Task" : "Add Task"}
        </button>
      </div>
    </div>
  );
}
