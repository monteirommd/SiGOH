// components/gestao/editar-usuario-dialog.tsx
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUsuario } from "@/service/user";
import type { Usuario, UserRole } from "@/model/model";

interface Props {
  usuario: Usuario;
  open: boolean;
  onClose: () => void;
  onEditado: (usuario: Usuario) => void;
}

export function EditarUsuarioDialog({
  usuario,
  open,
  onClose,
  onEditado,
}: Props) {
  const [nome, setNome] = useState(usuario.nome);
  const [role, setRole] = useState<UserRole>(usuario.role);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async () => {
    if (!nome.trim()) {
      setErro("Nome não pode ser vazio.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      await updateUsuario(usuario.id, { nome, role });
      onEditado({ ...usuario, nome, role });
    } catch (err: any) {
      setErro(err.message ?? "Erro ao atualizar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1">
            <Label>Nome</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Input value={usuario.email} disabled className="text-gray-400" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Cargo</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TECNICO">Técnico</SelectItem>
                <SelectItem value="GESTOR_BASE">Gestor Base</SelectItem>
                <SelectItem value="GESTOR_ADMIN">Gestor Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#1D68B4]"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
