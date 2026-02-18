// Validaattorit lomakekentille
import { dateToday } from "./date";

// Validator-tyyppien tunnisteet
const val_required = "required";
const val_email = "email";
const val_min = "min";
const val_max = "max";
const val_minlength = "minlength";
const val_maxlength = "maxlength";
const val_file = "file";
const val_notfuture = "notfuture";

// Funktiot, jotka palauttavat validator-objekteja
export const valRequired = () => ({ type: val_required });
export const valEmail = () => ({ type: val_email });

export const valMin = (val) => ({ type: val_min, val: val });
export const valMax = (val) => ({ type: val_max, val: val });

export const valMinlength = (val) => ({ type: val_minlength, val: val });
export const valMaxlength = (val) => ({ type: val_maxlength, val: val });

export const valFile = () => ({ type: val_file });
export const valNotFuture = () => ({ type: val_notfuture });

// Varsinainen validointifunktio
// Käy kaikki validatorit läpi ja palauttaa true/false
export const validate = (value, validators = []) => {
  let isValid = true;

  for (const validator of validators) {
    // Kenttä ei saa olla tyhjä
    if (validator.type === val_required) {
      isValid = isValid && String(value ?? "").trim().length > 0;
    }

    // Sähköpostimuoto tarkistetaan regexillä
    if (validator.type === val_email) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }

    // Numeerinen min-arvo
    if (validator.type === val_min) {
      isValid = isValid && +value >= validator.val;
    }

    // Numeerinen max-arvo
    if (validator.type === val_max) {
      isValid = isValid && +value <= validator.val;
    }

    // Minimipituus
    if (validator.type === val_minlength) {
      isValid = isValid && String(value ?? "").trim().length >= validator.val;
    }

    // Maksimipituus
    if (validator.type === val_maxlength) {
      isValid = isValid && String(value ?? "").trim().length <= validator.val;
    }

    // Päivämäärä ei saa olla tulevaisuudessa
    if (validator.type === val_notfuture) {
      isValid = isValid && value <= dateToday();
    }
  }

  return isValid;
};
