"use client";

import { useActionState } from "react";
import { viewerAccessAction, type ViewerAccessState } from "./actions";

const initialState: ViewerAccessState = { error: "" };

export default function ViewerAccessForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(viewerAccessAction, initialState);

  return (
    <form action={action} className="access-form">
      <input name="slug" type="hidden" value={slug} />
      <label>
        PIN de acceso
        <input
          name="pin"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          autoComplete="one-time-code"
          placeholder="0000"
          required
        />
      </label>
      {state.error && <p className="form-error">{state.error}</p>}
      <button className="access-button" type="submit" disabled={pending}>
        {pending ? "Validando..." : "Ingresar"}
      </button>
    </form>
  );
}
