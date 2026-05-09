import type { FieldValue, Timestamp } from "firebase/firestore";

// FieldValue só é válido para operações de escrita no Firestore (ex: serverTimestamp()).
// Modelos de leitura nunca recebem FieldValue — o servidor já resolve para Timestamp.

export type StatusLeito = "OCUPADO" | "LIMPEZA" | "DISPONIVEL" | "BLOQUEADO";

export interface Leito {
  id: string;
  codigo: string;
  enfermariaId: string;
  blocoId: string;
  status: StatusLeito;
  ativo: boolean;
  ultimaAtualizacao?: Timestamp | FieldValue;
  atualizadoPor?: string | null;
}

export interface Bloco {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface Enfermaria {
  id: string;
  nome: string;
  ativo: boolean;
  blocoId: string;
  exibirResumo?: boolean;
}

export type UserRole = "TECNICO" | "GESTOR_BASE" | "GESTOR_ADMIN";

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  ativo: boolean;
}

export interface HistoricoLeito {
  id: string;
  leitoId: string;
  statusAnterior: StatusLeito;
  statusNovo: StatusLeito;
  uid: string;
  nomeUsuario: string;
  timestamp: Timestamp | Date;
}

export type LayoutMode = "split" | "graficos" | "leitos" | "mapa";

export const PROXIMO_STATUS: Record<StatusLeito, StatusLeito> = {
  DISPONIVEL: "OCUPADO",
  OCUPADO: "LIMPEZA",
  LIMPEZA: "DISPONIVEL",
  BLOQUEADO: "BLOQUEADO",
};
