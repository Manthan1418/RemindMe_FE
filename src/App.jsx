import { useCallback, useEffect, useMemo, useState } from "react";
import AlarmModal from "./components/AlarmModal";
import Dashboard from "./pages/Dashboard";
import { createReminder, deleteReminder, getReminders, patchReminder } from "./services/api";
import { ensureNotificationPermission, subscribeReminderTriggered } from "./services/socket";

function App() {
  const [reminders, setReminders] = useState([]);
  const [activeReminder, setActiveReminder] = useState(null);

  const fetchReminders = useCallback(async () => {
    const data = await getReminders();
    setReminders(data);
  }, []);

  useEffect(() => {
    ensureNotificationPermission();
    fetchReminders();

    const unsubscribe = subscribeReminderTriggered((payload) => {
      setActiveReminder(payload);
      fetchReminders();
    });

    return () => unsubscribe();
  }, [fetchReminders]);

  const onCreate = useCallback(
    async (payload) => {
      await createReminder(payload);
      await fetchReminders();
    },
    [fetchReminders]
  );

  const onComplete = useCallback(
    async (id) => {
      await patchReminder(id, { status: "COMPLETED" });
      await fetchReminders();
    },
    [fetchReminders]
  );

  const onDelete = useCallback(
    async (id) => {
      await deleteReminder(id);
      await fetchReminders();
    },
    [fetchReminders]
  );

  const onDismissAlarm = useCallback(async () => {
    if (!activeReminder) {
      return;
    }

    await patchReminder(activeReminder.id, { action: "dismiss" });
    setActiveReminder(null);
    await fetchReminders();
  }, [activeReminder, fetchReminders]);

  const onSnoozeAlarm = useCallback(
    async (minutes) => {
      if (!activeReminder) {
        return;
      }

      await patchReminder(activeReminder.id, {
        action: "snooze",
        minutes,
      });

      setActiveReminder(null);
      await fetchReminders();
    },
    [activeReminder, fetchReminders]
  );

  const appClassName = useMemo(
    () =>
      activeReminder
        ? "min-h-screen bg-slate-950 text-slate-100 blur-[2px] pointer-events-none"
        : "min-h-screen bg-slate-950 text-slate-100",
    [activeReminder]
  );

  return (
    <>
      <div className={appClassName}>
        <Dashboard reminders={reminders} onCreate={onCreate} onComplete={onComplete} onDelete={onDelete} />
      </div>
      <AlarmModal reminder={activeReminder} onDismiss={onDismissAlarm} onSnooze={onSnoozeAlarm} />
    </>
  );
}

export default App;
