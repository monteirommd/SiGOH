// components/gestao/tabela-gestao.tsx
import { useState } from "react";
import {
  Loader2,
  Plus,
  ChevronRight,
  PowerOff,
  Trash2,
  PencilLine,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InlineEdit } from "@/components/inline-edit";
import { NomearDialog } from "./nomear-dialog";

export interface ItemTabela {
  id: string;
  nome: string;
  ativo: boolean;
  exibirResumo?: boolean; // só para enfermarias — indica se deve mostrar o resumo na visão geral
  extra?: string; // info adicional — ex: "5 enfermarias", "DISPONIVEL"
}

interface TabelaGestaoProps {
  items: ItemTabela[];
  onAcessar?: (id: string) => void; // navega para o nível abaixo
  onEditar: (id: string, nome: string) => Promise<void>;
  onToggleAtivo: (id: string, ativo: boolean) => Promise<void>;
  onDeletar: (id: string) => Promise<void>;
  onCriar: () => void;
  labelCriar: string;
  disableItems?: ItemTabela[];
  labelAcessar?: string;
  enableList?: (id: string, exibirResumo: boolean) => Promise<void>;
}

export function TabelaGestao({
  items,
  onAcessar,
  onEditar,
  onToggleAtivo,
  onDeletar,
  onCriar,
  labelCriar,
  disableItems,
  labelAcessar = "Ver",
  enableList,
}: TabelaGestaoProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEditando, setItemEditando] = useState<ItemTabela | null>(null);

  const withLoading = async (id: string, fn: () => Promise<void>) => {
    setLoadingId(id);
    try {
      await fn();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex justify-end p-3 border-b border-gray-100">
        <Button
          onClick={onCriar}
          className="bg-[#1D68B4] hover:bg-[#185FA5]"
          size="sm"
        >
          <Plus size={14} className="mr-1" />
          {labelCriar}
        </Button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 text-xs border-b border-gray-100">
            <th className="text-left px-4 py-3 font-medium">Nome</th>
            <th className="text-left px-4 py-3 font-medium">Info</th>
            <th className="text-center px-4 py-3 font-medium">Status</th>
            <th className="text-center px-4 py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                <InlineEdit
                  valor={item.nome}
                  onSalvar={(nome) => onEditar(item.id, nome)}
                />
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">
                {item.extra ?? "—"}
              </td>
              <td className="px-4 py-3 text-center">
                <Badge
                  className={
                    item.ativo
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }
                >
                  {item.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  {onAcessar && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAcessar(item.id)}
                    >
                      {labelAcessar}
                      <ChevronRight size={14} className="ml-1" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={loadingId === item.id}
                    onClick={() => {
                      setItemEditando(item);
                      setOpenDialog(true);
                    }}
                    title="Editar"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <PencilLine size={14} />
                  </Button>
                  {enableList && (
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        withLoading(item.id, () =>
                          enableList(item.id, !item.exibirResumo),
                        );
                      }}
                      title={
                        item.exibirResumo
                          ? "Desabilitar exibição"
                          : "Habilitar exibição"
                      }
                      className={
                        item.exibirResumo
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-gray-400 hover:text-gray-600"
                      }
                    >
                      <Star size={14} />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={loadingId === item.id}
                    onClick={() =>
                      withLoading(item.id, () =>
                        onToggleAtivo(item.id, !item.ativo),
                      )
                    }
                    className={
                      item.ativo
                        ? "text-orange-500 hover:border-orange-300"
                        : "text-green-600 hover:border-green-300"
                    }
                    title={item.ativo ? "Desativar" : "Ativar"}
                  >
                    {loadingId === item.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <PowerOff size={14} />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={loadingId === item.id}
                    onClick={() =>
                      withLoading(item.id, () => onDeletar(item.id))
                    }
                    className="text-red-500 hover:border-red-300"
                    title="Deletar"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {disableItems &&
            disableItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <InlineEdit
                    valor={item.nome}
                    onSalvar={(nome) => onEditar(item.id, nome)}
                  />
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {item.extra ?? "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    className={
                      item.ativo
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }
                  >
                    {item.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {onAcessar && item.ativo && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAcessar(item.id)}
                      >
                        {labelAcessar}
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={loadingId === item.id}
                      onClick={() => {
                        setItemEditando(item);
                        setOpenDialog(true);
                      }}
                      title="Editar"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <PencilLine size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={loadingId === item.id}
                      onClick={() =>
                        withLoading(item.id, () =>
                          onToggleAtivo(item.id, !item.ativo),
                        )
                      }
                      className={
                        item.ativo
                          ? "text-orange-500 hover:border-orange-300"
                          : "text-green-600 hover:border-green-300"
                      }
                      title={item.ativo ? "Desativar" : "Ativar"}
                    >
                      {loadingId === item.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <PowerOff size={14} />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={loadingId === item.id}
                      onClick={() =>
                        withLoading(item.id, () => onDeletar(item.id))
                      }
                      className="text-red-500 hover:border-red-300"
                      title="Deletar"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          {items.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-gray-400 text-sm"
              >
                Nenhum item cadastrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <NomearDialog
        open={openDialog}
        titulo={itemEditando ? itemEditando.nome : "Editar item"}
        label="Nome do bloco"
        placeholder={itemEditando?.nome}
        onClose={() => setOpenDialog(false)}
        onConfirmar={(nome: string) => onEditar(itemEditando!.id, nome)}
        onConfirmText="Confirmar"
      />
    </div>
  );
}
