import "./WorkoutItem.css";

const WorkoutItem = ({ type, duration, description, notes }) => {
  return (
    <div className="workoutitem">
      <div className="workoutitem__top">
        <h3 className="workoutitem__type">{type}</h3>

        {duration !== null && duration !== undefined && (
          <span className="workoutitem__duration">{duration} min</span>
        )}
      </div>

      {(description || notes) && (
        <p className="workoutitem__desc">{notes || description}</p>
      )}
    </div>
  );
};

export default WorkoutItem;
