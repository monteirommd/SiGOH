// components/mapa/enfermaria-mapa.tsx
import { memo } from "react";
import type { Enfermaria, Leito } from "@/model/model";
import { sortLeitosByCodigo } from "@/utils/sort";
import LeitoMapa from "./leito-mapa";

interface Props {
  enfermaria: Enfermaria;
  leitos: Leito[];
  compacto: boolean;
  onLeitoClick: (leito: Leito) => void;
}

function EnfermariaMapa({ enfermaria, leitos, compacto, onLeitoClick }: Props) {
  const ordenados = sortLeitosByCodigo(leitos);

  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 truncate">
        {enfermaria.nome}
      </p>
      <div className="flex flex-wrap gap-1">
        {ordenados.map((leito) => (
          <LeitoMapa
            key={leito.id}
            leito={leito}
            compacto={compacto}
            onClick={onLeitoClick}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(EnfermariaMapa);
