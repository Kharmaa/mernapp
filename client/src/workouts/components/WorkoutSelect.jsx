import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { useHttpHook } from "../../hooks/httpHook";
import Button from "../../layout/formelements/Button";

const WorkoutSelect = ({
  value, //valittu type ID
  onChange, //(newTypeId)
  label = "Laji",
}) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpHook();

  const [types, setTypes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [localError, setLocalError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const data = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/api/types`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token },
        );
        setTypes(data.types || []);
      } catch (err) {
        // error jos ei löydy
        setLocalError("Lajien haku epäonnistui");
      }
    };

    if (auth.token) fetchTypes();
  }, [auth.token, sendRequest]);

  const openAdd = () => {
    setLocalError(null);
    setNewName("");
    setIsAdding(true);
  };

  const cancelAdd = () => {
    setLocalError(null);
    setNewName("");
    setIsAdding(false);
  };

  const saveNewType = async () => {
    const name = newName.trim();
    if (!name) {
      setLocalError("Syötä lajin nimi");
      return;
    }

    // estä duplikaatti
    const exists = types.some(
      (t) => (t.name || "").toLowerCase() === name.toLowerCase(),
    );
    if (exists) {
      setLocalError("Laji on jo listalla");
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      const created = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/api/types`,
        "POST",
        JSON.stringify({ name }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
      );

      const newType = created.type;
      // Lisää listaan ja valitse automaattisesti
      setTypes((prev) =>
        [...prev, newType].sort((a, b) =>
          (a.name || "").localeCompare(b.name || ""),
        ),
      );
      onChange(newType.id);
      setIsAdding(false);
      setNewName("");
    } catch (err) {
      setLocalError("Lajin lisäys epäonnistui (nimi voi olla jo käytössä)");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <label style={{ fontWeight: 600 }}>{label}</label>

      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "0.6rem", borderRadius: "10px" }}
      >
        <option value="" disabled>
          Valitse laji...
        </option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {!isAdding && (
        <div>
          <Button type="button" size="sm" variant="ghost" onClick={openAdd}>
            + Lisää uusi laji
          </Button>
        </div>
      )}

      {isAdding && (
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Uuden lajin nimi"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: "0.6rem", borderRadius: "10px" }}
          />

          {localError && <small style={{ opacity: 0.9 }}>{localError}</small>}

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              type="button"
              size="sm"
              variant="gradient-green"
              onClick={saveNewType}
              disabled={isSaving}
            >
              {isSaving ? "Tallennetaan..." : "Tallenna laji"}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={cancelAdd}>
              Peruuta
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutSelect;
