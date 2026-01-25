import "./WeekPanel.css";
import {
  toISODateLocal,
  fromISODateLocal,
  startOfISOWeek,
  getISOWeekNumber,
  dateToday,
} from "../../utils/date";

function formatFiLong(date) {
  const weekday = new Intl.DateTimeFormat("fi-FI", { weekday: "long" }).format(
    date,
  );
  const dayMonthYear = new Intl.DateTimeFormat("fi-FI", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
  return `${weekday} ${dayMonthYear}`;
}

const labels = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];

export default function WeekPanel({
  selectedDate,
  onSelectDate,
  workouts = [],
}) {
  const today = dateToday();
  const selectedISO = selectedDate || today;
  const selected = fromISODateLocal(selectedISO);
  const weekStart = startOfISOWeek(selected);
  const weekNumber = getISOWeekNumber(selected);

  const workoutDates = new Set(workouts.map((w) => w.date));

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const iso = toISODateLocal(d);

    return {
      key: iso,
      label: labels[i],
      date: iso,
      hasWorkout: workoutDates.has(iso),
    };
  });

  const goPrevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    onSelectDate(toISODateLocal(d));
  };

  const goNextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    onSelectDate(toISODateLocal(d));
  };

  return (
    <section className="weekpanel">
      <div className="weekpanel__today">
        Tänään on <span>{formatFiLong(new Date())}</span>
      </div>

      <div className="weekpanel__week">vko {weekNumber}</div>

      <div className="weekpanel__row">
        <button
          type="button"
          className="weekswitch weekswitch__prev"
          onClick={goPrevWeek}
          aria-label="Edellinen viikko"
        />

        <div className="weekpanel__weekdays">
          {weekDays.map((day) => {
            const isSelected = day.date === selectedISO;
            const isToday = day.date === today;

            return (
              <button
                type="button"
                key={day.key}
                className={
                  "weekpanel__day" +
                  (isSelected ? " weekpanel__day__active" : "") +
                  (isToday ? " weekpanel__day__today" : "")
                }
                onClick={() => onSelectDate(day.date)}
                aria-current={isSelected ? "date" : undefined}
              >
                <span
                  className={
                    "weekpanel__mark " +
                    (day.hasWorkout
                      ? "weekpanel__mark__yes"
                      : "weekpanel__mark__no")
                  }
                />
                <span className="weekpanel__label">{day.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="weekswitch weekswitch__next"
          onClick={goNextWeek}
          aria-label="Seuraava viikko"
        />
      </div>
    </section>
  );
}
