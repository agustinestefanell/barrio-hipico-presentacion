"use client";

import { useEffect, useRef, useState } from "react";

type CopyButtonProps = {
  path: `/${string}`;
  label: string;
};

export default function CopyButton({ path, label }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 2200);
  }

  const buttonText =
    status === "copied" ? "Copiado" : status === "error" ? "Reintentar" : "Copiar link";

  return (
    <button
      aria-label={label}
      className={`copy-link-button${status === "copied" ? " is-copied" : ""}`}
      onClick={copyLink}
      title={label}
      type="button"
    >
      {buttonText}
    </button>
  );
}
