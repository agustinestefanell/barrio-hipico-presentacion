"use client";

import { useId, useState, type InputHTMLAttributes } from "react";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export default function PasswordField({
  label,
  id,
  ...inputProps
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field-group">
      <label htmlFor={inputId}>{label}</label>
      <div className="password-field">
        <input
          {...inputProps}
          id={inputId}
          type={visible ? "text" : "password"}
        />
        <button
          aria-controls={inputId}
          aria-label={visible ? `Ocultar ${label.toLowerCase()}` : `Ver ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="password-toggle"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? "Ocultar" : "Ver"}
        </button>
      </div>
    </div>
  );
}
