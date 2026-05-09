import type { Bloco, Enfermaria, LayoutMode, Leito } from "@/model/model";
import GraficoOcupacaoGeral from "../graficos/grafico-ocupacao-geral";
import { GraficoOcupacaoBloco } from "../graficos/grafico-ocupacao-bloco";
import ResumoBloco from "../resumo-bloco";

interface ViewGraficosProps {
  bloco: Bloco[];
  enfermarias: Enfermaria[];
  leitos: Leito[];
  layout: LayoutMode;
}

export function ViewGraficos({
  bloco,
  enfermarias,
  leitos,
  layout,
}: ViewGraficosProps) {
  return (
    <div className="flex flex-col gap-2">
      <GraficoOcupacaoGeral leitos={leitos} />
      {layout === "graficos" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <GraficoOcupacaoBloco blocos={bloco} leitos={leitos} />
          </div>
          <ResumoBloco
            blocos={bloco}
            enfermarias={enfermarias}
            leitos={leitos}
          />
        </div>
      )}
      {layout === "split" && (
        <div>
          <GraficoOcupacaoBloco blocos={bloco} leitos={leitos} />
          <ResumoBloco
            blocos={bloco}
            enfermarias={enfermarias}
            leitos={leitos}
          />
        </div>
      )}
    </div>
  );
}

export default ViewGraficos;
