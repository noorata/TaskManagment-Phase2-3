import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import useSocket from "@/app/hooks/useSocket";

import ChatSidebar from "../components/ChatSidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

const SOCKET_URL = "http://localhost:5050";
const norm = (s = "") => s.trim().toLowerCase();

const keyPair = (a, b) => `chat_${[norm(a), norm(b)].sort().join("_")}`;
const keyBroadcast = "chat_broadcast";

const save = (me, other, msg) => {
  const k = other === "Broadcast All" ? keyBroadcast : keyPair(me, other);
  const arr = JSON.parse(localStorage.getItem(k)) || [];
  if (!arr.some((m) => m.ts === msg.ts && m.from === msg.from)) {
    arr.push(msg);
    localStorage.setItem(k, JSON.stringify(arr));
  }
};
const load = (me, other) => {
  const k = other === "Broadcast All" ? keyBroadcast : keyPair(me, other);
  return JSON.parse(localStorage.getItem(k)) || [];
};

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString("EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ChatPage() {
  const { user } = useAuth();
  const meNorm = norm(user.UserName);
  const isAdmin = norm(user.role) !== "student";

  const sockRef = useSocket(SOCKET_URL, (s) =>
    s.emit("auth", {
      username: user.UserName,
      role: isAdmin ? "admin" : "student",
    }),
  );

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [target, setTarget] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      setLoadingUsers(true);
      const query = isAdmin
        ? `{ students { UserName } }`
        : `{ admins { UserName } }`;

      try {
        const res = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = (await res.json()).data;
        const arr = isAdmin
          ? ["Broadcast All", ...data.students.map((u) => u.UserName.trim())]
          : data.admins.map((u) => u.UserName.trim());

        setUsers(arr);
        setTarget(arr[0] || "");
        setMsgs(load(user.UserName, arr[0] || ""));
      } catch (e) {
        console.error("Fetch users failed:", e);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, [isAdmin, user.UserName]);

  useEffect(() => {
    setMsgs(load(user.UserName, target));
  }, [target, user.UserName]);

  useEffect(() => {
    const sock = sockRef.current;
    if (!sock || !sock.connected) return;

    const onMsg = ({ to, from, text, ts }) => {
      if (norm(from) === meNorm) return; 

      const nTo = norm(to);
      const visible =
        nTo === "all" ||
        nTo === meNorm ||
        (isAdmin && nTo === "admins");

      if (!visible) return;

      const other =
        nTo === "all"
          ? "Broadcast All"
          : nTo === "admins"
          ? from
          : norm(from) === meNorm
          ? to
          : from;

      const msg = { ts, from, to, text };
      save(user.UserName, other, msg);

      if (
        other === target ||
        (target === "Broadcast All" && to === "all")
      ) {
        setMsgs((p) => [...p, msg]);
      }
    };

    sock.on("chat:message", onMsg);
    return () => sock.off("chat:message", onMsg);
  }, [sockRef, meNorm, isAdmin, target, user.UserName]);

  const send = () => {
    if (!text.trim() || !sockRef.current?.connected) return;

    const ts = Date.now();
    if (isAdmin && target === "Broadcast All") {
      users
        .filter((n) => n !== "Broadcast All")
        .forEach((student) => {
          const payload = {
            ts,
            to: student,
            from: user.UserName,
            text: text.trim(),
          };
          sockRef.current.emit("chat:message", payload);
          save(user.UserName, student, payload);
        });

      setMsgs((prev) => [
        ...prev,
        { ts, to: "all", from: user.UserName, text: text.trim() },
      ]);
    } else {
      const payload = {
        ts,
        to: target.trim(),
        from: user.UserName,
        text: text.trim(),
      };
      sockRef.current.emit("chat:message", payload);
      save(user.UserName, target, payload);
      setMsgs((prev) => [...prev, payload]);
    }

    setText("");
  };

  return (
    <section className="flex h-full bg-neutral-900 text-neutral-200">
      <ChatSidebar
        users={users}
        current={target}
        onSelect={setTarget}
        isLoading={loadingUsers}
        isAdmin={isAdmin}
      />

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-4 text-lg font-medium text-white">
          {isAdmin ? `Chatting with ${target}` : "Chatting with Admins"}
        </h3>

        <MessageList
          messages={msgs}
          meNorm={meNorm}
          formatTime={formatTime}
        />

        <MessageInput value={text} onChange={setText} onSend={send} />
      </div>
    </section>
  );
}
