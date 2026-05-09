// components/BlocoCard.tsx
import { useState } from "react";
import { ChevronDown, PencilLine } from "lucide-react";
import type { Bloco, Enfermaria, Leito } from "@/model/model";
import { usePermission } from "@/hooks/usePermission";
import { getOcupacaoColor } from "@/utils/leito-util";
import { InlineEdit } from "./inline-edit";
import { updateBlocoNome } from "@/service/bloco";

interface BlocoCardProps {
  bloco: Bloco;
  enfermarias: Enfermaria[];
  leitos: Leito[];
  onVerLeitos: (enfermaria: Enfermaria) => void;
  onEditarBloco?: (bloco: Bloco) => void;
  onEditarEnfermaria?: (enfermaria: Enfermaria) => void;
}

export function BlocoCard({
  bloco,
  enfermarias,
  leitos,
  onVerLeitos,
  onEditarEnfermaria,
}: BlocoCardProps) {
  const [expandido, setExpandido] = useState(false);
  const isGestao = usePermission(["GESTOR_ADMIN"]);

  // Métricas do bloco — derivadas dos leitos
  const ocupados = leitos.filter((l) => l.status === "OCUPADO").length;
  const disponiveis = leitos.filter((l) => l.status === "DISPONIVEL").length;
  const limpeza = leitos.filter((l) => l.status === "LIMPEZA").length;
  const bloqueados = leitos.filter((l) => l.status === "BLOQUEADO").length;
  const total = leitos.length;
  const taxa = total > 0 ? Math.round((ocupados / total) * 100) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header — clicável para expandir */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpandido((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          {isGestao ? (
            <InlineEdit
              valor={bloco.nome}
              onSalvar={(nome) => updateBlocoNome(bloco.id, nome)}
              className="text-base"
            />
          ) : (
            <span className="font-medium text-base">{bloco.nome}</span>
          )}

          <span
            className={`${getOcupacaoColor(taxa)} text-white text-xs px-2 py-1 rounded-full font-medium`}
          >
            {taxa}% ocupação
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${expandido ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="h-1 bg-gray-100">
        <div
          className={`h-full transition-all duration-500 ${getOcupacaoColor(taxa)}`}
          style={{ width: `${taxa}%` }}
        />
      </div>

      {/* Contadores de status */}
      <div className="flex gap-4 px-4 py-2 border-b border-gray-100">
        <span className="text-xs text-gray-500">
          <b className="text-gray-800">{ocupados}</b> ocupados
        </span>
        <span className="text-xs text-gray-500">
          <b className="text-gray-800">{disponiveis}</b> disponíveis
        </span>
        <span className="text-xs text-gray-500">
          <b className="text-gray-800">{limpeza}</b> limpeza
        </span>
        <span className="text-xs text-gray-500">
          <b className="text-gray-800">{bloqueados}</b> bloqueados
        </span>
        <span className="text-xs text-gray-500">
          <b className="text-gray-800">{total}</b> total
        </span>
      </div>

      {/* Accordion — grid de enfermarias */}
      <div
        className={`transition-all duration-300 overflow-hidden ${expandido ? "max-h-150" : "max-h-0"}`}
      >
        <p className="text-xs text-gray-400 px-4 pt-3 pb-1">
          {enfermarias.length} enfermaria{enfermarias.length !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-3 gap-2 p-3">
          {enfermarias.map((enfermaria) => {
            const leitosEnf = leitos.filter(
              (l) => l.enfermariaId === enfermaria.id,
            );
            const ocEnf = leitosEnf.filter(
              (l) => l.status === "OCUPADO",
            ).length;
            const totalEnf = leitosEnf.length;
            const taxaEnf =
              totalEnf > 0 ? Math.round((ocEnf / totalEnf) * 100) : 0;

            return (
              <div
                key={enfermaria.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-2"
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="text-xs font-medium text-gray-800 leading-tight">
                    {enfermaria.nome}
                  </span>
                  {isGestao && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditarEnfermaria?.(enfermaria);
                      }}
                      className="text-gray-300 hover:text-gray-500 shrink-0"
                    >
                      <PencilLine size={12} />
                    </button>
                  )}
                </div>

                <span className="text-[10px] text-gray-500">
                  {taxaEnf}% ocup.
                </span>

                {/* Mini barra */}
                <div className="h-1 bg-gray-200 rounded-full mt-1 mb-2">
                  <div
                    className={`h-full rounded-full ${getOcupacaoColor(taxaEnf)}`}
                    style={{ width: `${taxaEnf}%` }}
                  />
                </div>

                <button
                  onClick={() => onVerLeitos(enfermaria)}
                  className="w-full text-[10px] font-medium text-[#185FA5] border border-[#185FA5] rounded px-1 py-1 hover:bg-blue-50 transition-colors"
                >
                  Ver leitos
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
