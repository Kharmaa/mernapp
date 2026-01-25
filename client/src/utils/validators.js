//Validators for form inputs

import { dateToday } from "./date";

const val_required = "required";
const val_email = "email";
const val_min = "min";
const val_max = "max";
const val_minlength = "minlength";
const val_maxlength = "maxlength";
const val_file = "file";
const val_notfuture = "notfuture";

export const valRequired = () => ({ type: val_required });
export const valEmail = () => ({ type: val_email });

export const valMin = (val) => ({ type: val_min, val: val });
export const valMax = (val) => ({ type: val_max, val: val });

export const valMinlength = (val) => ({ type: val_minlength, val: val });
export const valMaxlength = (val) => ({ type: val_maxlength, val: val });

export const valFile = () => ({ type: val_file });
export const valNotFuture = () => ({ type: val_notfuture });

export const validate = (value, validators = []) => {
  let isValid = true;

  for (const validator of validators) {
    if (validator.type === val_required) {
      isValid = isValid && String(value ?? "").trim().length > 0;
    }
    if (validator.type === val_email) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validator.type === val_min) {
      isValid = isValid && +value >= validator.val;
    }
    if (validator.type === val_max) {
      isValid = isValid && +value <= validator.val;
    }
    if (validator.type === val_minlength) {
      isValid = isValid && String(value ?? "").trim().length >= validator.val;
    }
    if (validator.type === val_maxlength) {
      isValid = isValid && String(value ?? "").trim().length <= validator.val;
    }
    if (validator.type === val_notfuture) {
      isValid = isValid && value <= dateToday();
    }
  }

  return isValid;
};
