import type { Bloco, Enfermaria, Leito } from "@/model/model";
import { getOcupacaoColor } from "@/utils/leito-util";
import React, { useMemo } from "react";

interface ResumoBlocoProps {
  blocos: Bloco[];
  enfermarias: Enfermaria[];
  leitos: Leito[];
}

function ResumoBloco({ blocos, enfermarias, leitos }: ResumoBlocoProps) {
  const rowsBlocos = useMemo(() => {
    return blocos.map((bloco) => {
      const l = leitos.filter((l) => l.blocoId === bloco.id);
      const ocupado = l.filter((l) => l.status === "OCUPADO").length;
      const total = l.length;
      const disponivel = l.filter((l) => l.status === "DISPONIVEL").length;
      const bloqueado = l.filter((l) => l.status === "BLOQUEADO").length;
      const limpeza = l.filter((l) => l.status === "LIMPEZA").length;
      const taxa = total > 0 ? Math.round((ocupado / total) * 100) : 0;

      return { bloco, ocupado, disponivel, bloqueado, limpeza, total, taxa };
    });
  }, [blocos, leitos]);

  const rowsDestaque = useMemo(() => {
    return enfermarias
      .filter((e) => e.exibirResumo)
      .map((enf) => {
        const l = leitos.filter((l) => l.enfermariaId === enf.id);
        const ocupado = l.filter((l) => l.status === "OCUPADO").length;
        const disponivel = l.filter((l) => l.status === "DISPONIVEL").length;
        const limpeza = l.filter((l) => l.status === "LIMPEZA").length;
        const bloqueado = l.filter((l) => l.status === "BLOQUEADO").length;
        const total = l.length;
        const taxa = total > 0 ? Math.round((ocupado / total) * 100) : 0;
        return {
          label: enf.nome,
          ocupado,
          disponivel,
          limpeza,
          bloqueado,
          total,
          taxa,
        };
      });
  }, [enfermarias, leitos]);

  const totais = useMemo(() => {
    const ocupado = rowsBlocos.reduce((s, r) => s + r.ocupado, 0);
    const disponivel = rowsBlocos.reduce((s, r) => s + r.disponivel, 0);
    const limpeza = rowsBlocos.reduce((s, r) => s + r.limpeza, 0);
    const bloqueado = rowsBlocos.reduce((s, r) => s + r.bloqueado, 0);
    const total = rowsBlocos.reduce((s, r) => s + r.total, 0);
    const taxa = total > 0 ? Math.round((ocupado / total) * 100) : 0;

    return {
      ocupado,
      disponivel,
      limpeza,
      bloqueado,
      total,
      taxa,
    };
  }, [rowsBlocos]);

  const totaisDestaque = useMemo(() => {
    const ocupado = rowsDestaque.reduce((s, r) => s + r.ocupado, 0);
    const disponivel = rowsDestaque.reduce((s, r) => s + r.disponivel, 0);
    const limpeza = rowsDestaque.reduce((s, r) => s + r.limpeza, 0);
    const bloqueado = rowsDestaque.reduce((s, r) => s + r.bloqueado, 0);
    const total = rowsDestaque.reduce((s, r) => s + r.total, 0);
    const taxa = total > 0 ? Math.round((ocupado / total) * 100) : 0;

    return {
      ocupado,
      disponivel,
      limpeza,
      bloqueado,
      total,
      taxa,
    };
  }, [rowsDestaque]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="font-medium text-sm mb-3">Resumo por Bloco</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-gray-100">
              <th className="text-left pb-2 font-medium">Bloco</th>
              <th className="text-center pb-2 font-medium">Ocup.</th>
              <th className="text-center pb-2 font-medium">Disp.</th>
              <th className="text-center pb-2 font-medium">Limp.</th>
              <th className="text-center pb-2 font-medium">Bloq.</th>
              <th className="text-center pb-2 font-medium">Total</th>
              <th className="text-center pb-2 font-medium">Taxa</th>
            </tr>
          </thead>
          <tbody>
            {rowsBlocos.map(
              ({
                bloco,
                ocupado,
                disponivel,
                limpeza,
                bloqueado,
                total,
                taxa,
              }) => (
                <tr
                  key={bloco.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 font-medium text-gray-700 max-w-20 truncate">
                    {bloco.nome}
                  </td>
                  <td className="py-2 text-center text-gray-600">{ocupado}</td>
                  <td className="py-2 text-center text-gray-600">
                    {disponivel}
                  </td>
                  <td className="py-2 text-center text-gray-600">{limpeza}</td>
                  <td className="py-2 text-center text-gray-600">
                    {bloqueado}
                  </td>
                  <td className="py-2 text-center font-medium text-gray-700">
                    {total}
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className={`${getOcupacaoColor(taxa)} text-white text-[10px] px-2 py-0.5 rounded-full font-medium`}
                    >
                      {taxa}%
                    </span>
                  </td>
                </tr>
              ),
            )}
          </tbody>

          {/* Linha de totais */}
          <tbody>
            <tr className="border-t-2 border-gray-200 bg-gray-50">
              <td className="py-2 font-semibold text-gray-800">Total</td>
              <td className="py-2 text-center font-semibold text-gray-800">
                {totais.ocupado}
              </td>
              <td className="py-2 text-center font-semibold text-gray-800">
                {totais.disponivel}
              </td>
              <td className="py-2 text-center font-semibold text-gray-800">
                {totais.limpeza}
              </td>
              <td className="py-2 text-center font-semibold text-gray-800">
                {totais.bloqueado}
              </td>
              <td className="py-2 text-center font-semibold text-gray-800">
                {totais.total}
              </td>
              <td className="py-2 text-center">
                <span
                  className={`${getOcupacaoColor(totais.taxa)} text-white text-[10px] px-2 py-0.5 rounded-full font-medium`}
                >
                  {totais.taxa}%
                </span>
              </td>
            </tr>
          </tbody>
          {rowsDestaque.length > 0 && (
            <tbody>
              {rowsDestaque.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 font-medium text-gray-700 max-w-20 truncate">
                    {row.label}
                  </td>
                  <td className="py-2 text-center text-gray-600">
                    {row.ocupado}
                  </td>
                  <td className="py-2 text-center text-gray-600">
                    {row.disponivel}
                  </td>
                  <td className="py-2 text-center text-gray-600">
                    {row.limpeza}
                  </td>
                  <td className="py-2 text-center text-gray-600">
                    {row.bloqueado}
                  </td>
                  <td className="py-2 text-center font-medium text-gray-700">
                    {row.total}
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className={`${getOcupacaoColor(row.taxa)} text-white text-[10px] px-2 py-0.5 rounded-full font-medium`}
                    >
                      {row.taxa}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td className="py-2 font-semibold text-gray-800">Total</td>
                <td className="py-2 text-center font-semibold text-gray-800">
                  {totaisDestaque.ocupado}
                </td>
                <td className="py-2 text-center font-semibold text-gray-800">
                  {totaisDestaque.disponivel}
                </td>
                <td className="py-2 text-center font-semibold text-gray-800">
                  {totaisDestaque.limpeza}
                </td>
                <td className="py-2 text-center font-semibold text-gray-800">
                  {totaisDestaque.bloqueado}
                </td>
                <td className="py-2 text-center font-semibold text-gray-800">
                  {totaisDestaque.total}
                </td>
                <td className="py-2 text-center">
                  <span
                    className={`${getOcupacaoColor(totaisDestaque.taxa)} text-white text-[10px] px-2 py-0.5 rounded-full font-medium`}
                  >
                    {totaisDestaque.taxa}%
                  </span>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

export default React.memo(ResumoBloco);
