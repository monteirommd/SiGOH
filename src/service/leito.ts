import {
  PROXIMO_STATUS,
  type HistoricoLeito,
  type Leito,
  type StatusLeito,
} from "@/model/model";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Unsubscribe } from "firebase/auth";

const leitoConverter: FirestoreDataConverter<Leito> = {
  toFirestore: (leito) => leito,
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    ({ id: snap.id, ...snap.data() }) as unknown as Leito,
};

// Tela Técnico

export async function getLeitosByEnfermaria(
  enfermariaId: string,
): Promise<Leito[]> {
  const q = query(
    collection(db, "leitos").withConverter(leitoConverter),
    where("enfermariaId", "==", enfermariaId),
  );
  const snap = getDocs(q);
  return (await snap).docs.map((d) => d.data());
}

export async function getLeitosByBloco(blocoId: string): Promise<Leito[]> {
  const q = query(
    collection(db, "leitos").withConverter(leitoConverter),
    where("blocoId", "==", blocoId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

interface toggleLeitoStatusPayload {
  leitoId: string;
  currentStatus: StatusLeito;
  uid: string;
  nomeUsuario: string;
}

export async function toggleLeitoStatus({
  leitoId,
  currentStatus,
  uid,
  nomeUsuario,
}: toggleLeitoStatusPayload): Promise<void> {
  const proximo = PROXIMO_STATUS[currentStatus];

  if (!proximo) throw new Error("Falha ao determinar próximo status");

  return updateLeitoStatus({
    leitoId,
    novoStatus: proximo, // A lógica de rotação decide aqui
    uid,
    nomeUsuario,
  });
}
// dashboard (real time)

export function subscribeToLeitosByBloco(
  blocoId: string,
  onChange: (leitos: Leito[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, "leitos").withConverter(leitoConverter),
    where("blocoId", "==", blocoId),
  );
  return onSnapshot(q, (snap) => {
    const leitos = snap.docs.map((d) => d.data());
    onChange(leitos);
  });
}

export async function getHistoricoLeito(
  leitoId: string,
): Promise<HistoricoLeito[]> {
  const q = query(
    collection(db, "historico_leitos"),
    where("leitoId", "==", leitoId),
    orderBy("timestamp", "desc"),
    limit(20),
  );
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as unknown as HistoricoLeito,
  );
}

// Atualizar status do leito

interface UpdateLeitosPayload {
  leitoId: string;
  novoStatus: StatusLeito;
  uid: string;
  nomeUsuario: string;
}

export async function updateLeitoStatus({
  leitoId,
  novoStatus,
  uid,
  nomeUsuario,
}: UpdateLeitosPayload): Promise<void> {
  const leitoRef = doc(db, "leitos", leitoId);
  const historicoRef = collection(db, "historico_leitos");

  await runTransaction(db, async (transaction) => {
    const leitoSnap = await transaction.get(leitoRef);
    if (!leitoSnap.exists()) throw new Error("Leito não encontrado");

    const dados = leitoSnap.data();
    const statusAnterior = dados.status;
    const isBloqueado = dados.bloqueado;

    // Se estiver bloqueado, nada altera via transação comum
    if (isBloqueado) throw new Error("Leito bloqueado");

    if (statusAnterior === novoStatus) return;

    // 1. Atualiza o Leito
    transaction.update(leitoRef, {
      status: novoStatus,
      atualizadoEm: serverTimestamp(),
      atualizadoPor: uid,
    });

    // 2. Grava Histórico (Mantendo seu padrão)
    const novoHistoricoRef = doc(historicoRef);
    transaction.set(novoHistoricoRef, {
      leitoId,
      statusAnterior,
      statusNovo: novoStatus,
      uid,
      nomeUsuario,
      timestamp: serverTimestamp(),
    });
  });
}
