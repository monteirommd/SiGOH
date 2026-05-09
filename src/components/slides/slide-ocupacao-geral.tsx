// slides/slide-ocupacao-geral.tsx
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAppData } from "@/context/app-data-context";

export function SlideOcupacaoGeral() {
  const { leitos } = useAppData();
  const ocupados = leitos.filter((l) => l.status === "OCUPADO").length;
  const total = leitos.length;
  const taxa = total > 0 ? Math.round((ocupados / total) * 100) : 0;
  const disponiveis = total - ocupados;

  const data = [
    { name: "Ocupados", value: ocupados },
    { name: "Disponíveis", value: disponiveis },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center gap-8">
      <p className="text-gray-900 text-lg tracking-widest uppercase">
        Taxa de Ocupação Hospitalar
      </p>
      <div className="relative w-72 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={130}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="#22c55e" />
              <Cell fill="#1f2937" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Número no centro do donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-black text-7xl font-bold">{taxa}%</span>
        </div>
      </div>
      <p className="text-gray-400 text-xl">
        <span className="text-black font-semibold">{ocupados}</span> de{" "}
        <span className="text-black font-semibold">{total}</span> leitos
        ocupados
      </p>
    </div>
  );
}
