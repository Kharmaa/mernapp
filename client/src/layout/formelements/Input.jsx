import { useReducer, useEffect } from "react";

import { validate } from "../../utils/validators";
import "./Input.css";

// Reducer hallitsee inputin arvoa, validiutta ja "kosketettu" -tilaa
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators || []),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }

    case "SET":
      return { ...state, value: action.val, isValid: action.isValid };

    default:
      return state;
  }
};

const Input = (props) => {
  // Inputin paikallinen state (value, valid, touched)
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ?? "",
    isTouched: false,
    isValid: props.initialValid ?? false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  // Ilmoittaa parentille aina kun arvo tai validius muuttuu
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  // Päivittää inputin tilan jos initialValue/initialValid muuttuu
  useEffect(() => {
    dispatch({
      type: "SET",
      val: props.initialValue ?? "",
      isValid: props.initialValid ?? false,
    });
  }, [props.initialValue, props.initialValid]);

  // Käsittelee kirjoittamisen: päivittää state + validointi
  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  // Käsittelee blurin: merkitsee kentän kosketetuksi
  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  // Renderöi joko inputin tai textarea:n props.elementin mukaan
  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    // Lisää invalid-luokan vain jos kenttä on kosketettu ja epävalidi
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
