import type { Usuario } from "@/model/model";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthService = {
  async login(email: string, pass: string): Promise<Usuario> {
    // 1. Autentica no Firebase Auth
    const { user } = await signInWithEmailAndPassword(auth, email, pass);

    // 2. Busca o Perfil no Firestore usando o UID do Auth
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await signOut(auth); // Desloga imediatamente se não encontrar perfil
      throw new Error(
        "Perfil não encontrado no Firestore. Verifique se o UID coincide.",
      );
    }

    const perfil = docSnap.data() as Usuario;

    if (!perfil.ativo) {
      await signOut(auth); // Desloga imediatamente se o usuário estiver desativado
      throw new Error("Este usuário está desativado.");
    }

    return perfil;
  },

  logoutUser(): Promise<void> {
    return signOut(auth);
  },
};
