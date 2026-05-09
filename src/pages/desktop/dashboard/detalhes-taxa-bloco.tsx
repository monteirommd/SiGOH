import { useParams, useNavigate } from "react-router-dom";
import { useAppData } from "@/context/app-data-context";
import { GraficoOcupacaoTemporal } from "@/components/graficos/grafico-ocupacao-temporal";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function DetalhesTaxaBloco() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blocos } = useAppData();

  const bloco = blocos.find((b) => b.id === id);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-3 px-6 py-4 shadow-md border-b">
        <Button
          size="icon"
          variant="outline"
          onClick={() => navigate("/dashboard?view=graficos")}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 className="font-bold text-xl">
          {bloco ? bloco.nome : "Bloco"}
          <span className="text-gray-400 font-normal text-base ml-2">
            — Ocupação ao longo do tempo
          </span>
        </h1>
      </div>

      <div className="flex-1 overflow-auto py-6 px-8">
        {id && <GraficoOcupacaoTemporal blocoId={id} />}
      </div>
    </div>
  );
}

export default DetalhesTaxaBloco;
