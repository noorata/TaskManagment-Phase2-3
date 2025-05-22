export default function MessageInput({ value, onChange, onSend }) {
  return (
    <div className="mt-3 flex gap-3">
      <input
        className="flex-1 rounded-md bg-neutral-700 px-4 py-2 outline-none placeholder:text-neutral-400"
        placeholder="Type your message…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button
        onClick={onSend}
        className="rounded-md bg-emerald-600 px-6 py-2 font-semibold text-white hover:bg-emerald-700"
      >
        Send
      </button>
    </div>
  );
}
