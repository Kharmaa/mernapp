import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import WeekPanel from "../../layout/components/WeekPanel";
import DayWorkout from "../../workouts/components/DayWorkout";
import WorkoutDetails from "../../workouts/components/WorkoutDetails";
import RecentWorkouts from "../../workouts/components/RecentWorkouts";
import Errors from "../../layout/elements/Errors";
import Loading from "../../layout/elements/Loading";

import { AuthContext } from "../../context/auth";
import { useHttpHook } from "../../hooks/httpHook";
import { toISODateLocal, dateToday, formatDateFI } from "../../utils/date";

import "./Home.css";

const Home = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const location = useLocation();

  const [selectedDate, setSelectedDate] = useState(dateToday());
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const [loadedWorkouts, setLoadedWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/api/workouts/user/${auth.userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token },
        );

        const normalized = (data.workouts || []).map((w) => ({
          ...w,
          date: toISODateLocal(w.date),
        }));

        setLoadedWorkouts(normalized);
      } catch (err) {}
    };

    if (auth.userId && auth.token) {
      fetchWorkouts();
    }
  }, [sendRequest, auth.userId, location.key, auth.token]);

  const dayWorkouts = loadedWorkouts
    .filter((w) => w.date === selectedDate)
    .slice()
    .sort((a, b) => b.id.localeCompare(a.id));

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedWorkout(null);
  };

  const handleSelectWorkout = (w) => {
    setSelectedWorkout(w);
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/api/workouts/${workoutId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token },
      );

      setLoadedWorkouts((prev) => prev.filter((w) => w.id !== workoutId));

      setSelectedWorkout((prev) => (prev?.id === workoutId ? null : prev));
    } catch (err) {}
  };

  return (
    <>
      <Errors error={error} onClear={clearError} />
      {isLoading && <Loading asOverlay />}
      <WeekPanel
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        workouts={loadedWorkouts}
      />

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <DayWorkout
            workouts={dayWorkouts}
            selectedWorkout={selectedWorkout}
            onSelectWorkout={setSelectedWorkout}
            dayTitle={formatDateFI(selectedDate)}
          />
          <WorkoutDetails
            selectedWorkout={selectedWorkout}
            onDeleteWorkout={handleDeleteWorkout}
          />
        </div>

        <div className="dashboard-column">
          <RecentWorkouts
            workouts={loadedWorkouts}
            onSelectWorkout={handleSelectWorkout}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
