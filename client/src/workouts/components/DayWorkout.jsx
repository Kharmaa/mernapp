import { Link } from "react-router-dom";

import Button from "../../layout/formelements/Button";
import Card from "../../layout/elements/Card";

import "./DayWorkout.css";

const DayWorkout = ({
  workouts = [],
  onSelectWorkout,
  selectedWorkout,
  dayTitle,
}) => {
  const hasWorkouts = workouts.length > 0;

  return (
    <Card title="Päivän harjoitukset" rightTitle={dayTitle}>
      {!hasWorkouts && (
        <div className="day__emptywrap">
          <p className="day__empty">Ei kirjattuja treenejä tälle päivälle.</p>
        </div>
      )}

      {hasWorkouts && (
        <ul className="day__list">
          {workouts.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                className={`day__item ${
                  selectedWorkout?.id === w.id ? "day__item--active" : ""
                }`}
                onClick={() => onSelectWorkout?.(w)}
              >
                <span className="day__type">{w.type}</span>
                {w.duration != null && (
                  <span className="day__duration">{w.duration} min</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      <hr />
      <div className="action_btns">
        <Button as={Link} to="/workouts/new" variant="gradient" size="sm">
          Lisää uusi
        </Button>
      </div>
    </Card>
  );
};

export default DayWorkout;
