// service/snapshot.ts
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface SnapshotOcupacao {
  id: string;
  timestamp: Timestamp;
  dia: string;
  hora: number;
  totalLeitos: number;
  totalOcupados: number;
  taxaGeral: number;
  blocos: {
    blocoId: string;
    nome: string;
    ocupados: number;
    total: number;
    taxa: number;
  }[];
}

export type PeriodoSnapshot = "hoje" | "7dias" | "30dias";

export type StatusSnapshotRequest = "pending" | "done" | "error";

interface SnapshotRequest {
  uid: string;
  status: StatusSnapshotRequest;
  requestedAt: Timestamp;
  processadoEm?: Timestamp;
  errorMessage?: string;
}

// ── Leitura ───────────────────────────────────────────────────────────────────

export async function getSnapshots(
  periodo: PeriodoSnapshot,
): Promise<SnapshotOcupacao[]> {
  const agora = new Date();
  const inicio = new Date();

  if (periodo === "hoje") inicio.setHours(0, 0, 0, 0);
  if (periodo === "7dias") inicio.setDate(agora.getDate() - 7);
  if (periodo === "30dias") inicio.setDate(agora.getDate() - 30);

  const q = query(
    collection(db, "snapshots_ocupacao"),
    where("timestamp", ">=", Timestamp.fromDate(inicio)),
    orderBy("timestamp", "asc"),
    limit(periodo === "hoje" ? 24 : periodo === "7dias" ? 168 : 720),
  );

  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as unknown as SnapshotOcupacao,
  );
}

// ── Snapshot manual via documento Firestore ───────────────────────────────────
//
// Em vez de chamar um callable (que exige CORS + IAM no Cloud Run),
// o cliente escreve um documento de "solicitação" em snapshot_requests.
// A Cloud Function reage ao onCreate e processa de forma assíncrona.
// O cliente escuta o documento até o status mudar para "done" ou "error".

export async function solicitarSnapshotManual(uid: string): Promise<string> {
  const ref = await addDoc(collection(db, "snapshot_requests"), {
    uid,
    status: "pending" as StatusSnapshotRequest,
    requestedAt: serverTimestamp(),
  });
  return ref.id;
}

// Retorna um unsubscribe para o caller cancelar a escuta se necessário
// (ex: componente desmontado antes da resposta chegar)
export function aguardarSnapshotProcessado(
  requestId: string,
  onDone: () => void,
  onError: (message: string) => void,
): () => void {
  const requestRef = doc(db, "snapshot_requests", requestId);

  const unsubscribe = onSnapshot(requestRef, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data() as SnapshotRequest;

    if (data.status === "done") {
      unsubscribe();
      onDone();
    } else if (data.status === "error") {
      unsubscribe();
      onError(data.errorMessage ?? "Erro desconhecido ao gerar snapshot.");
    }
  });

  return unsubscribe;
}
