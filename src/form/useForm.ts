import React from "react";
import validate, { ValidateFnName } from "./validation";

type FieldValue = string | number | boolean | undefined;

export type FieldValidation = {
  fieldName: string;
  validations: {
    [key in ValidateFnName]?: boolean | number | RegExp;
  };
};

type FormDataType = {
  [key: string]: FieldValue;
};

const actions = {
  initialize: (data: FormDataType) =>
    ({
      type: "initialize",
      payload: data
    } as const),

  setFieldValue: (fieldName: string, fieldValue: FieldValue) =>
    ({
      type: "setFieldValue",
      payload: {
        fieldName,
        fieldValue
      }
    } as const),

  setFieldTouched: (fieldName: string) =>
    ({
      type: "setFieldTouched",
      payload: fieldName
    } as const)
};

type ReturnActionPropertiesType<T> = T extends { [key: string]: infer U }
  ? U
  : never;

type ActionType = ReturnType<ReturnActionPropertiesType<typeof actions>>;

interface FormState {
  validation: FieldValidation[];
  initalValues: FormDataType;
  errors: FormDataType;
  values: FormDataType;
  touched: FormDataType;
}

function getError(value: FieldValue, validation: FieldValidation | undefined) {
  if (!validation) return undefined;
  const fnKeys = Object.keys(validation.validations) as ValidateFnName[];

  const errors = fnKeys.reduce((acc, key) => {
    const valFn = validate(value)[key];
    const error = valFn(validation.validations[key]);
    return error ? [...acc, error] : acc;
  }, [] as string[]);

  return errors.length ? errors[0] : undefined;
}

const reducer = (state: FormState, action: ActionType) => {
  switch (action.type) {
    case "initialize": {
      const pattern = Object.keys(action.payload).reduce(
        (acc, key) => ({
          ...acc,
          [key]: ""
        }),
        {} as { [key: string]: string }
      );
      const formValues = Object.assign({ ...pattern }, action.payload);
      const touched = Object.keys(pattern).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false
        }),
        {}
      );
      const errors = Object.keys(pattern).reduce(
        (acc, key) => ({
          ...acc,
          [key]: undefined
        }),
        {}
      );
      return {
        ...state,
        initalValues: action.payload,
        errors,
        touched,
        values: formValues
      };
    }
    case "setFieldValue": {
      const { fieldName, fieldValue } = action.payload;
      const error = getError(
        fieldValue,
        state.validation.find((v) => v.fieldName === fieldName)
      );
      return {
        ...state,
        values: { ...state.values, [fieldName]: fieldValue },
        errors: {
          ...state.errors,
          [fieldName]: error
        }
      };
    }

    case "setFieldTouched": {
      const fieldName = action.payload;
      const error = getError(
        state.values[fieldName],
        state.validation.find((v) => v.fieldName === fieldName)
      );
      return {
        ...state,
        touched: { ...state.touched, [fieldName]: true },
        errors: {
          ...state.errors,
          [fieldName]: error
        }
      };
    }
  }
};

const useForm = (initData: FormDataType, validation: FieldValidation[]) => {
  const [{ errors, touched, values }, dispatch] = React.useReducer(reducer, {
    validation,
    initalValues: initData,
    errors: {} as FormDataType,
    values: {} as FormDataType,
    touched: {} as FormDataType
  });

  React.useEffect(() => {
    if (initData) {
      dispatch({ type: "initialize", payload: initData });
    }
  }, [initData]);

  const handleChange = (field: string, value: FieldValue) => {
    dispatch({
      type: "setFieldValue",
      payload: { fieldName: field, fieldValue: value }
    });
  };

  const setTouched = (field: string) => {
    dispatch({
      type: "setFieldTouched",
      payload: field
    });
  };

  return { values, errors, touched, handleChange, setTouched };
};

export default useForm;
