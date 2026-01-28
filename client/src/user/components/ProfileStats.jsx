import { useMemo, useState } from "react";
import Card from "../../layout/elements/Card";
import { fromISODateLocal, startOfISOWeek, dateToday } from "../../utils/date";
import "./ProfileStats.css";

const toTypeName = (type) =>
  typeof type === "string" ? type : type?.name || "Tuntematon laji";

const sumDuration = (arr) =>
  arr.reduce((acc, w) => acc + (Number(w.duration) || 0), 0);

const fmtMinutes = (total) => {
  const m = Number(total) || 0;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h <= 0) return `${mm} min`;
  if (mm === 0) return `${h} h`;
  return `${h} h ${mm} min`;
};

const topType = (arr) => {
  if (!arr.length) return "-";
  const counts = new Map();
  for (const w of arr) {
    const name = toTypeName(w.type);
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  let best = null;
  for (const [name, count] of counts.entries()) {
    if (!best || count > best.count) best = { name, count };
  }
  return best ? `${best.name} (${best.count})` : "-";
};

const ProfileStats = ({ workouts = [] }) => {
  const [tab, setTab] = useState("week"); // week | month | all

  const { week, month, all } = useMemo(() => {
    const today = fromISODateLocal(dateToday());
    const weekStart = startOfISOWeek(today);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const isSameOrAfter = (d, start) => d.getTime() >= start.getTime();

    const weekList = workouts.filter((w) =>
      isSameOrAfter(fromISODateLocal(w.date), weekStart),
    );
    const monthList = workouts.filter((w) =>
      isSameOrAfter(fromISODateLocal(w.date), monthStart),
    );

    return { week: weekList, month: monthList, all: workouts };
  }, [workouts]);

  const activeList = tab === "week" ? week : tab === "month" ? month : all;

  const count = activeList.length;
  const totalMin = sumDuration(activeList);
  const avgMin = count ? Math.round(totalMin / count) : 0;
  const fav = topType(activeList);

  return (
    <Card title="Tilastot">
      <div className="statsTabs">
        <button
          type="button"
          className={`statsTabs__tab ${tab === "week" ? "is-active" : ""}`}
          onClick={() => setTab("week")}
        >
          Tämä viikko
        </button>
        <button
          type="button"
          className={`statsTabs__tab ${tab === "month" ? "is-active" : ""}`}
          onClick={() => setTab("month")}
        >
          Tämä kuukausi
        </button>
        <button
          type="button"
          className={`statsTabs__tab ${tab === "all" ? "is-active" : ""}`}
          onClick={() => setTab("all")}
        >
          Kaikki
        </button>
      </div>

      <div className="statsCards">
        <div className="statsBox">
          <div className="statsLabel">Kerrat</div>
          <div className="statsValue">{count}</div>
        </div>

        <div className="statsBox">
          <div className="statsLabel">Yhteisaika</div>
          <div className="statsValue">{fmtMinutes(totalMin)}</div>
        </div>

        <div className="statsBox">
          <div className="statsLabel">Keskiarvo</div>
          <div className="statsValue">{fmtMinutes(avgMin)}</div>
        </div>

        <div className="statsBox statsBox--wide">
          <div className="statsLabel">Suosituin laji</div>
          <div className="statsValue">{fav}</div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileStats;
