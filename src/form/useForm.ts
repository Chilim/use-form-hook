import React from "react";

type FieldValue = string | number | boolean | undefined;

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
  initalValues: FormDataType;
  errors: FormDataType;
  values: FormDataType;
  touched: FormDataType;
}

const reducer = (state: FormState, action: ActionType) => {
  switch (action.type) {
    case "initialize": {
      const pattern = Object.keys(action.payload).reduce(
        (acc, key) => ({
          ...acc,
          [key]: ""
        }),
        {}
      );
      const formValues = Object.assign(pattern, action.payload);
      const touched = Object.keys(action.payload).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false
        }),
        {}
      );
      return {
        ...state,
        initalValues: action.payload,
        errors: pattern,
        touched,
        values: formValues
      };
    }
    case "setFieldValue": {
      const { fieldName, fieldValue } = action.payload;
      return { ...state, values: { ...state.values, [fieldName]: fieldValue } };
    }

    case "setFieldTouched": {
      return {
        ...state,
        touched: { ...state.touched, [action.payload]: true }
      };
    }
  }
};

const useForm = (initData: FormDataType, fields) => {
  const [{ errors, touched, values }, dispatch] = React.useReducer(reducer, {
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
