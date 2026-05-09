// slides/slide-resumo-tabela.tsx — reaproveita o ResumoBloco com tema escuro
import { getOcupacaoColor } from "@/utils/leito-util";
import { useMemo } from "react";
import { useAppData } from "@/context/app-data-context";

export function SlideResumoTabela() {
  const { blocos, leitos } = useAppData();
  const rows = useMemo(
    () =>
      blocos.map((bloco) => {
        const l = leitos.filter((l) => l.blocoId === bloco.id);
        const ocupado = l.filter((l) => l.status === "OCUPADO").length;
        const disponivel = l.filter((l) => l.status === "DISPONIVEL").length;
        const limpeza = l.filter((l) => l.status === "LIMPEZA").length;
        const bloqueado = l.filter((l) => l.status === "BLOQUEADO").length;
        const total = l.length;
        const taxa = total > 0 ? Math.round((ocupado / total) * 100) : 0;
        return { bloco, ocupado, disponivel, limpeza, bloqueado, total, taxa };
      }),
    [blocos, leitos],
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <p className="text-gray-800 text-lg tracking-widest uppercase text-center">
        Resumo por Bloco
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-900 border-b border-gray-800 text-base">
            <th className="text-left py-3 font-medium">Bloco</th>
            <th className="text-center py-3 font-medium">Ocupado</th>
            <th className="text-center py-3 font-medium">Disponível</th>
            <th className="text-center py-3 font-medium">Limpeza</th>
            <th className="text-center py-3 font-medium">Bloqueado</th>
            <th className="text-center py-3 font-medium">Total</th>
            <th className="text-center py-3 font-medium">Taxa</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(
            ({
              bloco,
              ocupado,
              disponivel,
              limpeza,
              bloqueado,
              total,
              taxa,
            }) => (
              <tr key={bloco.id} className="border-b border-gray-800 text-base">
                <td className="py-4 text-black font-medium">{bloco.nome}</td>
                <td className="py-4 text-center text-gray-800">{ocupado}</td>
                <td className="py-4 text-center text-gray-800">{disponivel}</td>
                <td className="py-4 text-center text-gray-800">{limpeza}</td>
                <td className="py-4 text-center text-gray-800">{bloqueado}</td>
                <td className="py-4 text-center text-black font-semibold">
                  {total}
                </td>
                <td className="py-4 text-center">
                  <span
                    className={`${getOcupacaoColor(taxa)} text-white text-xs px-3 py-1 rounded-full`}
                  >
                    {taxa}%
                  </span>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
