import useForm, { FieldValidation } from "./useForm";

const data = {
  name: "Joe",
  age: 48,
  state: "",
  isAdmin: false
};

const validation: FieldValidation[] = [
  {
    fieldName: "name",
    validations: {
      required: true,
      min: 2,
      max: 16,
      match: /^([a-zA-Z])/
    }
  },
  {
    fieldName: "state",
    validations: {
      required: true,
      min: 2,
      max: 16,
      match: /^([a-zA-Z])/
    }
  }
];

// const fields = [
//   { label: "Name", accessor: "name", isRequired: true },
//   { label: "Age", accessor: "age", isRequired: true },
//   { label: "Admin", accessor: "isAdmin", isRequired: false }
// ];

const Form = () => {
  const { values, errors, handleChange, setTouched } = useForm(
    data,
    validation
  );

  console.log("errors: ", errors);

  return (
    <form>
      <input
        type="text"
        value={(values["name"] as string) || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        onBlur={(e) => setTouched("name")}
      />
      <input
        type="number"
        value={(values["age"] as number) || ""}
        onChange={(e) => handleChange("age", e.target.value)}
        onBlur={(e) => setTouched("name")}
      />
      <input
        type="text"
        value={(values["state"] as string) || ""}
        onChange={(e) => handleChange("state", e.target.value)}
        onBlur={(e) => setTouched("state")}
      />

      <input
        type="checkbox"
        checked={(values["isAdmin"] as boolean) || false}
        onChange={(e) => handleChange("isAdmin", e.target.checked)}
        onBlur={(e) => setTouched("name")}
      />
    </form>
  );
};

export default Form;
