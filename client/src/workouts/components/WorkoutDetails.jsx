import { useState } from "react";

import Button from "../../layout/formelements/Button";
import Card from "../../layout/elements/Card";
import Modal from "../../layout/elements/Modal";

import { Link } from "react-router-dom";
import "./WorkoutDetails.css";

const WorkoutDetails = ({ selectedWorkout, onDeleteWorkout }) => {
  const hasWorkout = !!selectedWorkout;

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);
    if (!selectedWorkout) return;

    onDeleteWorkout?.(selectedWorkout.id || selectedWorkout._id);
  };
  return (
    <>
      <Modal
        show={showConfirmModal}
        header="Oletko varma?"
        footerClass="footer_btns"
        footer={
          <>
            <Button type="button" variant="edit" onClick={cancelDeleteHandler}>
              Sulje
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

      <Card title="Harjoituksen tiedot">
        {!hasWorkout && (
          <p className="workoutdet__placeholder">
            Valitse harjoitus päivän listalta nähdäksesi tarkemmat tiedot.
          </p>
        )}

        {hasWorkout && (
          <div className="workoutdet__content">
            <div className="workoutdet__row">
              <span className="workoutdet__label">Laji</span>
              <span className="workoutdet__value">{selectedWorkout.type}</span>
            </div>

            <div className="workoutdet__row">
              <span className="workoutdet__label">Päivä</span>
              <span className="workoutdet__value">{selectedWorkout.date}</span>
            </div>

            <div className="workoutdet__row">
              <span className="workoutdet__label">Kesto</span>
              <span className="workoutdet__value">
                {selectedWorkout.duration} min
              </span>
            </div>

            {selectedWorkout.description && (
              <div className="workoutdet__notes">
                <span className="workoutdet__label">Muistiinpanot</span>
                <p className="workoutdet__notes-text">
                  {selectedWorkout.description}
                </p>
              </div>
            )}
          </div>
        )}

        {hasWorkout && (
          <>
            <hr className="workoutdet__hr" />
            <div className="footer_btns">
              <Button
                as={Link}
                to={`/workouts/${selectedWorkout.id || selectedWorkout._id}/edit`}
                size="sm"
                variant="gradient"
              >
                Muokkaa
              </Button>

              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={showDeleteWarningHandler}
              >
                Poista
              </Button>
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default WorkoutDetails;
