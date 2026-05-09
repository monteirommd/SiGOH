// components/GraficoOcupacaoPorBloco.tsx
import type { Bloco, Leito } from "@/model/model";
import { getTaxaOcupacao } from "@/utils/leito-util";
import { getTaxaOcupacaoAssistencialColor } from "@/utils/taxa-classificacao.utils";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  blocos: Bloco[];
  leitos: Leito[];
}

export function GraficoOcupacaoBloco({ blocos, leitos }: Props) {
  const navigate = useNavigate();

  const data = blocos.map((bloco) => {
    const leitosDoBloco = leitos.filter((l) => l.blocoId === bloco.id);
    const ocupados = leitosDoBloco.filter((l) => l.status === "OCUPADO").length;
    const taxa = getTaxaOcupacao(leitosDoBloco);

    return {
      id: bloco.id,
      nome: bloco.nome,
      ocupados,
      taxa,
      total: leitosDoBloco.length,
    };
  });

  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  const handleBarClick = (id: string | undefined) => {
    navigate(`/detalhes/${id}`);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <p className="font-bold mb-3">Taxa de ocupação por Bloco</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, maxTotal]} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const { nome, ocupados, total, taxa } = payload[0].payload;
              return (
                <div className="bg-white border border-gray-200 rounded p-2 shadow text-sm">
                  <p className="font-bold">{nome}</p>
                  <p>Ocupados: {ocupados}</p>
                  <p>Total: {total}</p>
                  <p>Taxa: {taxa}%</p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="ocupados"
            background={{ fill: "transparent" }}
            shape={(props: any) => {
              const { x, y, width, height, payload, background: bg } = props;
              const totalHeight = (payload.total / maxTotal) * bg.height;
              const totalY = bg.y + bg.height - totalHeight;
              const color = getTaxaOcupacaoAssistencialColor(payload?.taxa);
              return (
                <g>
                  <rect
                    x={x}
                    y={totalY}
                    width={width}
                    height={totalHeight}
                    rx={4}
                    ry={4}
                    fill="#e5e7eb"
                  />
                  {height > 0 && (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={4}
                      ry={4}
                      fill={color}
                    />
                  )}
                </g>
              );
            }}
            onClick={(data) => handleBarClick(data.id)}
            style={{ cursor: "pointer" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
