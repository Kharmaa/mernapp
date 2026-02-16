import { useEffect, useMemo, useState, useContext } from "react";
import { useHttpHook } from "../../hooks/httpHook";
import { AuthContext } from "../../context/auth";

import WorkoutList from "../components/WorkoutList";
import Errors from "../../layout/elements/Errors";
import Loading from "../../layout/elements/Loading";

// Tekee päivämäärästä kuukausiavaimen muodossa "YYYY-MM"
const toMonthKey = (dateValue) => {
  const d = new Date(dateValue);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // esim "2026-02"
};

// Hakee käyttäjän treenit ja suodattaa ne kuukausittain.
const UserWorkouts = () => {
  const [loadedWorkouts, setLoadedWorkouts] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const auth = useContext(AuthContext);

  // oletuksena nykyinen kuukausi
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // Hakee treenit kun userId/token on saatavilla
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/api/workouts/user/${auth.userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token },
        );
        setLoadedWorkouts(responseData.workouts || []);
      } catch (err) {}
    };

    if (auth.userId && auth.token) fetchWorkouts();
  }, [sendRequest, auth.userId, auth.token]);

  // Poistaa treenin backendistä ja päivittää listan
  const handleDeleteWorkout = async (workoutId) => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/api/workouts/${workoutId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token },
      );
      setLoadedWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
    } catch (err) {}
  };

  // kaikki kuukaudet jotka löytyy datasta, kuukausivalitsin (uusin ensin)
  const monthOptions = useMemo(() => {
    const unique = new Set(loadedWorkouts.map((w) => toMonthKey(w.date)));
    return Array.from(unique).sort((a, b) => b.localeCompare(a));
  }, [loadedWorkouts]);

  // suodatettu lista valitun kuukauden mukaan
  const filteredWorkouts = useMemo(() => {
    return [...loadedWorkouts]
      .filter((w) => toMonthKey(w.date) === selectedMonth)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [loadedWorkouts, selectedMonth]);

  // Varmistaa että valittu kuukausi löytyy
  useEffect(() => {
    if (monthOptions.length === 0) return;

    setSelectedMonth((prev) =>
      monthOptions.includes(prev) ? prev : monthOptions[0],
    );
  }, [monthOptions]);

  return (
    <>
      <Errors error={error} onClear={clearError} />
      {isLoading && <Loading />}

      {!isLoading && (
        <WorkoutList
          items={filteredWorkouts}
          onDeleteWorkout={handleDeleteWorkout}
          monthOptions={monthOptions}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      )}
    </>
  );
};

export default UserWorkouts;
