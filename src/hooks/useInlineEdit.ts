import { useEffect, useRef, useState } from "react";

export function useInlineEdit(
  valorInicial: string,
  onSalvar: (novoValor: string) => Promise<void>,
) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(valorInicial);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editando) inputRef.current?.focus();
  }, [editando]);

  const iniciarEdicao = () => {
    setValor(valorInicial); // reseta para o valor atual antes de editar
    setEditando(true);
  };

  const cancelar = () => {
    setValor(valorInicial);
    setEditando(false);
    setErro(null);
  };

  const salvar = async () => {
    const novoValor = valor.trim();

    if (!novoValor) return cancelar(); // vazio → cancela
    if (novoValor === valorInicial) {
      setEditando(false);
      return;
    } // sem mudança

    setSalvando(true);
    setErro(null);

    try {
      await onSalvar(novoValor);
      setEditando(false);
    } catch {
      setErro("Erro ao salvar. Tente novamente.");
      setValor(valorInicial); // reverte localmente
    } finally {
      setSalvando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") salvar();
    if (e.key === "Escape") cancelar();
  };

  return {
    editando,
    valor,
    salvando,
    erro,
    inputRef,
    setValor,
    iniciarEdicao,
    cancelar,
    salvar,
    handleKeyDown,
  };
}
