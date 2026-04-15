import { useEffect, useRef } from "react";

function useLoopingAlarm(isActive) {
  const contextRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (contextRef.current) {
        contextRef.current.close();
      }
      contextRef.current = null;
      intervalRef.current = null;
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return;
    }

    contextRef.current = new AudioCtx();

    const beep = () => {
      if (!contextRef.current) {
        return;
      }

      const oscillator = contextRef.current.createOscillator();
      const gain = contextRef.current.createGain();
      oscillator.frequency.value = 880;
      oscillator.type = "square";
      gain.gain.value = 0.05;
      oscillator.connect(gain);
      gain.connect(contextRef.current.destination);
      oscillator.start();
      oscillator.stop(contextRef.current.currentTime + 0.25);
    };

    beep();
    intervalRef.current = setInterval(beep, 800);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (contextRef.current) {
        contextRef.current.close();
      }
      contextRef.current = null;
      intervalRef.current = null;
    };
  }, [isActive]);
}

function AlarmModal({ reminder, onDismiss, onSnooze }) {
  useLoopingAlarm(Boolean(reminder));

  if (!reminder) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-rose-500/40 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl shadow-rose-800/30">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-300">Alarm Triggered</p>
        <h2 className="mt-3 text-4xl font-black text-white">{reminder.title}</h2>
        {reminder.description ? <p className="mt-3 text-slate-300">{reminder.description}</p> : null}

        <div className="mt-8">
          <p className="text-sm text-slate-400">Snooze</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[5, 10, 30].map((minutes) => (
              <button
                key={minutes}
                onClick={() => onSnooze(minutes)}
                className="rounded-xl border border-teal-400/40 bg-teal-500/20 px-4 py-3 font-semibold text-teal-200 transition hover:bg-teal-500/30"
              >
                {minutes} min
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="mt-6 w-full rounded-xl bg-rose-500 px-6 py-4 text-lg font-bold text-rose-950 transition hover:bg-rose-400"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default AlarmModal;
