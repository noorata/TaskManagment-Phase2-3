
import { useEffect, useState } from "react";

const defaultProjectsData = [];
const defaultStudentsList = [
  { username: "Salam Kareem", universityID: "130" },
  { username: "Isaac Nasir", universityID: "131" },
  { username: "Saeed Salam", universityID: "132" }
];

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

export default function ProjectsPage({ currentUser }) {
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
    students: []
  });

  const isStudent = () => currentUser?.role === "Student";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects")) || defaultProjectsData;
    setProjects(stored);
  }, []);

  const saveProjects = (arr) => {
    localStorage.setItem("projects", JSON.stringify(arr));
    setProjects(arr);
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    if (isStudent())
      return matchesSearch && matchesStatus && p.students.toLowerCase().includes(currentUser.username.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const highlight = (txt) =>
    search ? txt.replace(new RegExp(`(${search})`, "gi"), "<span class='highlight'>$1</span>") : txt;

  const mergeStudents = () => {
    const stored = JSON.parse(localStorage.getItem("students")) || [];
    const all = [...defaultStudentsList, ...stored];
    return all.filter((s, i, arr) => i === arr.findIndex((x) => x.universityID === s.universityID));
  };

  const handleAdd = () => {
    const progress = getProgressByStatus(form.status);
    const newProject = {
      ...form,
      progress,
      createdBy: currentUser.username,
      students: form.students.join(", "),
      borderColor: getBorderColorByCategory(form.category)
    };
    const updated = [...projects, newProject];
    saveProjects(updated);
    setShowModal(false);
    setForm({ title: "", description: "", category: "", startDate: "", endDate: "", status: "In Progress", students: [] });
  };
// const handleAdd = () => {
//   if (
//     !form.title.trim() ||
//     !form.description.trim() ||
//     !form.category.trim() ||
//     !form.startDate ||
//     !form.endDate ||
//     form.students.length === 0
//   ) {
//     alert("Please fill all fields");
//     return;
//   }

//   const progress = getProgressByStatus(form.status);

//   const newProject = {
//     ...form,
//     progress,
//     createdBy: currentUser.username,
//     students: form.students.join(", "),
//     borderColor: getBorderColorByCategory(form.category),
//   };

//   const updated = [...projects, newProject];
//   saveProjects(updated);

//   setShowModal(false);
//   setForm({
//     title: "",
//     description: "",
//     category: "",
//     startDate: "",
//     endDate: "",
//     status: "In Progress",
//     students: [],
//   });
// };
  return (
    <section className="projects-page p-5">
      {/* Header */}
      <div className="projects-header flex flex-col gap-3 mb-5">
        <h2 className="text-xl text-[#4da6ff]">Projects Overview</h2>
        <div className="header-actions flex flex-wrap items-center gap-4">
          <button onClick={() => setShowModal(true)} className="bg-[#0066ff] text-white px-3 py-2 rounded font-bold hover:bg-[#0055cc]">
            Add New Project
          </button>
          <input
            type="text"
            placeholder="Search projects by title or description..."
            className="flex-1 min-w-[200px] px-3 py-2 rounded outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          <select
            className=" text-black px-3 py-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {["All Statuses", "In Progress", "Completed", "Pending", "On Hold", "Cancelled"].map((s) => (
              <option key={s} className="text-black">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="projects-grid grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 p-10">
        {filtered.length === 0 && <p className="no-results">No projects found.</p>}
        {filtered.map((p, i) => (
          <div key={i} className="project-card bg-[#2b2b2b] p-5 rounded border" style={{ borderColor: p.borderColor || getBorderColorByCategory(p.category) }}>
            <h3 className="text-[#0066ff] mb-2" dangerouslySetInnerHTML={{ __html: highlight(p.title) }} />
            <p><strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: highlight(p.description) }} /></p>
            <p><strong>Students:</strong> {p.students}</p>
            <p><strong>Category:</strong> {p.category}</p>
            <div className="progress-bar bg-[#444] rounded relative h-4 my-2">
              <div className="bg-[#0066ff] h-full" style={{ width: `${p.progress}%` }} />
              <span className="absolute inset-0 flex items-center justify-center text-xs text-white">{p.progress}%</span>
            </div>
            <div className="dates-row flex justify-between text-sm text-[#ccc] mt-2">
              <span>{p.startDate}</span>
              <span>{p.endDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] p-5 rounded max-w-xl w-full relative">
            <button className="absolute top-2 right-3 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-[#027bff] text-2xl mb-4">Add New Project</h2>

            {[{ id: "title", label: "Project Title" }, { id: "description", label: "Project Description", textarea: true }].map((f) => (
              <div className="mb-3" key={f.id}>
                <label className="block font-bold mb-1" htmlFor={f.id}>{f.label}:</label>
                {f.textarea ? (
                  <textarea id={f.id} className="w-full bg-[#333333] p-2 rounded" rows={4} value={form[f.id]} onChange={(e) => setForm({ ...form, [f.id]: e.target.value })} />
                ) : (
                  <input id={f.id} className="w-full bg-[#333333] p-2 rounded" value={form[f.id]} onChange={(e) => setForm({ ...form, [f.id]: e.target.value })} />
                )}
              </div>
            ))}

            <div className="mb-3">
              <label className="block font-bold mb-1">Students List:</label>
              <select multiple size={4} className="w-full bg-[#333333] p-2 rounded" value={form.students} onChange={(e) => setForm({ ...form, students: Array.from(e.target.selectedOptions).map((o) => o.text) })}>
                {mergeStudents().map((s) => (
                  <option key={s.universityID} value={s.username}>{s.username}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block font-bold mb-1" htmlFor="category">Project Category:</label>
              <select id="category" className="w-full bg-[#333333] p-2 rounded" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="" disabled>Select a category</option>
                {["Web Development", "Mobile Development", "Data Science", "Machine Learning"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {[{ id: "startDate", label: "Starting Date" }, { id: "endDate", label: "Ending Date" }].map((d) => (
                <div key={d.id}>
                  <label className="block font-bold mb-1" htmlFor={d.id}>{d.label}:</label>
                  <input type="date" id={d.id} className="w-full bg-[#333333] p-2 rounded" value={form[d.id]} onChange={(e) => setForm({ ...form, [d.id]: e.target.value })} />
                </div>
              ))}
            </div>
            

            <div className="mb-5">
              <label className="block font-bold mb-1" htmlFor="status">Project Status:</label>
              <select id="status" className="w-full bg-[#333333] p-2 rounded" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {["In Progress", "Completed", "Pending", "On Hold", "Cancelled"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <button className="w-full bg-[#4caf50] hover:bg-[#029a1b] py-2 rounded font-bold" onClick={handleAdd}>Add Project</button>
          </div>
        </div>
      )}
    </section>
  );
}
