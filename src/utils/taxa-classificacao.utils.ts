export const taxaGeralOcupacao = {
  NIVEL_0: { VAL: 75, LABEL: "Nível 0" },
  NIVEL_1: { VAL: 84, LABEL: "Nível 1" },
  NIVEL_2: { VAL: 94, LABEL: "Nível 2" },
  NIVEL_3: { VAL: 95, LABEL: "Nível 3" },
} as const;

const taxaOcupacaoColors = {
  NIVEL_0: "bg-linear-to-tr from-[#00639e] to-[#0074B9]",
  NIVEL_1: "bg-linear-to-tr from-[#d6b536] to-[#FBD43E]",
  NIVEL_2: "bg-linear-to-tr from-[#e85d1e] to-[#FF6722]",
  NIVEL_3: "bg-linear-to-tr from-[#e02a28] to-[#F8302E]",
  DEFAULT: "bg-linear-to-tr from-[#374151] to-[#1D68B4]",
} as const;

export const taxaAssistencialOcupacao = {
  NIVEL_0: { VAL: 80, LABEL: "Nível 0" },
  NIVEL_1: { VAL: 89, LABEL: "Nível 1" },
  NIVEL_2: { VAL: 94, LABEL: "Nível 2" },
  NIVEL_3: { VAL: 95, LABEL: "Nível 3" },
} as const;

const taxaOcupacaoAssistencialColors = {
  NIVEL_0: "#0074B9",
  NIVEL_1: "#FBD43E",
  NIVEL_2: "#FF6722",
  NIVEL_3: "#F8302E",
  DEFAULT: "#1D68B4",
} as const;

export const getTaxaOcupacaoGeralColor = (taxa: number) => {
  if (taxa < taxaGeralOcupacao.NIVEL_0.VAL) return taxaOcupacaoColors.NIVEL_0;
  if (taxa <= taxaGeralOcupacao.NIVEL_1.VAL) return taxaOcupacaoColors.NIVEL_1;
  if (taxa <= taxaGeralOcupacao.NIVEL_2.VAL) return taxaOcupacaoColors.NIVEL_2;
  if (taxa >= taxaGeralOcupacao.NIVEL_3.VAL) return taxaOcupacaoColors.NIVEL_3;

  return taxaOcupacaoColors.DEFAULT;
};

export const getTaxaOcupacaoGeralLabel = (taxa: number) => {
  if (taxa < taxaGeralOcupacao.NIVEL_0.VAL)
    return taxaGeralOcupacao.NIVEL_0.LABEL;
  if (taxa <= taxaGeralOcupacao.NIVEL_1.VAL)
    return taxaGeralOcupacao.NIVEL_1.LABEL;
  if (taxa <= taxaGeralOcupacao.NIVEL_2.VAL)
    return taxaGeralOcupacao.NIVEL_2.LABEL;
  if (taxa >= taxaGeralOcupacao.NIVEL_3.VAL)
    return taxaGeralOcupacao.NIVEL_3.LABEL;

  return "Nível Desconhecido";
};

export const getTaxaOcupacaoAssistencialColor = (taxa: number) => {
  if (taxa < taxaAssistencialOcupacao.NIVEL_0.VAL)
    return taxaOcupacaoAssistencialColors.NIVEL_0;
  if (taxa <= taxaAssistencialOcupacao.NIVEL_1.VAL)
    return taxaOcupacaoAssistencialColors.NIVEL_1;
  if (taxa <= taxaAssistencialOcupacao.NIVEL_2.VAL)
    return taxaOcupacaoAssistencialColors.NIVEL_2;
  if (taxa >= taxaAssistencialOcupacao.NIVEL_3.VAL)
    return taxaOcupacaoAssistencialColors.NIVEL_3;

  return taxaOcupacaoAssistencialColors.DEFAULT;
};
