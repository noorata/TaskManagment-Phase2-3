export default function ChatSidebar({
  users,
  current,
  onSelect,
  isLoading,
  isAdmin,
}) {
  return (
    <aside className="w-64 border-r border-neutral-700 p-5">
      <h2 className="mb-4 text-lg font-semibold">
        {isAdmin ? "Students" : "Admins"}
      </h2>

      {isLoading ? (
        <p className="animate-pulse text-sm text-neutral-400">Loading…</p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u}
              onClick={() => onSelect(u)}
              className={`cursor-pointer rounded-md px-4 py-2 ${
                u === current
                  ? "bg-emerald-700"
                  : "bg-neutral-800 hover:bg-neutral-700"
              }`}
            >
              {u}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
