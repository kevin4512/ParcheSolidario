// Archivo: modules/domain/auth/firebaseAuth.tsx
// Este archivo contiene funciones asíncronas para autenticación con Google usando Firebase Authentication.
// Centraliza la lógica de autenticación para mantener el código organizado y reutilizable.

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
// Importamos los métodos principales de autenticación de Firebase:
// - getAuth: obtiene la instancia de autenticación
// - signInWithPopup: permite iniciar sesión con un popup
// - GoogleAuthProvider: proveedor de Google para autenticación
// - signOut: cierra la sesión del usuario

import { firebaseApp } from "../../../firebase/clientApp";
// Importamos la instancia de la app de Firebase que ya debe estar configurada en tu proyecto.
// El nombre debe coincidir con el export de 'firebase/clientApp.ts':
// export const firebaseApp = ...

const auth = getAuth(firebaseApp);
// Obtenemos la instancia de autenticación usando la instancia correcta de Firebase.

// Función asíncrona para iniciar sesión con Google
export async function signInWithGoogle() {
  // Creamos una instancia del proveedor de Google
  const provider = new GoogleAuthProvider();
  try {
    // Abrimos el popup para que el usuario inicie sesión con Google
    // Esto abrirá una ventana emergente donde el usuario podrá seleccionar su cuenta de Google
    const result = await signInWithPopup(auth, provider);
    // result.user contiene la información del usuario autenticado
    return result.user;
  } catch (error) {
    // Si ocurre un error, lo lanzamos para que el componente lo maneje
    throw error;
  }
}

// Función asíncrona para cerrar sesión
export async function logout() {
  try {
    // Llamamos a signOut para cerrar la sesión del usuario actual
    await signOut(auth);
  } catch (error) {
    // Si ocurre un error al cerrar sesión, lo lanzamos
    throw error;
  }
}
