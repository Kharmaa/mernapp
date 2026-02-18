import { Link } from "react-router-dom";

import Button from "../../layout/formelements/Button";
import Card from "../../layout/elements/Card";
import { formatDateFI } from "../../utils/date";

import "./RecentWorkouts.css";

// Näyttää 4 viimeisintä treeniä
// Järjestetään treenit uusimmasta vanhimpaan
export default function RecentWorkouts({ workouts = [], onSelectWorkout }) {
  const recent = workouts
    .slice()
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 4);

  if (workouts.length === 0) {
    return (
      <Card title="Viimeisimmät harjoitukset">
        <p className="recent__empty">Yhtään harjoitusta ei vielä löytynyt.</p>
      </Card>
    );
  }

  // Muuntaa treenityypin näytettävään muotoon
  const typeLabel = (type) =>
    typeof type === "string" ? type : type?.name || "Tuntematon laji";

  // Muotoilee päivämäärän
  const dateLabel = (date) => {
    try {
      return formatDateFI(date);
    } catch {
      return String(date || "");
    }
  };

  return (
    <Card title="Viimeisimmät harjoitukset">
      <ul className="recent__list">
        {recent.map((w) => (
          <li key={w.id} className="recent__li">
            <button
              type="button"
              className="recent__item"
              onClick={() => onSelectWorkout?.(w)}
            >
              <div className="recent__left">
                <span className="recent__date">{dateLabel(w.date)}</span>
                <span className="recent__type">{typeLabel(w.type)}</span>
              </div>

              {w.duration != null && (
                <div className="recent__right">
                  <span className="recent__duration">{w.duration} min</span>
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>

      <hr />
      {/* Linkki koko treenilistaan */}
      <div className="workoutdet__actions">
        <Button size="sm" variant="gradient" as={Link} to="/workouts">
          Näytä lisää
        </Button>
      </div>
    </Card>
  );
}
