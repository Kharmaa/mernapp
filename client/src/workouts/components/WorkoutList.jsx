import { useState } from "react";
import { formatDateFI } from "../../utils/date";
import Card from "../../layout/elements/Card";
import Button from "../../layout/formelements/Button";
import WorkoutItem from "./WorkoutItem";
import Modal from "../../layout/elements/Modal";
import { Link } from "react-router-dom";

import "./WorkoutList.css";

//Komponentin propsit
const WorkoutList = ({
  items,
  onDeleteWorkout,
  monthOptions,
  selectedMonth,
  onMonthChange,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  //Avaa poistomodaaline ja tallentaa id:n
  const showDeleteModal = (workoutId) => {
    setWorkoutToDelete(workoutId);
    setShowConfirmModal(true);
  };

  //Sulkee modaalin ilman poistoa
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    setWorkoutToDelete(null);
  };

  //Vahvistaa poiston
  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);

    //Jos dataa ei ole vielä
    if (workoutToDelete) {
      onDeleteWorkout?.(workoutToDelete);
    }

    setWorkoutToDelete(null);
  };

  if (!items) {
    return (
      <Card title="Treenit">
        <p>Ei kirjattuja treenejä</p>
        <div className="workoutdet__actions">
          <Button as={Link} to="/workouts/new">
            Lisää uusi
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Modal
        show={showConfirmModal}
        header="Oletko varma?"
        footerClass="footer_btns"
        footer={
          <>
            <Button
              type="button"
              variant="gradient"
              onClick={cancelDeleteHandler}
            >
              PERUUTA
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={confirmDeleteHandler}
            >
              Poista
            </Button>
          </>
        }
      >
        <p>Haluatko varmasti poistaa harjoituksen lopullisesti?</p>
      </Modal>

      <Card title="Treenilista" className="workout-list-card">
        {monthOptions && monthOptions.length > 0 && (
          <div className="workout-list__monthpicker">
            <label htmlFor="month">Valitse kuukausi:</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}
        {items.length === 0 ? (
          <p style={{ marginTop: "0.5rem" }}>
            Ei kirjauksia valitulle kuukaudelle.
          </p>
        ) : (
          <ul className="workout-list">
            {items.map((workout) => {
              const typeLabel =
                typeof workout.type === "string"
                  ? workout.type
                  : workout.type?.name || "Tuntematon laji";

              return (
                <li key={workout.id} className="workout-list__item">
                  <Card
                    rightTitle={formatDateFI(workout.date)}
                    className="workout-item-card"
                  >
                    <WorkoutItem
                      type={typeLabel}
                      duration={workout.duration}
                      description={workout.description}
                      // jos WorkoutItem on klikattava, avaa poistomodaali tälle treenille
                      onClick={() => showDeleteModal(workout.id)}
                    />

                    <hr className="workoutdet__hr" />

                    <div className="footer_btns">
                      <Button
                        as={Link}
                        to={`/workouts/${workout.id}/edit`}
                        size="sm"
                        variant="edit"
                      >
                        Muokkaa
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => showDeleteModal(workout.id)}
                      >
                        Poista
                      </Button>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}

        <div className="workoutdet__actions">
          <Button size="sm" variant="gradient" as={Link} to="/workouts/new">
            Lisää uusi
          </Button>
        </div>
        <Button as={Link} to="/" size="sm" variant="ghost">
          Takaisin
        </Button>
      </Card>
    </>
  );
};

export default WorkoutList;
