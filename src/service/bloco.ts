import type { Bloco, Enfermaria } from "@/model/model";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getBlocos(): Promise<Bloco[]> {
  const q = query(collection(db, "blocos"), where("ativo", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as Bloco);
}

export async function getBlocosInativos(): Promise<Bloco[]> {
  const q = query(collection(db, "blocos"), where("ativo", "==", false));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as Bloco);
}

export async function getBlocoById(id: string): Promise<Bloco | null> {
  const docRef = doc(db, "blocos", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as unknown as Bloco;
}

export async function getEnfermariasByBloco(
  blocoId: string,
): Promise<Enfermaria[]> {
  const q = query(
    collection(db, "enfermarias"),
    where("blocoId", "==", blocoId),
    where("ativo", "==", true),
  );
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as unknown as Enfermaria,
  );
}

export async function updateBlocoNome(id: string, nome: string): Promise<void> {
  updateDoc(doc(db, "blocos", id), { nome, atualizadoEm: serverTimestamp() });
}

export async function updateEnfermariaNome(
  id: string,
  nome: string,
): Promise<void> {
  updateDoc(doc(db, "enfermarias", id), {
    nome,
    atualizadoEm: serverTimestamp(),
  });
}
