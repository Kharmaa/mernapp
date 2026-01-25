import { useEffect, useState, useContext } from "react";

import Errors from "../../layout/elements/Errors";
import Loading from "../../layout/elements/Loading";
import Card from "../../layout/elements/Card";
import UserCard from "../components/UserCard";
import { useHttpHook } from "../../hooks/httpHook";
import { AuthContext } from "../../context/auth";

const User = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      // jos ei tokenia, ei haeta profiilia
      if (!auth.token) {
        setLoggedUser(null);
        return;
      }

      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/me`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token },
        );

        setLoggedUser(responseData.user || null);
      } catch (err) {
        setLoggedUser(null);
      }
    };

    fetchUser();
  }, [sendRequest, auth.token]);

  return (
    <>
      <Errors error={error} onClear={clearError} />
      {isLoading && <Loading />}
      <div className="user-profile">
        <Card title="Profiili">
          {!isLoading && loggedUser && <UserCard user={loggedUser} />}
          {!isLoading && !loggedUser && (
            <p>Kirjaudu sisään nähdäksesi profiilin.</p>
          )}
        </Card>
      </div>
    </>
  );
};

export default User;
