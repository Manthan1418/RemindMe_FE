import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

export function subscribeReminderTriggered(callback) {
  const handler = (payload) => {
    callback(payload);

    if (document.hidden && "Notification" in window && Notification.permission === "granted") {
      new Notification("Reminder Alert", {
        body: payload.title,
      });
    }
  };

  socket.on("reminder:trigger", handler);
  return () => socket.off("reminder:trigger", handler);
}

export function ensureNotificationPermission() {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

export default socket;
