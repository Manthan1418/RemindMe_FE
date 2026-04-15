import dayjs from "dayjs";

function ReminderCard({ reminder, onComplete, onDelete }) {
  const dateLabel = dayjs(reminder.datetime).format("DD MMM YYYY, hh:mm A");

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-slate-100">{reminder.title}</h3>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{reminder.type}</span>
      </div>
      {reminder.description ? <p className="mt-2 text-sm text-slate-300">{reminder.description}</p> : null}
      <p className="mt-3 text-sm text-teal-300">{dateLabel}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onComplete(reminder.id)}
          className="rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300"
        >
          Mark Done
        </button>
        <button
          onClick={() => onDelete(reminder.id)}
          className="rounded-lg bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-300"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function ReminderList({ title, reminders, onComplete, onDelete }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
      {reminders.length === 0 ? (
        <p className="text-sm text-slate-400">No reminders in this section.</p>
      ) : (
        <div className="grid gap-3">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ReminderList;
