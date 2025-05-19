import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";

const SOCKET_URL = "http://localhost:5050";
const norm = (s = "") => s.trim().toLowerCase();

/* مفاتيح التخزين */
const keyPair      = (a, b) => `chat_${[norm(a), norm(b)].sort().join("_")}`;
const keyBroadcast = "chat_broadcast";

/* حفظ / تحميل */
const save = (me, other, msg) => {
  const k = other === "Broadcast All" ? keyBroadcast : keyPair(me, other);
  const arr = JSON.parse(localStorage.getItem(k)) || [];
  if (!arr.some((m) => m.ts === msg.ts && m.from === msg.from)) {
    arr.push(msg);                // أضف إذا لم يكن موجودًا
    localStorage.setItem(k, JSON.stringify(arr));
  }
};
const load = (me, other) => {
  const k = other === "Broadcast All" ? keyBroadcast : keyPair(me, other);
  return JSON.parse(localStorage.getItem(k)) || [];
};

export default function ChatPage() {
  /* بياناتي */
  const { user } = useAuth();
  const meNorm   = norm(user.username);
  const isAdmin  = norm(user.role) !== "student";

  /* اتصال Socket */
  const sockRef = useSocket(SOCKET_URL, (s) =>
    s.emit("auth", { username: user.username, role: isAdmin ? "admin" : "student" })
  );

  /* قائمة الأسماء */
  const users   = JSON.parse(localStorage.getItem("users")) || [];
  const admins  = users.filter((u) => norm(u.role) !== "student").map((u) => u.username.trim());
  const students= users.filter((u) => norm(u.role) === "student").map((u) => u.username.trim());
  const side    = isAdmin ? ["Broadcast All", ...students] : admins;

  /* الحالة */
  const [target, setTarget] = useState(side[0] || "");
  const [msgs, setMsgs]     = useState(() => load(user.username, side[0] || ""));
  const [text, setText]     = useState("");
  const bottom = useRef(null);

  /* تمرير للأسفل */
  useEffect(() => bottom.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  /* تغيير المحادثة ⇒ حمّل السجلّ */
  useEffect(() => setMsgs(load(user.username, target)), [target, user.username]);

  /* استقبال */
  useEffect(() => {
    const sock = sockRef.current;
    if (!sock) return;

      const onMsg = ({ to, from, text, ts }) => {
     if (norm(from) === meNorm) return;
      const nTo = norm(to);

      /* هل تظهر لى؟ */
      const visible =
        nTo === "all" ||
        nTo === meNorm ||
        (isAdmin && nTo === "admins");

      if (!visible) return;

      /* حدّد الطرف الآخر */
      const other =
        nTo === "all"
          ? "Broadcast All"
          : nTo === "admins"
          ? from
          : norm(from) === meNorm
          ? to
          : from;

      const msg = { ts, from, to, text };
      if (msgs.some((m) => m.ts === ts && m.from === from)) return;
      save(user.username, other, msg);

      if (
        other === target ||
        (target === "Broadcast All" && to === "all")
      ) {
        setMsgs((p) => [...p, msg]);
      }
    };

    sock.on("chat:message", onMsg);
    return () => sock.off("chat:message", onMsg);
  }, [sockRef, meNorm, isAdmin, target, user.username]);

  /* إرسال */
  const send = () => {
  if (!text.trim() || !sockRef.current?.connected) return;

  const dest = isAdmin
    ? target === "Broadcast All"
      ? "all"
      : target.trim()
    : target.trim();

  const ts = Date.now();                            // طابع زمني واحد
  const payload = { ts, to: dest, from: user.username, text: text.trim() };
  sockRef.current.emit("chat:message", payload);


  save(user.username, target, payload);             // خزّن مرة
  setMsgs((prev) => [...prev, payload]);            // أضف مباشرةً

  setText("");
};


  /* واجهة المستخدم */
  return (
    <section className="flex h-full bg-neutral-900 text-neutral-200">
      {/* الشريط الجانبي */}
      <aside className="w-64 border-r border-neutral-700 p-5">
        <h2 className="mb-4 text-lg font-semibold">{isAdmin ? "Students" : "Admins"}</h2>
        <ul className="space-y-2">
          {side.map((n) => (
            <li
              key={n}
              onClick={() => setTarget(n)}
              className={`cursor-pointer rounded-md px-4 py-2 ${
                n === target ? "bg-emerald-700" : "bg-neutral-800 hover:bg-neutral-700"
              }`}
            >
              {n}
            </li>
          ))}
        </ul>
      </aside>

      {/* مساحة الدردشة */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-4 text-lg font-medium text-white">
          {isAdmin ? `Chatting with ${target}` : "Chatting with Admins"}
        </h3>

        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {msgs.map((m) => {
            const mine = norm(m.from) === meNorm;
            return (
              <div
                key={m.ts}
                className={`max-w-[70%] rounded-md px-4 py-2 text-sm ${
                  mine
                    ? "ml-auto bg-emerald-600 text-white"
                    : "bg-neutral-700 text-neutral-100"
                }`}
              >
                {!mine && <span className="mr-1 font-semibold text-cyan-300">{m.from}:</span>}
                {m.text}
              </div>
            );
          })}
          <div ref={bottom} />
        </div>

        <div className="mt-3 flex gap-3">
          <input
            className="flex-1 rounded-md bg-neutral-700 px-4 py-2 outline-none placeholder:text-neutral-400"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            className="rounded-md bg-emerald-600 px-6 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
