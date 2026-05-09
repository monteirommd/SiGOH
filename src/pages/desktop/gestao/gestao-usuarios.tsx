// pages/gestao/gestao-usuarios.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUsuarios, toggleUsuarioAtivo } from "@/service/user";

import type { Usuario } from "@/model/model";
import { NovoUsuarioDialog } from "@/components/novo-usuario-dialog";
import { EditarUsuarioDialog } from "@/components/editar-usuario-dialog";

const ROLE_LABEL: Record<string, string> = {
  TECNICO: "Técnico",
  GESTAO_BASE: "Gestor Base",
  GESTAO_ADMIN: "Gestor Admin",
};

export default function GestaoUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoOpen, setNovoOpen] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    getUsuarios()
      .then(setUsuarios)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleAtivo = async (usuario: Usuario) => {
    setTogglingId(usuario.id);
    try {
      await toggleUsuarioAtivo(usuario.id, !usuario.ativo);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuario.id ? { ...u, ativo: !u.ativo } : u)),
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleUsuarioCriado = (novo: Usuario) => {
    setUsuarios((prev) => [novo, ...prev]);
    setNovoOpen(false);
  };

  const handleUsuarioEditado = (atualizado: Usuario) => {
    console.log(atualizado);
    setUsuarios((prev) =>
      prev.map((u) => (u.id === atualizado.id ? atualizado : u)),
    );
    setEditando(null);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="font-bold text-xl">Gerenciar Usuários</h1>
        </div>
        <Button
          onClick={() => setNovoOpen(true)}
          className="bg-[#1D68B4] hover:bg-[#185FA5]"
        >
          <Plus size={16} className="mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Tabela */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs">
                <th className="text-left px-4 py-3 font-medium">Nome</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Cargo</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {usuario.nome}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{usuario.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {ROLE_LABEL[usuario.role]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      className={
                        usuario.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }
                    >
                      {usuario.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditando(usuario);
                          console.log(usuario);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={togglingId === usuario.id}
                        onClick={() => handleToggleAtivo(usuario)}
                        className={
                          usuario.ativo
                            ? "text-red-500 hover:text-red-600 hover:border-red-300"
                            : "text-green-600 hover:text-green-700 hover:border-green-300"
                        }
                      >
                        {togglingId === usuario.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : usuario.ativo ? (
                          "Desativar"
                        ) : (
                          "Ativar"
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
      <NovoUsuarioDialog
        open={novoOpen}
        onClose={() => setNovoOpen(false)}
        onCriado={handleUsuarioCriado}
      />

      {editando && (
        <EditarUsuarioDialog
          usuario={editando}
          open={!!editando}
          onClose={() => setEditando(null)}
          onEditado={handleUsuarioEditado}
        />
      )}
    </div>
  );
}
