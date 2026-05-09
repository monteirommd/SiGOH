import type { Leito } from "@/model/model";
import { getTaxaOcupacao } from "@/utils/leito-util";
import {
  getTaxaOcupacaoGeralColor,
  getTaxaOcupacaoGeralLabel,
} from "@/utils/taxa-classificacao.utils";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function GraficoOcupacaoGeral({ leitos }: { leitos: Leito[] }) {
  const ocupados = leitos.filter((l) => l.status === "OCUPADO").length;
  const disponiveis = leitos.filter((l) => l.status === "DISPONIVEL").length;
  const taxa = getTaxaOcupacao(leitos);

  const data = [
    { fill: "#374151", name: "Ocupados", value: ocupados },
    { fill: "#22c55e", name: "Disponiveis", value: disponiveis },
  ];

  return (
    <div
      className={`${getTaxaOcupacaoGeralColor(taxa)} rounded-xl p-4 shadow-md`}
    >
      <p className=" text-white ">Taxa de ocupação hospitalar geral</p>
      <div className="flex justify-between items-center">
        <div className="">
          <h2 className=" text-white font-bold text-6xl">
            {taxa}% - {getTaxaOcupacaoGeralLabel(taxa)}
          </h2>
          <p className=" text-white font-medium text-lg">
            {ocupados} de {leitos.length} leitos ocupados
          </p>
        </div>
        <ResponsiveContainer width={100} height={100}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={45}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoOcupacaoGeral;
