import { getFunctions, httpsCallable } from "firebase/functions";

import type { UserRole, Usuario } from "@/model/model";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const functions = getFunctions();

interface CriarUsuarioPayload {
  email: string;
  nome: string;
  role: UserRole;
}

export async function criarUsuario(payload: CriarUsuarioPayload) {
  const criarUsuarioFn = httpsCallable(functions, "criarUsuario");
  return criarUsuarioFn(payload);
}

export async function getUsuarios(): Promise<Usuario[]> {
  const snap = await getDocs(collection(db, "usuarios"));
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as unknown as Usuario,
  );
}

export async function toggleUsuarioAtivo(
  uid: string,
  ativo: boolean,
): Promise<void> {
  await updateDoc(doc(db, "usuarios", uid), {
    ativo,
    atualizadoEm: serverTimestamp(),
  });
}

export async function updateUsuario(
  uid: string,
  dados: Partial<Usuario>,
): Promise<void> {
  await updateDoc(doc(db, "usuarios", uid), {
    ...dados,
    atualizadoEm: serverTimestamp(),
  });
}

export async function deletarUsuario(uid: string): Promise<void> {
  await deleteDoc(doc(db, "usuarios", uid));
}

export async function getUserProfile(uid: string): Promise<Usuario | null> {
  const snap = await getDoc(doc(db, "usuarios", uid));
  if (!snap.exists()) return null;
  return snap.data() as Usuario;
}
