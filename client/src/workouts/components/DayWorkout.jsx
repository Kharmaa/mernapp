import { Link } from "react-router-dom";

import Button from "../../layout/formelements/Button";
import Card from "../../layout/elements/Card";

import "./DayWorkout.css";

// Näyttää valitun päivän treenit listana
const DayWorkout = ({
  workouts = [],
  onSelectWorkout,
  selectedWorkout,
  dayTitle,
}) => {
  const hasWorkouts = workouts.length > 0;

  // Muuntaa treenityypin aina näytettäväksi nimeksi
  const typeLabel = (type) =>
    typeof type === "string" ? type : type?.name || "Tuntematon laji";

  return (
    <Card title="Päivän harjoitukset" rightTitle={dayTitle}>
      {!hasWorkouts && (
        <div className="day__emptywrap">
          <p className="day__empty">Ei kirjattuja treenejä tälle päivälle.</p>
        </div>
      )}

      {/* Jos treenejä löytyy */}
      {hasWorkouts && (
        <ul className="day__list">
          {workouts.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                className={`day__item ${
                  selectedWorkout?.id === w.id ? "day__item--active" : ""
                }`}
                onClick={() => onSelectWorkout?.(w)} // Valitaan treeni
              >
                <span className="day__type">{typeLabel(w.type)}</span>
                {/* Näytetään kesto jos olemassa */}
                {w.duration != null && (
                  <span className="day__duration">{w.duration} min</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      <hr />
      {/* Uuden treenin lisäys */}
      <div className="action_btns">
        <Button as={Link} to="/workouts/new" variant="gradient" size="sm">
          Lisää uusi
        </Button>
      </div>
    </Card>
  );
};

export default DayWorkout;
