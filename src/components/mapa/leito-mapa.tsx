// components/mapa/leito-mapa.tsx
import { memo } from "react";
import type { Leito } from "@/model/model";

interface Props {
  leito: Leito;
  compacto: boolean;
  onClick: (leito: Leito) => void;
}

const STATUS_STYLE: Record<string, string> = {
  DISPONIVEL: "bg-emerald-500 text-white",
  OCUPADO: "bg-red-400 text-white",
  LIMPEZA: "bg-amber-400 text-white",
  BLOQUEADO: "bg-gray-300 text-gray-500",
  MANUTENCAO: "bg-violet-400 text-white",
};

function LeitoMapa({ leito, compacto, onClick }: Props) {
  const style = STATUS_STYLE[leito.status] ?? STATUS_STYLE.BLOQUEADO;

  if (compacto) {
    return (
      <div
        title={`${leito.codigo} — ${leito.status}`}
        onClick={() => onClick(leito)}
        className={`${style} w-3.5 h-3.5 rounded-sm cursor-pointer hover:opacity-70 transition-opacity shrink-0`}
      />
    );
  }

  return (
    <button
      onClick={() => onClick(leito)}
      title={`${leito.codigo} — ${leito.status}`}
      className={`${style} w-10 h-7 rounded text-[10px] font-bold hover:opacity-80 transition-opacity shrink-0 text-center cursor-pointer`}
    >
      {leito.codigo}
    </button>
  );
}

export default memo(LeitoMapa);
