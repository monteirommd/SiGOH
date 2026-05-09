// utils/sort.ts
import type { Enfermaria, Leito } from "@/model/model";

export function sortEnfermariasByNome(enfermarias: Enfermaria[]): Enfermaria[] {
  return [...enfermarias].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }),
  );
}

export function sortLeitosByCodigo(leitos: Leito[]): Leito[] {
  return [...leitos].sort((a, b) =>
    a.codigo.localeCompare(b.codigo, "pt-BR", { numeric: true }),
  );
}
