"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import PasswordField from "@/components/PasswordField";
import {
  resetPasswordAction,
  requestPasswordRecoveryAction,
  type ResetPasswordState,
} from "./actions";

const initialState: ResetPasswordState = { error: "", success: false };

function RequestRecoveryForm() {
  const [state, action, pending] = useActionState(requestPasswordRecoveryAction, initialState);

  if (state.success) {
    return (
      <div className="registration-success" role="status">
        <strong>Email enviado</strong>
        <p>
          Si el email ingresado está registrado, vas a recibir un link para restablecer tu
          contraseña. Revisá tu casilla.
        </p>
        <Link className="access-button" href="/login">Volver al login</Link>
      </div>
    );
  }

  return (
    <form action={action} className="access-form">
      <label>
        Email
        <input autoComplete="email" name="email" type="email" required />
      </label>
      {state.error && <p className="form-error">{state.error}</p>}
      <button className="access-button" disabled={pending} type="submit">
        {pending ? "Enviando..." : "Enviar link de recuperación"}
      </button>
    </form>
  );
}

function SetNewPasswordForm() {
  const [state, action, pending] = useActionState(resetPasswordAction, initialState);

  if (state.success) {
    return (
      <div className="registration-success" role="status">
        <strong>Contraseña actualizada</strong>
        <p>Tu contraseña fue actualizada correctamente. Ya podés ingresar.</p>
        <Link className="access-button" href="/login">Ir al login</Link>
      </div>
    );
  }

  return (
    <form action={action} className="access-form">
      <PasswordField
        autoComplete="new-password"
        label="Nueva contraseña"
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
        {pending ? "Actualizando..." : "Actualizar contraseña"}
      </button>
    </form>
  );
}

function PageContent() {
  const searchParams = useSearchParams();
  const isSetMode = searchParams.get("mode") === "set";

  return (
    <main className="access-shell login-shell">
      <section className="access-card">
        <div className="access-brand" aria-hidden="true">
          <span>BH</span>
          <small>Barrio Hípico · Canelones</small>
        </div>
        <p className="eyebrow">Acceso privado</p>
        <h1>{isSetMode ? "Nueva contraseña" : "Recuperar contraseña"}</h1>
        <p className="access-lead">
          {isSetMode
            ? "Ingresá tu nueva contraseña."
            : "Ingresá tu email y te enviamos un link para restablecer tu contraseña."}
        </p>

        {isSetMode ? <SetNewPasswordForm /> : <RequestRecoveryForm />}

        <Link className="access-secondary-link" href="/login">Volver al login</Link>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
