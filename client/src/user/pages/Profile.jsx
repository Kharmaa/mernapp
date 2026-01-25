import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/auth";
import { useHttpHook } from "../../hooks/httpHook";
import { toISODateLocal } from "../../utils/date";

import User from "./User";

import ProfileStats from "../components/ProfileStats";
import Errors from "../../layout/elements/Errors";
import Loading from "../../layout/elements/Loading";

import "./Profile.css";

const Profile = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [workouts, setWorkouts] = useState([]);

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

        setWorkouts(normalized);
      } catch (err) {}
    };

    if (auth.userId && auth.token) {
      fetchWorkouts();
    }
  }, [auth.userId, sendRequest, auth.token]);

  return (
    <>
      <Errors error={error} onClear={clearError} />
      {isLoading && <Loading asOverlay />}

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <User />
        </div>

        <div className="dashboard-column">
          <ProfileStats workouts={workouts} />
        </div>
      </div>
    </>
  );
};

export default Profile;
