import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Card from "../../layout/elements/Card";
import Button from "../../layout/formelements/Button";
import Modal from "../../layout/elements/Modal";
import Errors from "../../layout/elements/Errors";
import Loading from "../../layout/elements/Loading";

import { AuthContext } from "../../context/auth";
import { useHttpHook } from "../../hooks/httpHook";

import "./WorkoutTypesManager.css";

const WorkoutTypesManager = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();

  const [types, setTypes] = useState([]);
  const [newName, setNewName] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);

  const headers = useMemo(
    () => ({ Authorization: "Bearer " + auth.token }),
    [auth.token],
  );

  const fetchTypes = async () => {
    const data = await sendRequest(
      `${import.meta.env.VITE_BACKEND_URL}/api/types`,
      "GET",
      null,
      headers,
    );
    setTypes(
      (data.types || [])
        .slice()
        .sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    );
  };

  useEffect(() => {
    if (!auth.token) return;
    fetchTypes().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token]);

  const addTypeHandler = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    // client-side duplikaattiesto
    const exists = types.some(
      (t) => (t.name || "").toLowerCase() === name.toLowerCase(),
    );
    if (exists) return;

    const created = await sendRequest(
      `${import.meta.env.VITE_BACKEND_URL}/api/types`,
      "POST",
      JSON.stringify({ name }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
    );

    const added = created.type;
    setTypes((prev) =>
      [...prev, added].sort((a, b) =>
        (a.name || "").localeCompare(b.name || ""),
      ),
    );
    setNewName("");
  };

  const openDeleteModal = (type) => {
    setTypeToDelete(type);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setTypeToDelete(null);
  };

  const confirmDelete = async () => {
    if (!typeToDelete) return;

    setShowConfirm(false);

    try {
      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/api/types/${typeToDelete.id}`,
        "DELETE",
        null,
        headers,
      );
      setTypes((prev) => prev.filter((t) => t.id !== typeToDelete.id));
    } catch (e) {
      // virhe näkyy Errors-komponentissa
    } finally {
      setTypeToDelete(null);
    }
  };

  return (
    <>
      <Errors error={error} onClear={clearError} />

      <Modal
        show={showConfirm}
        header="Poista laji?"
        footerClass="footer_btns"
        footer={
          <>
            <Button type="button" variant="edit" onClick={cancelDelete}>
              Peruuta
            </Button>
            <Button type="button" variant="danger" onClick={confirmDelete}>
              Poista
            </Button>
          </>
        }
      >
        <p>
          Haluatko varmasti poistaa lajin <strong>{typeToDelete?.name}</strong>?
        </p>
      </Modal>

      <Card title="Omat lajit">
        {isLoading && <Loading />}

        {!isLoading && (
          <>
            <form className="types__add" onSubmit={addTypeHandler}>
              <input
                className="types__input"
                type="text"
                value={newName}
                placeholder="Kirjaa tähän uusi laji"
                onChange={(e) => setNewName(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                variant="gradient-green"
                disabled={!newName.trim()}
              >
                Lisää
              </Button>
            </form>

            <hr />

            {types.length === 0 ? (
              <p>Ei lajeja vielä. Lisää ensimmäinen!</p>
            ) : (
              <ul className="types__list">
                {types.map((t) => (
                  <li key={t.id} className="types__row">
                    <span className="types__name">{t.name}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => openDeleteModal(t)}
                    >
                      Poista
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <hr />

            <div className="types__actions">
              <Button as={Link} to="/profile" size="sm" variant="ghost">
                Takaisin profiiliin
              </Button>
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default WorkoutTypesManager;
