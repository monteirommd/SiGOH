// components/mapa/bloco-mapa.tsx
import { memo, useMemo } from "react";
import type { Bloco, Enfermaria, Leito } from "@/model/model";
import { sortEnfermariasByNome } from "@/utils/sort";
import { getOcupacaoColor } from "@/utils/leito-util";
import EnfermariaMapa from "./enfermaria-mapa";

interface Props {
  bloco: Bloco;
  enfermarias: Enfermaria[];
  leitos: Leito[];
  compacto: boolean;
  onLeitoClick: (leito: Leito) => void;
}

function BlocoMapa({
  bloco,
  enfermarias,
  leitos,
  compacto,
  onLeitoClick,
}: Props) {
  const ocupados = leitos.filter((l) => l.status === "OCUPADO").length;
  const total = leitos.length;
  const taxa = total > 0 ? Math.round((ocupados / total) * 100) : 0;

  const enfOrdenadas = useMemo(
    () => sortEnfermariasByNome(enfermarias),
    [enfermarias],
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-gray-800">{bloco.nome}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">{ocupados}/{total}</span>
          <span
            className={`${getOcupacaoColor(taxa)} text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium`}
          >
            {taxa}%
          </span>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="h-0.5 bg-gray-100 rounded-full mb-3">
        <div
          className={`h-full rounded-full transition-all ${getOcupacaoColor(taxa)}`}
          style={{ width: `${taxa}%` }}
        />
      </div>

      {/* Enfermarias em 2 colunas */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
        {enfOrdenadas.map((enf) => (
          <EnfermariaMapa
            key={enf.id}
            enfermaria={enf}
            leitos={leitos.filter((l) => l.enfermariaId === enf.id)}
            compacto={compacto}
            onLeitoClick={onLeitoClick}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(BlocoMapa);
