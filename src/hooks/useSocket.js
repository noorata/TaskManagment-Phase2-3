import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

/**
 * هوك يحافظ على اتصال Socket.IO مستقرّ طوال عمر الكومبوننت.
 * - url        : عنوان الخادم
 * - onConnect  : دالة تُستدعى مرّة واحدة بعد الاتصال (اختياري)
 *
 * ملاحظة مهمّة: لا نضع onConnect في مصفوفة التبعيات
 *               حتى لا يُعاد إنشاء السوكِت عند كلّ إعادة رسم.
 */
export default function useSocket(url, onConnect) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(url, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
      onConnect?.(socket);            // تعريف المستخدم أو غيره
    });

    return () => socket.disconnect();
  }, [url]);                          // ⚠️ url فقط، بدون onConnect

  return socketRef;
}
