// views/view-leitos.tsx
import React from "react";
import type { Bloco, Enfermaria, Leito } from "@/model/model";
import { BlocoCard } from "../bloco-card";

interface ViewLeitosProps {
  blocos: Bloco[];
  enfermariasByBloco: Map<string, Enfermaria[]>;
  leitosByBloco: Map<string, Leito[]>;
  onVerLeitos: (enfermaria: Enfermaria) => void;
  onEditarBloco?: (bloco: Bloco) => void;
  onEditarEnfermaria?: (enfermaria: Enfermaria) => void;
  colunas?: number;
}

function ViewLeitos({
  blocos,
  enfermariasByBloco,
  leitosByBloco,
  onVerLeitos,
  onEditarBloco,
  onEditarEnfermaria,
  colunas = 2,
}: ViewLeitosProps) {
  const cols = Array.from({ length: colunas }, (_, i) =>
    blocos.filter((_, j) => j % colunas === i),
  );
  return (
    <div className="flex gap-3 items-start">
      {cols.map((blocosCol, i) => (
        <div key={i} className="flex flex-col gap-3 flex-1">
          {blocosCol.map((bloco) => (
            <BlocoCard
              key={bloco.id}
              bloco={bloco}
              enfermarias={enfermariasByBloco.get(bloco.id) ?? []} // O(1)
              leitos={leitosByBloco.get(bloco.id) ?? []} // O(1)
              onVerLeitos={onVerLeitos}
              onEditarBloco={onEditarBloco}
              onEditarEnfermaria={onEditarEnfermaria}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default React.memo(ViewLeitos);
