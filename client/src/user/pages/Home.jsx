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

// Home-näkymä: näyttää viikon, päivän treenit ja tilannekatsauksen
const Home = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const location = useLocation();

  // Valittu päivä ja treeni
  const [selectedDate, setSelectedDate] = useState(dateToday());
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Kaikki käyttäjän treenit
  const [loadedWorkouts, setLoadedWorkouts] = useState([]);

  // Hakee käyttäjän treenit backendistä
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/api/workouts/user/${auth.userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token },
        );

        // Normalisoidaan päivämäärä ISO-muotoon
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

  // Suodatetaan valitun päivän treenit
  const dayWorkouts = loadedWorkouts
    .filter((w) => w.date === selectedDate)
    .slice()
    .sort((a, b) => b.id.localeCompare(a.id));

  // Päivän vaihto
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedWorkout(null);
  };

  // Treenin valinta
  const handleSelectWorkout = (w) => {
    setSelectedWorkout(w);
  };

  // Treenin poisto
  const handleDeleteWorkout = async (workoutId) => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/api/workouts/${workoutId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token },
      );

      // Päivitetään tila ilman poistettua treeniä
      setLoadedWorkouts((prev) => prev.filter((w) => w.id !== workoutId));

      setSelectedWorkout((prev) => (prev?.id === workoutId ? null : prev));
    } catch (err) {}
  };

  return (
    <>
      <Errors error={error} onClear={clearError} />
      {isLoading && <Loading asOverlay />}

      {/* Viikkopaneeli */}
      <WeekPanel
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        workouts={loadedWorkouts}
      />

      <div className="dashboard-grid">
        <div className="dashboard-column">
          {/* Päivän treenit */}
          <DayWorkout
            workouts={dayWorkouts}
            selectedWorkout={selectedWorkout}
            onSelectWorkout={setSelectedWorkout}
            dayTitle={formatDateFI(selectedDate)}
          />

          {/* Valitun treenin tiedot */}
          <WorkoutDetails
            selectedWorkout={selectedWorkout}
            onDeleteWorkout={handleDeleteWorkout}
          />
        </div>

        <div className="dashboard-column">
          {/* Viimeisimmät treenit */}
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
