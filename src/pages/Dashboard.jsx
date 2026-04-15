import dayjs from "dayjs";
import AddReminder from "../components/AddReminder";
import ReminderList from "../components/ReminderList";

function splitReminderSections(reminders) {
  const now = dayjs();

  return reminders.reduce(
    (acc, reminder) => {
      if (reminder.status === "COMPLETED") {
        acc.completed.push(reminder);
      } else if (reminder.status === "SNOOZED") {
        acc.snoozed.push(reminder);
      } else if (dayjs(reminder.datetime).isBefore(now) && reminder.status === "PENDING") {
        acc.missed.push(reminder);
      } else {
        acc.pending.push(reminder);
      }

      return acc;
    },
    {
      pending: [],
      completed: [],
      missed: [],
      snoozed: [],
    }
  );
}

function Dashboard({ reminders, onCreate, onComplete, onDelete }) {
  const sections = splitReminderSections(reminders);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-teal-300">RemindMe Pro</p>
        <h1 className="text-3xl font-black text-white md:text-5xl">Smart Reminder Dashboard</h1>
        <p className="max-w-2xl text-slate-300">
          Reliable reminders powered by BullMQ scheduling, Redis events, and real-time socket alarms.
        </p>
      </header>

      <AddReminder onCreate={onCreate} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ReminderList
          title="Pending"
          reminders={sections.pending}
          onComplete={onComplete}
          onDelete={onDelete}
        />
        <ReminderList
          title="Snoozed"
          reminders={sections.snoozed}
          onComplete={onComplete}
          onDelete={onDelete}
        />
        <ReminderList
          title="Completed"
          reminders={sections.completed}
          onComplete={onComplete}
          onDelete={onDelete}
        />
        <ReminderList
          title="Missed"
          reminders={sections.missed}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      </div>
    </main>
  );
}

export default Dashboard;
