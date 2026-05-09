import { GraficoOcupacaoTemporal } from "@/components/graficos/grafico-ocupacao-temporal";

export function SlideOcupacaoTemporal() {
  return (
    <div className="h-full flex flex-col gap-4">
      <p className="text-gray-800 text-lg tracking-widest uppercase text-center">
        Ocupação ao longo do tempo
      </p>
      <GraficoOcupacaoTemporal />
    </div>
  );
}
