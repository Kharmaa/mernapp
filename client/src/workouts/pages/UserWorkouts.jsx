import { useEffect, useState, useContext } from "react";
import { useHttpHook } from "../../hooks/httpHook";
import { AuthContext } from "../../context/auth";

import WorkoutList from "../components/WorkoutList";
import Errors from "../../layout/elements/Errors";
import Loading from "../../layout/elements/Loading";

const UserWorkouts = () => {
  const [loadedWorkouts, setLoadedWorkouts] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/workouts/user/${auth.userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token },
        );
        setLoadedWorkouts(responseData.workouts || []);
      } catch (err) {}
    };

    if (auth.userId && auth.token) {
      fetchWorkouts();
    }
  }, [sendRequest, auth.userId, auth.token]);

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/workouts/${workoutId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token },
      );

      setLoadedWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
    } catch (err) {}
  };

  return (
    <>
      <Errors error={error} onClear={clearError} />
      {isLoading && <Loading />}
      {!isLoading && (
        <WorkoutList
          items={loadedWorkouts}
          onDeleteWorkout={handleDeleteWorkout}
        />
      )}
    </>
  );
};

export default UserWorkouts;
