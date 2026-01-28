import { useContext, useState } from "react";
import Input from "../../layout/formelements/Input";
import {
  valRequired,
  valMax,
  valMin,
  valNotFuture,
} from "../../utils/validators";
import Card from "../../layout/elements/Card";
import Button from "../../layout/formelements/Button";
import Errors from "../../layout/elements/Errors";
import Loading from "../../layout/elements/Loading";
import { useForm } from "../../hooks/useForm";
import { dateToday } from "../../utils/date";
import { useNavigate } from "react-router-dom";
import { useHttpHook } from "../../hooks/httpHook";
import { AuthContext } from "../../context/auth";
import WorkoutSelect from "../components/WorkoutSelect";
import "./WorkoutForm.css";

const NewWorkout = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [typeId, setTypeId] = useState("");

  const today = dateToday();
  const navigate = useNavigate();

  const [formState, inputHandler] = useForm(
    {
      date: { value: today, isValid: true },
      durationHours: { value: "0", isValid: true },
      durationMinutes: { value: "", isValid: true },
      description: { value: "", isValid: true },
    },
    false,
  );

  const saveWorkout = async (event) => {
    event.preventDefault();

    const h = Number(formState.inputs.durationHours.value || 0);
    const m = Number(formState.inputs.durationMinutes.value || 0);
    const duration = h === 0 && m === 0 ? null : h * 60 + m;

    if (!typeId) return;

    try {
      const body = {
        date: formState.inputs.date.value,
        type: typeId,
        description: formState.inputs.description.value,
      };

      if (duration !== null) body.duration = duration;

      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/api/workouts`,
        "POST",
        JSON.stringify(body),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
      );

      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelHandler = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <Errors error={error} onClear={clearError} />

      <Card title="Lisää uusi harjoitus:" className="form-workout-card">
        <form className="form-workout" onSubmit={saveWorkout}>
          {isLoading && <Loading asOverlay />}
          <Input
            id="date"
            element="input"
            type="date"
            label="Päivämäärä"
            validators={[valRequired(), valNotFuture()]}
            errorText="Päivämäärä ei voi olla tulevaisuudessa"
            onInput={inputHandler}
            initialValue={today}
            initialValid={true}
            max={today}
          />

          <WorkoutSelect value={typeId} onChange={setTypeId} />

          <div className="duration-row">
            <Input
              id="durationHours"
              element="input"
              type="number"
              label="Tunnit"
              validators={[valMin(0), valMax(24)]}
              initialValue="0"
              initialValid={true}
              onInput={inputHandler}
            />

            <Input
              id="durationMinutes"
              element="input"
              type="number"
              label="Minuutit"
              validators={[valMin(0), valMax(59)]}
              initialValue=""
              initialValid={true}
              onInput={inputHandler}
            />
          </div>

          <Input
            id="description"
            element="textarea"
            type="text"
            label="Muistiinpanot"
            initialValue=""
            initialValid={true}
            onInput={inputHandler}
          />
          <hr />
          <div className="action_btns">
            <Button
              type="submit"
              disabled={!formState.isValid || !typeId}
              size="sm"
              variant="gradient-green"
            >
              TALLENNA
            </Button>
            <Button variant="ghost" size="sm" onClick={cancelHandler}>
              PERUUTA
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default NewWorkout;
