"use client";

import { useActionState } from "react";
import { createAccessAction, type CreateAccessState } from "./actions";

const initialState: CreateAccessState = { error: "" };

export default function CreateAccessForm() {
  const [state, action, pending] = useActionState(createAccessAction, initialState);

  return (
    <div>
      <form action={action} className="panel-form access-generator-form">
        <label>
          Nombre o alias del inversor
          <input name="viewer_name" required />
        </label>
        <label>
          Email opcional
          <input name="viewer_email" type="email" />
        </label>
        <label>
          Vencimiento
          <select name="expires_days" defaultValue="7">
            <option value="1">1 día</option>
            <option value="3">3 días</option>
            <option value="7">7 días</option>
            <option value="14">14 días</option>
            <option value="30">30 días</option>
          </select>
        </label>
        <label>
          Máximo de usos
          <input name="max_uses" type="number" min="1" max="20" defaultValue="3" required />
        </label>
        {state.error && <p className="form-error">{state.error}</p>}
        <button className="panel-button" type="submit" disabled={pending}>
          {pending ? "Generando..." : "Generar acceso"}
        </button>
      </form>
      {state.pin && state.link && (
        <div className="one-time-access">
          <span className="one-time-kicker">Acceso listo para compartir</span>
          <p>Este PIN se muestra una sola vez. Copialo antes de cerrar.</p>
          <div className="one-time-details">
            <div>
              <small>PIN de 4 dígitos</small>
              <strong>{state.pin}</strong>
            </div>
            <div>
              <small>Link único</small>
              <code>{state.link}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
