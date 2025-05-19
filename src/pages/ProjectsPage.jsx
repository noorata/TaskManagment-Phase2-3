import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

/* بيانات افتراضية */
const defaultProjectsData = [];
const defaultStudentsList = [
  { username: "Salam Kareem", universityID: "130" },
  { username: "Isaac Nasir", universityID: "131" },
  { username: "Saeed Salam", universityID: "132" },
];

/* لون الإطار حسب الفئة */
const getBorderColorByCategory = (category) => {
  switch (category) {
    case "Data Science":
      return "#2096f3";
    case "Mobile Development":
      return "#fd9e00";
    default:
      return "#9e9e9e";
  }
};

/* التقدّم المئوي حسب الحالة */
const getProgressByStatus = (status) => {
  switch (status) {
    case "Completed":
      return 100;
    case "In Progress":
      return 50;
    case "Pending":
      return 10;
    case "On Hold":
      return 25;
    case "Cancelled":
      return 0;
    default:
      return 0;
  }
};

export default function ProjectsPage() {
  /* المستخدم الحالي من سياق المصادقة */
  const { user: currentUser } = useAuth();

  /* الحالة */
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    status: "In Progress",
    students: [],
  });

  /* هل المستخدم طالب؟ */
  const isStudent = () =>
    (currentUser?.role || "").toString().toLowerCase() === "student";

  /* تحميل المشاريع المحفوظة */
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("projects")) || defaultProjectsData;
    setProjects(stored);
  }, []);

  /* حفظ المشاريع في LocalStorage وتحديث الحالة */
  const saveProjects = (arr) => {
    localStorage.setItem("projects", JSON.stringify(arr));
    setProjects(arr);
  };

  /* قائمة الطلاب الموحّدة (الافتراضي + المخزَّن) */
  const mergeStudents = () => {
    const stored = JSON.parse(localStorage.getItem("students")) || [];
    const all = [...defaultStudentsList, ...stored];
    return all.filter(
      (s, i, arr) => i === arr.findIndex((x) => x.universityID === s.universityID)
    );
  };

  /* فلترة وعرض المشاريع */
  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search);
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    if (isStudent()) {
      return (
        matchesSearch &&
        matchesStatus &&
        p.students.toLowerCase().includes(currentUser.username.toLowerCase())
      );
    }
    return matchesSearch && matchesStatus;
  });

  /* إبراز الكلمة المفتاحية في النتائج */
  const highlight = (txt) =>
    search
      ? txt.replace(
          new RegExp(`(${search})`, "gi"),
          "<span class='highlight'>$1</span>"
        )
      : txt;

  /* إضافة مشروع جديد */
  const handleAdd = () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.category.trim() ||
      !form.startDate ||
      !form.endDate ||
      form.students.length === 0
    ) {
      alert("Please fill all fields");
      return;
    }

    const progress = getProgressByStatus(form.status);
    const newProject = {
      ...form,
      progress,
      createdBy: currentUser.username,
      students: form.students.join(", "),
      borderColor: getBorderColorByCategory(form.category),
    };
    const updated = [...projects, newProject];
    saveProjects(updated);

    setShowModal(false);
    setForm({
      title: "",
      description: "",
      category: "",
      startDate: "",
      endDate: "",
      status: "In Progress",
      students: [],
    });
  };

  /* =============================== الواجهة =============================== */
  return (
    <section className="projects-page p-5">
      {/* العنوان والتحكّم */}
      <div className="projects-header mb-5 flex flex-col gap-3">
        <h2 className="text-xl text-[#4da6ff]">Projects Overview</h2>

        <div className="header-actions flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="rounded bg-[#0066ff] px-3 py-2 font-bold text-white hover:bg-[#0055cc]"
          >
            Add New Project
          </button>

          <input
            type="text"
            placeholder="Search projects by title or description..."
            className="min-w-[200px] flex-1 rounded px-3 py-2 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />

          <select
            className="rounded px-3 py-2 text-black"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {["All", "In Progress", "Completed", "Pending", "On Hold", "Cancelled"].map(
              (s) => (
                <option key={s} className="text-black">
                  {s}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* شبكة البطاقات */}
      <div className="projects-grid grid grid-cols-1 gap-5 p-10 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <p className="no-results">No projects found.</p>
        )}

        {filtered.map((p, i) => (
          <div
            key={i}
            className="project-card rounded border bg-[#2b2b2b] p-5"
            style={{
              borderColor: p.borderColor || getBorderColorByCategory(p.category),
            }}
          >
            <h3
              className="mb-2 text-[#0066ff]"
              dangerouslySetInnerHTML={{ __html: highlight(p.title) }}
            />
            <p>
              <strong>Description:</strong>{" "}
              <span
                dangerouslySetInnerHTML={{ __html: highlight(p.description) }}
              />
            </p>
            <p>
              <strong>Students:</strong> {p.students}
            </p>
            <p>
              <strong>Category:</strong> {p.category}
            </p>

            <div className="progress-bar relative my-2 h-4 rounded bg-[#444]">
              <div
                className="h-full bg-[#0066ff]"
                style={{ width: `${p.progress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                {p.progress}%
              </span>
            </div>

            <div className="dates-row mt-2 flex justify-between text-sm text-[#ccc]">
              <span>{p.startDate}</span>
              <span>{p.endDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* النافذة المنبثقة لإضافة مشروع */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-xl rounded bg-[#1e1e1e] p-5">
            <button
              className="absolute right-3 top-2 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="mb-4 text-2xl text-[#027bff]">Add New Project</h2>

            {/* عنوان + وصف */}
            {[
              { id: "title", label: "Project Title" },
              {
                id: "description",
                label: "Project Description",
                textarea: true,
              },
            ].map((f) => (
              <div className="mb-3" key={f.id}>
                <label className="mb-1 block font-bold" htmlFor={f.id}>
                  {f.label}:
                </label>
                {f.textarea ? (
                  <textarea
                    id={f.id}
                    rows={4}
                    className="w-full rounded bg-[#333333] p-2"
                    value={form[f.id]}
                    onChange={(e) =>
                      setForm({ ...form, [f.id]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    id={f.id}
                    className="w-full rounded bg-[#333333] p-2"
                    value={form[f.id]}
                    onChange={(e) =>
                      setForm({ ...form, [f.id]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}

            {/* قائمة الطلاب */}
            <div className="mb-3">
              <label className="mb-1 block font-bold">Students List:</label>
              <select
                multiple
                size={4}
                className="w-full rounded bg-[#333333] p-2"
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
                {mergeStudents().map((s) => (
                  <option key={s.universityID} value={s.username}>
                    {s.username}
                  </option>
                ))}
              </select>
            </div>

            {/* الفئة */}
            <div className="mb-3">
              <label className="mb-1 block font-bold" htmlFor="category">
                Project Category:
              </label>
              <select
                id="category"
                className="w-full rounded bg-[#333333] p-2"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
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

            {/* التواريخ */}
            <div className="mb-3 grid grid-cols-2 gap-3">
              {[
                { id: "startDate", label: "Starting Date" },
                { id: "endDate", label: "Ending Date" },
              ].map((d) => (
                <div key={d.id}>
                  <label className="mb-1 block font-bold" htmlFor={d.id}>
                    {d.label}:
                  </label>
                  <input
                    type="date"
                    id={d.id}
                    className="w-full rounded bg-[#333333] p-2"
                    value={form[d.id]}
                    onChange={(e) =>
                      setForm({ ...form, [d.id]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            {/* الحالة */}
            <div className="mb-5">
              <label className="mb-1 block font-bold" htmlFor="status">
                Project Status:
              </label>
              <select
                id="status"
                className="w-full rounded bg-[#333333] p-2"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {[
                  "In Progress",
                  "Completed",
                  "Pending",
                  "On Hold",
                  "Cancelled",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              className="w-full rounded bg-[#4caf50] py-2 font-bold hover:bg-[#029a1b]"
              onClick={handleAdd}
            >
              Add Project
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
