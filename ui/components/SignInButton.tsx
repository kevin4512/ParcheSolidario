"use client";
import { useCases } from "@/app/di";

export function SignInButton() {
  return (
    <button onClick={() => useCases.signInWithGoogle()}>
      Iniciar sesión con Google
    </button>
  );
}