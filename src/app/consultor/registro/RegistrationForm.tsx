"use client";

import Link from "next/link";
import { useActionState } from "react";
import PasswordField from "@/components/PasswordField";
import {
  registerConsultantAction,
  type ConsultantRegistrationState,
} from "./actions";

const initialState: ConsultantRegistrationState = { error: "", success: false };

export default function RegistrationForm({ isOwner }: { isOwner: boolean }) {
  const [state, action, pending] = useActionState(registerConsultantAction, initialState);

  if (state.success) {
    return (
      <>
        <div className="registration-success" role="status">
          <strong>Solicitud enviada</strong>
          <p>
            Tu solicitud fue enviada. El Owner debe aprobar tu cuenta antes de que puedas
            generar accesos.
          </p>
          <Link className="access-button" href="/login">Volver al login</Link>
        </div>
        {isOwner && (
          <Link className="access-secondary-link" href="/admin">Volver al Panel Owner</Link>
        )}
      </>
    );
  }

  return (
    <>
      <form action={action} className="access-form">
        <label>
          Nombre completo
          <input autoComplete="name" name="full_name" required />
        </label>
        <label>
          Email
          <input autoComplete="email" name="email" type="email" required />
        </label>
        <PasswordField
          autoComplete="new-password"
          label="Contraseña"
          minLength={8}
          name="password"
          required
        />
        <PasswordField
          autoComplete="new-password"
          label="Confirmar contraseña"
          minLength={8}
          name="password_confirmation"
          required
        />
        {state.error && <p className="form-error">{state.error}</p>}
        <button className="access-button" disabled={pending} type="submit">
          {pending ? "Enviando..." : "Solicitar acceso"}
        </button>
      </form>

      {isOwner ? (
        <Link className="access-secondary-link" href="/admin">Volver al Panel Owner</Link>
      ) : (
        <Link className="access-secondary-link" href="/login">Volver al login</Link>
      )}
    </>
  );
}
