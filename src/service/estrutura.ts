// service/estrutura.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Blocos ────────────────────────────────────────────
export async function criarBloco(nome: string): Promise<string> {
  const ref = await addDoc(collection(db, "blocos"), {
    nome,
    ativo: true,
    criadoEm: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBloco(
  id: string,
  dados: { nome?: string; ativo?: boolean },
) {
  await updateDoc(doc(db, "blocos", id), {
    ...dados,
    atualizadoEm: serverTimestamp(),
  });
}

export async function deletarBloco(id: string) {
  await deleteDoc(doc(db, "blocos", id));
}

// ── Enfermarias ───────────────────────────────────────
export async function criarEnfermaria(
  nome: string,
  blocoId: string,
): Promise<string> {
  const ref = await addDoc(collection(db, "enfermarias"), {
    nome,
    blocoId,
    ativo: true,
    criadoEm: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEnfermaria(
  id: string,
  dados: { nome?: string; ativo?: boolean },
) {
  await updateDoc(doc(db, "enfermarias", id), {
    ...dados,
    atualizadoEm: serverTimestamp(),
  });
}

export async function deletarEnfermaria(id: string) {
  await deleteDoc(doc(db, "enfermarias", id));
}

// ── Leitos ────────────────────────────────────────────
export async function criarLeito(
  codigo: string,
  enfermariaId: string,
  blocoId: string,
): Promise<string> {
  const ref = await addDoc(collection(db, "leitos"), {
    codigo,
    enfermariaId,
    blocoId,
    status: "DISPONIVEL",
    atualizadoEm: serverTimestamp(),
    atualizadoPor: null,
  });
  return ref.id;
}

export async function updateLeito(
  id: string,
  dados: { codigo?: string; ativo?: boolean },
) {
  await updateDoc(doc(db, "leitos", id), {
    ...dados,
    atualizadoEm: serverTimestamp(),
  });
}

export async function deletarLeito(id: string) {
  await deleteDoc(doc(db, "leitos", id));
}
