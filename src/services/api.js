import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
});

export async function getReminders() {
  const response = await api.get("/reminders");
  return response.data;
}

export async function createReminder(payload) {
  const response = await api.post("/reminders", payload);
  return response.data;
}

export async function patchReminder(id, payload) {
  const response = await api.patch(`/reminders/${id}`, payload);
  return response.data;
}

export async function deleteReminder(id) {
  await api.delete(`/reminders/${id}`);
}

export default api;
