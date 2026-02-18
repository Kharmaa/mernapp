import "./WorkoutItem.css";

// Näyttää yksittäisen treenin tiivistetyt tiedot (laji, kesto, kuvaus)
const WorkoutItem = ({ type, duration, description, notes }) => {
  return (
    <div className="workoutitem">
      {/* Yläosa: laji ja mahdollinen kesto */}
      <div className="workoutitem__top">
        <h3 className="workoutitem__type">{type}</h3>

        {duration !== null && duration !== undefined && (
          <span className="workoutitem__duration">{duration} min</span>
        )}
      </div>
      {/* Kuvaus tai muistiinpanot jos niitä on */}
      {(description || notes) && (
        <p className="workoutitem__desc">{notes || description}</p>
      )}
    </div>
  );
};

export default WorkoutItem;
