// components/InlineEdit.tsx
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { PencilLine, Check, X, Loader2 } from "lucide-react";

interface InlineEditProps {
  valor: string;
  onSalvar: (novoValor: string) => Promise<void>;
  className?: string;
}

export function InlineEdit({ valor, onSalvar, className }: InlineEditProps) {
  const {
    editando,
    valor: valorEdit,
    salvando,
    erro,
    inputRef,
    setValor,
    iniciarEdicao,
    cancelar,
    salvar,
    handleKeyDown,
  } = useInlineEdit(valor, onSalvar);

  if (editando) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            value={valorEdit}
            onChange={(e) => setValor(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={salvando}
            className={`border-b border-[#185FA5] bg-transparent outline-none font-medium ${className}`}
          />
          {salvando ? (
            <Loader2 size={14} className="animate-spin text-gray-400" />
          ) : (
            <>
              <button
                onClick={salvar}
                className="text-green-500 hover:text-green-600"
              >
                <Check size={14} />
              </button>
              <button
                onClick={cancelar}
                className="text-red-400   hover:text-red-500"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
        {erro && <span className="text-[10px] text-red-500">{erro}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 group">
      <span className={`font-medium ${className}`}>{valor}</span>
      <button
        onClick={iniciarEdicao}
        className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <PencilLine size={13} />
      </button>
    </div>
  );
}
