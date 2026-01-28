import { useMemo, useState } from "react";
import "./WorkoutHeatmap.css";

// workouts: [{ date: "YYYY-MM-DD", ... }]
export default function WorkoutHeatmap({ workouts = [], onSelectDate }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const toISO = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const dd = String(x.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const monthLabel = cursor.toLocaleString("fi-FI", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    return new Date(y, m + 1, 0).getDate();
  }, [cursor]);

  // ma=0 ... su=6
  const firstWeekdayIndex = useMemo(() => {
    const d = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const js = d.getDay(); // 0=su..6=la
    return (js + 6) % 7;
  }, [cursor]);

  // Merkittyjen päivien setti (YYYY-MM-DD)
  const marked = useMemo(() => {
    const set = new Set();
    for (const w of workouts) {
      const iso =
        typeof w.date === "string" ? w.date.slice(0, 10) : toISO(w.date);
      set.add(iso);
    }
    return set;
  }, [workouts]);

  // Ruudukko: 7 saraketta (ma-su), 5-6 riviä
  const cells = useMemo(() => {
    const arr = [];
    const total = firstWeekdayIndex + daysInMonth;
    const rows = Math.ceil(total / 7);
    const cellCount = rows * 7;

    for (let i = 0; i < cellCount; i++) {
      const dayNum = i - firstWeekdayIndex + 1; // 1..daysInMonth
      if (dayNum < 1 || dayNum > daysInMonth) {
        arr.push({ kind: "empty" });
      } else {
        const d = new Date(cursor.getFullYear(), cursor.getMonth(), dayNum);
        const iso = toISO(d);
        arr.push({
          kind: "day",
          day: dayNum,
          iso,
          active: marked.has(iso),
        });
      }
    }
    return arr;
  }, [cursor, daysInMonth, firstWeekdayIndex, marked]);

  const prevMonth = () => {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const weekDays = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];

  return (
    <div className="mh">
      <div className="mh__header">
        <div>
          <div className="mh__subtitle">{monthLabel}</div>
        </div>

        <div className="mh__actions">
          <button type="button" className="mh__btn" onClick={prevMonth}>
            ←
          </button>
          <button type="button" className="mh__btn" onClick={nextMonth}>
            →
          </button>
        </div>
      </div>

      <div className="mh__weekdays">
        {weekDays.map((d) => (
          <div key={d} className="mh__weekday">
            {d}
          </div>
        ))}
      </div>

      <div className="mh__grid">
        {cells.map((c, idx) => {
          if (c.kind === "empty") {
            return <div key={idx} className="mh__cell mh__cell--empty" />;
          }

          return (
            <button
              key={c.iso}
              type="button"
              className={`mh__cell ${c.active ? "mh__cell--active" : ""}`}
              title={c.iso}
              onClick={() => onSelectDate?.(c.iso)}
            >
              <span className="mh__day">{c.day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
