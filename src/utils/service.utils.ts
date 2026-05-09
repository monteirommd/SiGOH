export const slugify = (text: string): string => {
  return text
    .toString()
    .normalize("NFD") // Normaliza para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Espaços para -
    .replace(/[^\w-]+/g, "") // Remove caracteres especiais
    .replace(/--+/g, "-"); // Remove hifens duplicados
};
