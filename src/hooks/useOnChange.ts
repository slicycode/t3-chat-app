import { useState } from "react";

export default function useOnChange(initialValues: { [key: string]: string }) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValues((values) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  return {
    values,
    setValues,
    handleChange,
  };
}
