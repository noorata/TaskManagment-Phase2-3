const borderByCategory = {
  "Data Science": "#2096f3",
  "Mobile Development": "#fd9e00",
};
const progressByStatus = {
  Completed: 100,
  "In Progress": 50,
  Pending: 10,
  "On Hold": 25,
  Cancelled: 0,
};

export default function ProjectCard({ project, role, onSelect }) {
  const borderColor = borderByCategory[project.category] || "#9e9e9e";
  const progress = progressByStatus[project.status] ?? 0;

  function formatDate(ts) {
    if (!ts) return "";
    const d = new Date(Number(ts));
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  }

  return (
    <div
      onClick={() => role !== "student" && onSelect(project)}
      className={`rounded border bg-[#2b2b2b] p-5 hover:border-white ${
        role === "student" ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{ borderColor }}
    >
      <h3 className="mb-2 font-semibold text-[#0066ff]">{project.title}</h3>

      <p className="mb-1">
        <strong>Description:</strong> {project.description}
      </p>

      <p className="mb-1">
        <strong>Students:</strong>{" "}
        {project.students.map((s) => s.UserName).join(", ")}
      </p>

      <p className="mb-1">
        <strong>Category:</strong> {project.category}
      </p>

      <div className="relative my-2 h-4 rounded bg-[#444]">
        <div
          className="h-full rounded bg-[#0066ff]"
          style={{ width: `${progress}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
          {progress}%
        </span>
      </div>

      <div className="mt-2 flex justify-between text-sm text-[#ccc]">
        <span>{formatDate(project.startDate)}</span>
        <span>{formatDate(project.endDate)}</span>
      </div>
    </div>
  );
}
