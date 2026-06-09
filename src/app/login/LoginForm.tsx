"use client";

import { useActionState } from "react";
import PasswordField from "@/components/PasswordField";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: "" };

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="access-form">
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <PasswordField
        autoComplete="current-password"
        label="Contraseña"
        name="password"
        required
      />
      {state.error && <p className="form-error">{state.error}</p>}
      <button className="access-button" type="submit" disabled={pending}>
        {pending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
