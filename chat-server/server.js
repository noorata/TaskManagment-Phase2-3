// server.js – شغِّله بـ  node server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket"],
});

/* خرائط الذاكرة */
const clients = new Map();   // username  (norm) → socket
const pending = new Map();   // username  (norm) → [msgs]

/* أداة معيارية للاسم */
const norm = (str = "") => str.trim().toLowerCase();

io.on("connection", (socket) => {
  console.log("⚡️ connected:", socket.id);

  /* =============== 1) المصادقة =============== */
  socket.on("auth", ({ username, role }) => {
    const nUser = norm(username);
    socket.username = username;
    socket.normName = nUser;
    socket.role     = role === "admin" ? "admin" : "student";

    clients.set(nUser, socket);
    console.log(`✅ ${username} authenticated as ${socket.role}`);

    /* رسائل معلّقة */
    if (pending.has(nUser)) {
      const list = pending.get(nUser);
      console.log(`▶️ delivering ${list.length} msg(s) to ${username}`);
      list.forEach((msg) => socket.emit("chat:message", msg));
      pending.delete(nUser);
    }
  });

  /* =============== 2) استقبال الرسائل =============== */
  socket.on("chat:message", (payload) => {
    const { to, from } = payload;
    const nTo   = norm(to);
    const nFrom = norm(from);

    console.log("📨", payload);

    /* أ. بث للجميع */
    if (nTo === "all") {
      io.emit("chat:message", payload);
      return;
    }

    /* ب. إلى كل الإداريين */
    if (nTo === "admins") {
      io.sockets.sockets.forEach((s) => {
        if (s.role === "admin") s.emit("chat:message", payload);
      });
      socket.emit("chat:message", payload); // نسخة للمرسل
      return;
    }

    /* ج. رسالة خاصّة */
    const target = clients.get(nTo);
    if (target) {
      target.emit("chat:message", payload);
      socket.emit("chat:message", payload);
    } else {
      /* المستقبل غير متّصل → نحفظها */
      if (!pending.has(nTo)) pending.set(nTo, []);
      pending.get(nTo).push(payload);
      console.log(`💾 saved to pending for ${to} (${pending.get(nTo).length})`);
      socket.emit("chat:message", payload); 
    }
  });
socket.on("chat:received", ({ ts, from, to }) => {
  const nSender = norm(to);   // المُرسل الأصلي هو 'to' لأن المستقبل أرسل الـ ack
  const target = clients.get(nSender);
  if (target) {
    target.emit("chat:delivered", { ts });
    console.log(`📬 delivered ack sent to ${to} for ts: ${ts}`);
  }
});

socket.on("chat:read", ({ ts, from, to }) => {
  const nSender = norm(to);   // نفس التفسير هنا
  const target = clients.get(nSender);
  if (target) {
    target.emit("chat:read", { ts });
    console.log(`📖 read ack sent to ${to} for ts: ${ts}`);
  }
});


  socket.on("disconnect", () => {
    clients.delete(socket.normName);
    console.log("🚪 disconnected:", socket.id);
  });
});

const PORT = 5050;
server.listen(PORT, () =>
  console.log(`🚀 WebSocket running on http://localhost:${PORT}`)
);
