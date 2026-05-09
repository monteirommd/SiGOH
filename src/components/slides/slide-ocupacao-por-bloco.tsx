// slides/slide-ocupacao-por-bloco.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useAppData } from "@/context/app-data-context";

export function SlideOcupacaoPorBloco() {
  const { blocos, leitos } = useAppData();
  const data = blocos.map((bloco) => {
    const l = leitos.filter((l) => l.blocoId === bloco.id);
    const ocupados = l.filter((l) => l.status === "OCUPADO").length;
    const taxa = l.length > 0 ? Math.round((ocupados / l.length) * 100) : 0;
    return { nome: bloco.nome, ocupados, total: l.length, taxa };
  });

  return (
    <div className="h-full flex flex-col gap-6">
      <p className="text-gray-800 text-lg tracking-widest uppercase text-center">
        Ocupação por Bloco
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            vertical={false}
          />
          <XAxis dataKey="nome" tick={{ fill: "#3a3a3a", fontSize: 14 }} />
          <YAxis tick={{ fill: "#3a3a3a", fontSize: 14 }} />
          <Tooltip
            contentStyle={{
              background: "#e0e0e0",
              border: "none",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#3a3a3a" }}
            itemStyle={{ color: "#3a3a3a" }}
          />
          <Bar dataKey="ocupados" fill="#185FA5" radius={[6, 6, 0, 0]}>
            <LabelList
              dataKey="taxa"
              position="top"
              style={{ fill: "#3a3a3a", fontSize: 13 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
