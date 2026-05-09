import type { Leito, StatusLeito } from "@/model/model";

export const getLeitoColor = (status: StatusLeito) => {
  switch (status) {
    case "OCUPADO":
      return "bg-red-500";
    case "LIMPEZA":
      return "bg-yellow-500";
    case "DISPONIVEL":
      return "bg-emerald-500";
    case "BLOQUEADO":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

export const getTaxaOcupacao = (leitos: Leito[]) => {
  const total = leitos.length;
  const ocupados = leitos.filter((l) => l.status === "OCUPADO").length;
  return total > 0 ? Math.round((ocupados / total) * 100) : 0;
};

export const getOcupacaoColor = (taxa: number) => {
  if (taxa <= 50) return "bg-emerald-500";
  if (taxa <= 80) return "bg-yellow-500";
  return "bg-red-500";
};
