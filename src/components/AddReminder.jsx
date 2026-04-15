import { useState } from "react";

const INITIAL_STATE = {
  title: "",
  description: "",
  datetime: "",
  type: "ONE_TIME",
  repeat: "NONE",
  alertOffsets: "4320,1440,0",
};

function AddReminder({ onCreate }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        datetime: new Date(formData.datetime).toISOString(),
        alertOffsets: formData.alertOffsets
          .split(",")
          .map((value) => Number(value.trim()))
          .filter((value) => Number.isFinite(value) && value >= 0),
      };

      await onCreate(payload);
      setFormData(INITIAL_STATE);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <h2 className="text-lg font-semibold text-white">Create Reminder</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          required
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="Title"
          className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none focus:border-teal-500"
        />

        <input
          name="datetime"
          required
          type="datetime-local"
          value={formData.datetime}
          onChange={onChange}
          className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none focus:border-teal-500"
        />
      </div>

      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
        placeholder="Description (optional)"
        className="min-h-20 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none focus:border-teal-500"
      />

      <div className="grid gap-3 md:grid-cols-3">
        <select
          name="type"
          value={formData.type}
          onChange={onChange}
          className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none focus:border-teal-500"
        >
          <option value="ONE_TIME">One-time</option>
          <option value="RECURRING">Recurring</option>
          <option value="UNTIL_DONE">Until done</option>
        </select>

        <select
          name="repeat"
          value={formData.repeat}
          onChange={onChange}
          className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none focus:border-teal-500"
        >
          <option value="NONE">No repeat</option>
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>

        <input
          name="alertOffsets"
          value={formData.alertOffsets}
          onChange={onChange}
          placeholder="Alert offsets in minutes"
          className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none focus:border-teal-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-teal-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-teal-400 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Add Reminder"}
      </button>
    </form>
  );
}

export default AddReminder;
