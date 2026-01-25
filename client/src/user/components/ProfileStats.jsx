import Card from "../../layout/elements/Card";
import { fromISODateLocal, startOfISOWeek, dateToday } from "../../utils/date";

import "./ProfileStats.css";

const sumDuration = (arr) =>
  arr.reduce((acc, w) => acc + (Number(w.duration) || 0), 0);

const ProfileStats = ({ workouts = [] }) => {
  const todayISO = dateToday();
  const today = fromISODateLocal(todayISO);

  const weekStart = startOfISOWeek(today);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const isSameOrAfter = (d, start) => d.getTime() >= start.getTime();

  const week = workouts.filter((w) =>
    isSameOrAfter(fromISODateLocal(w.date), weekStart),
  );
  const month = workouts.filter((w) =>
    isSameOrAfter(fromISODateLocal(w.date), monthStart),
  );
  const all = workouts;

  const Row = ({ title, list }) => (
    <div className="stats__row">
      <div className="stats__title">{title}</div>
      <div className="stats__values">
        <span>Kerrat: {list.length}</span>
        <span>Yhteisaika: {sumDuration(list)} min</span>
      </div>
    </div>
  );

  return (
    <Card title="Tilastot">
      <Row title="Tämä viikko" list={week} />
      <hr />
      <Row title="Tämä kuukausi" list={month} />
      <hr />
      <Row title="Kaikki" list={all} />
    </Card>
  );
};

export default ProfileStats;
