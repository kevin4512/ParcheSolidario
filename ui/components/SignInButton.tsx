"use client";
import { signInWithGoogle } from "@/modules/domain/auth/firebaseAuth";

export function SignInButton() {
  return (
    <button onClick={() => signInWithGoogle()}>
      Iniciar sesión con Google
    </button>
  );
}