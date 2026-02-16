import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../layout/elements/Card";
import Input from "../../layout/formelements/Input";
import Button from "../../layout/formelements/Button";
import Errors from "../../layout/elements/Errors";
import Loading from "../../layout/elements/Loading";
import { valEmail, valMinlength, valRequired } from "../../utils/validators";
import { useForm } from "../../hooks/useForm";
import { AuthContext } from "../../context/auth";
import { useHttpHook } from "../../hooks/httpHook";
import { texts } from "../../content/texts";

import "./Login.css";

const Login = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false,
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid,
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: "", isValid: false },
        },
        false,
      );
    }
    setIsLoginMode((prev) => !prev);
  };

  const loginHandler = async (event) => {
    event.preventDefault();

    const base = import.meta.env.VITE_BACKEND_URL;

    const url = isLoginMode
      ? `${base}/api/user/login`
      : `${base}/api/user/signup`;

    const payload = isLoginMode
      ? {
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }
      : {
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        };

    try {
      const responseData = await sendRequest(
        url,
        "POST",
        JSON.stringify(payload),
        { "Content-Type": "application/json" },
      );

      auth.login(responseData.userId, responseData.token);
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-page">
      <Errors error={error} onClear={clearError} />

      <div className="login-info">
        <h3 className="navigation__title glitch-info" data-text="Info">
          Info
        </h3>
        <p className="legal-text">{texts.main.landing}</p>
      </div>

      <Card className="login-form">
        {isLoading && <Loading asOverlay />}
        <div className="login-form__header">
          <h2>{isLoginMode ? "Kirjaudu sisään" : "Luo tunnus"}</h2>
        </div>

        <hr />

        <form onSubmit={loginHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Nimi"
              validators={[valRequired()]}
              onInput={inputHandler}
            />
          )}

          <Input
            element="input"
            id="email"
            type="email"
            label="Sähköposti"
            validators={[valEmail()]}
            onInput={inputHandler}
          />

          <Input
            element="input"
            id="password"
            type="password"
            label="Salasana"
            validators={[valMinlength(6)]}
            onInput={inputHandler}
          />

          <Button variant="edit" type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "KIRJAUDU" : "REKISTERÖIDY"}
          </Button>
        </form>

        <Button type="button" variant="ghost" onClick={switchModeHandler}>
          {isLoginMode ? "REKISTERÖIDY" : "KIRJAUDU"}
        </Button>
      </Card>
    </div>
  );
};

export default Login;
