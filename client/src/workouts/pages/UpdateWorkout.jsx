import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../../layout/formelements/Input";
import Button from "../../layout/formelements/Button";
import Card from "../../layout/elements/Card";
import Errors from "../../layout/elements/Errors";
import Loading from "../../layout/elements/Loading";
import {
  valRequired,
  valMax,
  valMin,
  valNotFuture,
} from "../../utils/validators";
import { useForm } from "../../hooks/useForm";
import { useHttpHook } from "../../hooks/httpHook";
import { formatDateFI, dateToday, toISODateLocal } from "../../utils/date";

import "./WorkoutForm.css";
import { AuthContext } from "../../context/auth";

const toHoursMinutes = (totalMinutes) => {
  if (totalMinutes === null || totalMinutes === undefined) {
    return { hours: "", minutes: "" };
  }
  const t = Number(totalMinutes || 0);
  return { hours: String(Math.floor(t / 60)), minutes: String(t % 60) };
};

const UpdateWorkout = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [loadedWorkout, setLoadedWorkout] = useState(null);

  const { workoutId } = useParams();
  const navigate = useNavigate();
  const today = dateToday();

  const [formState, inputHandler, setFormData] = useForm(
    {
      date: { value: "", isValid: false },
      type: { value: "", isValid: false },
      durationHours: { value: "", isValid: true },
      durationMinutes: { value: "", isValid: true },
      description: { value: "", isValid: true },
    },
    false,
  );

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/workouts/${workoutId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token },
        );

        const w = responseData.workout;
        setLoadedWorkout(w);

        const { hours, minutes } = toHoursMinutes(w.duration);
        const isoDate = toISODateLocal(w.date);

        setFormData(
          {
            date: { value: isoDate || today, isValid: true },
            type: { value: w.type || "", isValid: true },
            durationHours: { value: hours, isValid: true },
            durationMinutes: { value: minutes, isValid: true },
            description: { value: w.description || "", isValid: true },
          },
          true,
        );
      } catch (err) {}
    };

    if (workoutId && auth.token) fetchWorkout();
  }, [sendRequest, workoutId, setFormData, today, auth.token]);

  const updateWorkoutHandler = async (event) => {
    event.preventDefault();

    const hRaw = formState.inputs.durationHours.value;
    const mRaw = formState.inputs.durationMinutes.value;

    const h = Number(hRaw || 0);
    const m = Number(mRaw || 0);

    const duration =
      (hRaw === "" && mRaw === "") || (h === 0 && m === 0) ? null : h * 60 + m;

    try {
      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/workouts/${workoutId}`,
        "PATCH",
        JSON.stringify({
          date: formState.inputs.date.value,
          type: formState.inputs.type.value,
          description: formState.inputs.description.value,
          duration,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
      );

      navigate(-1);
    } catch (err) {}
  };

  const cancelHandler = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  if (isLoading) {
    return <Loading asOverlay />;
  }

  if (!loadedWorkout && !error) {
    return (
      <Card>
        <p>Treeniä ei löytynyt</p>
      </Card>
    );
  }

  return (
    <>
      <Errors error={error} onClear={clearError} />

      <Card
        title="Muokkaa harjoitusta:"
        rightTitle={formatDateFI(formState.inputs.date.value)}
        className="form-workout-card"
      >
        {loadedWorkout && (
          <form className="form-workout" onSubmit={updateWorkoutHandler}>
            <Input
              id="date"
              element="input"
              type="date"
              label="Päivämäärä"
              validators={[valRequired(), valNotFuture()]}
              errorText="Päivämäärä ei voi olla tulevaisuudessa"
              onInput={inputHandler}
              initialValue={formState.inputs.date.value}
              initialValid={formState.inputs.date.isValid}
              max={today}
            />

            <Input
              id="type"
              element="input"
              type="text"
              label="Laji"
              validators={[valRequired()]}
              errorText="Syötä puuttuvat tiedot"
              onInput={inputHandler}
              initialValue={formState.inputs.type.value}
              initialValid={formState.inputs.type.isValid}
            />

            <div className="duration-row">
              <Input
                id="durationHours"
                element="input"
                type="number"
                label="Tunnit"
                validators={[valMin(0), valMax(24)]}
                onInput={inputHandler}
                initialValue={formState.inputs.durationHours.value}
                initialValid={formState.inputs.durationHours.isValid}
              />

              <Input
                id="durationMinutes"
                element="input"
                type="number"
                label="Minuutit"
                validators={[valMin(0), valMax(59)]}
                onInput={inputHandler}
                initialValue={formState.inputs.durationMinutes.value}
                initialValid={formState.inputs.durationMinutes.isValid}
              />
            </div>

            <Input
              id="description"
              element="textarea"
              type="text"
              label="Muistiinpanot"
              onInput={inputHandler}
              initialValue={formState.inputs.description.value}
              initialValid={formState.inputs.description.isValid}
            />

            <hr />

            <div className="action_btns">
              <Button
                type="submit"
                disabled={!formState.isValid}
                size="sm"
                variant="gradient-green"
              >
                TALLENNA
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={cancelHandler}
              >
                PERUUTA
              </Button>
            </div>
          </form>
        )}
      </Card>
    </>
  );
};

export default UpdateWorkout;
