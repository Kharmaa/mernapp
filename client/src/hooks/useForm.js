import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  // Käsittelee lomakkeen eri toiminnot: päivittää yksittäisen kentän ja laskee koko lomakkeen validiuden
  // tai asettaa koko lomakedatan kerralla esim. edit-tilanteessa
  switch (action.type) {
    case "INPUT_CHANGE": {
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    }
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };

    default:
      return state;
  }
};

// Custom hook, joka alustaa ja hallitsee lomakkeen tilaa (kentät + koko lomakkeen validius) useReducerin avulla
export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  //Käsittelee yksittäisen input-kentän muutokset:
  //lähettää reducerille tiedon uudesta arvosta ja validiudesta
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value,
      isValid,
      inputId: id,
    });
  }, []);

  //Asettaa koko lomakedatan kerralla (esim. kun muokattavan kohteen tiedot haetaan API:sta)
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
};
