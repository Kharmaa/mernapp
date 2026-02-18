import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/auth";
import { useHttpHook } from "../../hooks/httpHook";
import { toISODateLocal } from "../../utils/date";

import User from "./User";
import ProfileStats from "../components/ProfileStats";
import Errors from "../../layout/elements/Errors";
import Loading from "../../layout/elements/Loading";
import Card from "../../layout/elements/Card";
import { Link } from "react-router-dom";

import "./Profile.css";

// Profiilisivu: näyttää käyttäjän tiedot, tilastot ja omat lajit
const Profile = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();

  // Käyttäjän treenit ja lajit
  const [workouts, setWorkouts] = useState([]);
  const [types, setTypes] = useState([]);

  // Hakee treenit ja lajit backendistä
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: "Bearer " + auth.token };

        // Haetaan treenit ja lajit rinnakkain
        const [workoutsData, typesData] = await Promise.all([
          sendRequest(
            `${import.meta.env.VITE_BACKEND_URL}/api/workouts/user/${auth.userId}`,
            "GET",
            null,
            headers,
          ),
          sendRequest(
            `${import.meta.env.VITE_BACKEND_URL}/api/types`,
            "GET",
            null,
            headers,
          ),
        ]);

        // Normalisoidaan päivämäärät ISO-muotoon
        const normalized = (workoutsData.workouts || []).map((w) => ({
          ...w,
          date: toISODateLocal(w.date),
        }));

        setWorkouts(normalized);
        setTypes(typesData.types || []);
      } catch (err) {}
    };

    if (auth.userId && auth.token) fetchAll();
  }, [auth.userId, auth.token, sendRequest]);

  return (
    <>
      <Errors error={error} onClear={clearError} />
      {isLoading && <Loading asOverlay />}

      <div className="dashboard-grid">
        <div className="dashboard-column">
          {/* Käyttäjän perustiedot */}
          <User />
          {/* Treenitilastot */}
          <ProfileStats workouts={workouts} />
        </div>

        <div className="dashboard-column">
          {/* Lajit näkyviin suoraan profiilissa */}
          <Card title={`Omat lajit (${types.length})`}>
            {types.length === 0 ? (
              <p>Ei lajeja vielä. Lisää ensimmäinen.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                {types.map((t) => (
                  <li key={t.id}>{t.name}</li>
                ))}
              </ul>
            )}

            <hr />
            {/* Linkki lajien muokkaussivulle */}
            <Button as={Link} to="/profile/types" size="sm" variant="edit">
              Muokkaa lajeja
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
