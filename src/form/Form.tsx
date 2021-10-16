import useForm from "./useForm";

const data = {
  name: "Joe",
  age: 48,
  isAdmin: false
};

const fields = [
  { label: "Name", accessor: "name", isRequired: true },
  { label: "Age", accessor: "age", isRequired: true },
  { label: "Admin", accessor: "isAdmin", isRequired: false }
];

const Form = () => {
  const { values, errors, touched, handleChange, setTouched } = useForm(
    data,
    fields
  );

  console.log("values: ", values);
  console.log("touched: ", touched);

  return (
    <form>
      <input
        type="text"
        value={(values["name"] as string) || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        onFocus={(e) => setTouched("name")}
      />
      <input
        type="number"
        value={(values["age"] as number) || ""}
        onChange={(e) => handleChange("age", e.target.value)}
        onFocus={(e) => setTouched("name")}
      />
      <input
        type="checkbox"
        checked={(values["isAdmin"] as boolean) || false}
        onChange={(e) => handleChange("isAdmin", e.target.checked)}
        onFocus={(e) => setTouched("name")}
      />
    </form>
  );
};

export default Form;
