// components/mapa/leito-historico-sheet.tsx
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Leito, HistoricoLeito } from "@/model/model";
import { getHistoricoLeito } from "@/service/leito";
import { Timestamp } from "firebase/firestore";

interface Props {
  leito: Leito | null;
  open: boolean;
  onClose: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  DISPONIVEL: "Disponível",
  OCUPADO: "Ocupado",
  LIMPEZA: "Limpeza",
  BLOQUEADO: "Bloqueado",
  MANUTENCAO: "Manutenção",
};

const STATUS_COLOR: Record<string, string> = {
  DISPONIVEL: "text-green-700 bg-green-50",
  OCUPADO: "text-red-700 bg-red-50",
  LIMPEZA: "text-amber-700 bg-amber-50",
  BLOQUEADO: "text-gray-600 bg-gray-100",
  MANUTENCAO: "text-purple-700 bg-purple-50",
};

function formatarData(ts: Timestamp): string {
  return ts.toDate().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeitoHistoricoSheet({ leito, open, onClose }: Props) {
  const [historico, setHistorico] = useState<HistoricoLeito[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!leito || !open) return;
    setLoading(true);
    getHistoricoLeito(leito.id)
      .then(setHistorico)
      .finally(() => setLoading(false));
  }, [leito, open]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[380px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Leito {leito?.codigo}</SheetTitle>
          {leito && (
            <span
              className={`${STATUS_COLOR[leito.status]} text-xs px-2 py-1 rounded-full w-fit font-medium`}
            >
              {STATUS_LABEL[leito.status]}
            </span>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-auto mt-4">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Carregando histórico...
            </p>
          ) : historico.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Sem histórico registrado
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {historico.map((h) => (
                <div
                  key={h.id}
                  className="border border-gray-100 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`${STATUS_COLOR[h.statusAnterior ?? ""]} text-[10px] px-1.5 py-0.5 rounded font-medium`}
                    >
                      {STATUS_LABEL[h.statusAnterior ?? ""] ?? h.statusAnterior}
                    </span>
                    <span className="text-gray-300 text-xs">→</span>
                    <span
                      className={`${STATUS_COLOR[h.statusNovo ?? ""]} text-[10px] px-1.5 py-0.5 rounded font-medium`}
                    >
                      {STATUS_LABEL[h.statusNovo ?? ""] ?? h.statusNovo}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{h.nomeUsuario}</p>
                  <p className="text-[10px] text-gray-400">
                    {h.timestamp instanceof Timestamp
                      ? formatarData(h.timestamp)
                      : new Date(h.timestamp).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
