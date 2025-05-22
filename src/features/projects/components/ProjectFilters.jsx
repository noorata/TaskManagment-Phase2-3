export default function ProjectFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onAddClick,
  isStudent,
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-4">
      {!isStudent && (
        <button
          onClick={onAddClick}
          className="rounded bg-[#0066ff] px-3 py-2 font-bold text-white hover:bg-[#0055cc]"
        >
          Add New Project
        </button>
      )}

      <input
        type="text"
        placeholder="Search by title or description..."
        className="min-w-[200px] flex-1 rounded px-3 py-2 text-black outline-none"
        value={search}
        onChange={(e) => onSearchChange(e.target.value.toLowerCase())}
      />

      <select
        className="rounded px-3 py-2 text-black"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        {["All", "In Progress", "Completed", "Pending", "On Hold", "Cancelled"]
          .map((s) => (
            <option key={s}>{s}</option>
          ))}
      </select>
    </div>
  );
}
