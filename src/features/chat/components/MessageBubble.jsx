const borderByMine = (mine) =>
  mine
    ? "ml-auto bg-emerald-600 text-white"
    : "bg-neutral-700 text-neutral-100";

export default function MessageBubble({ msg, mine, formatTime }) {
  return (
    <div
      className={`relative max-w-[60%] rounded-md px-2 py-2 text-sm ${borderByMine(
        mine,
      )}`}
    >
      {!mine && (
        <span className="mr-1 font-semibold text-cyan-300">{msg.from}:</span>
      )}

      <div>{msg.text}</div>

      <div className="mt-1 flex items-center justify-end text-xs text-neutral-300">
        <span>{formatTime(msg.ts)}</span>
      </div>
    </div>
  );
}
