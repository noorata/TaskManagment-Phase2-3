import { FaEdit, FaTrash } from "react-icons/fa";

const statusColor = {
  Pending: "text-yellow-400",
  InProgress: "text-blue-400",
  Completed: "text-green-400",
  OnHold: "text-amber-600",
  Cancelled: "text-red-500",
};

export default function TaskTable({
  tasks,
  currentUser,
  onEdit,
  onDelete,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full text-left">
        <thead className="bg-[#333] text-white">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Project</th>
            <th className="p-2">Task Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">
              {currentUser.role === "admin" ? "Assigned Student" : "Created By"}
            </th>
            <th className="p-2">Status</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((t, idx) => (
            <tr key={t._id} className="border-b border-[#444]">
              <td className="p-2">{idx + 1}</td>
              <td className="p-2">{t.projecttitle}</td>
              <td className="p-2">{t.taskname}</td>
              <td className="p-2">{t.description}</td>
              <td className="p-2">
                {currentUser.role === "admin"
                  ? t.assignedTo?.UserName || "-"
                  : t.createdBy?.id !== t.assignedTo?.id
                  ? t.createdBy?.UserName
                  : "Me"}
              </td>
              <td className={`p-2 ${statusColor[t.status] || ""}`}>
                {t.status}
              </td>
              <td className="p-2">{t.dueDate}</td>

              <td className="flex gap-2 p-2">
                <button
                  onClick={() => onEdit(t._id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>

                {(currentUser.role === "admin" ||
                  currentUser.role === "teacher" ||
                  (currentUser.role === "student" &&
                    t.createdBy?.id === currentUser.id)) && (
                  <button
                    onClick={() => onDelete(t._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
