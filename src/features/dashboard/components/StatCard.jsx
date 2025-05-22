export default function StatCard({ title, value, bg = "#2a2a2a" }) {
  return (
    <div
      className="flex h-[110px] w-[210px] flex-col items-center justify-center rounded p-[25px] text-center shadow-md"
      style={{ background: bg }}
    >
      <h3 className="text-[18px] text-[#ddd]">{title}</h3>
      <p className="text-[#eee] text-xl font-semibold">{value}</p>
    </div>
  );
}
