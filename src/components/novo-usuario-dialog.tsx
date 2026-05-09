// components/gestao/novo-usuario-dialog.tsx
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
import { criarUsuario } from "@/service/user";
import type { Usuario, UserRole } from "@/model/model";

interface Props {
  open: boolean;
  onClose: () => void;
  onCriado: (usuario: Usuario) => void;
}

export function NovoUsuarioDialog({ open, onClose, onCriado }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("TECNICO");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [linkRedefinicao, setLinkRedefinicao] = useState("");

  const resetForm = () => {
    setNome("");
    setEmail("");
    setRole("TECNICO");
    setErro("");
    setLinkRedefinicao("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!nome.trim() || !email.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const result = (await criarUsuario({ email, nome, role })) as any;
      const { id, linkRedefinicao } = result.data;

      setLinkRedefinicao(linkRedefinicao);

      onCriado({
        id,
        email,
        nome,
        role,
        ativo: true,
      });
    } catch (err: any) {
      setErro(err.message ?? "Erro ao criar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>

        {/* Formulário */}
        {!linkRedefinicao ? (
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1">
              <Label>Nome</Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@hospital.com"
                type="email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Cargo</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as UserRole)}
              >
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
              <Button variant="outline" onClick={handleClose}>
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
                  "Criar Usuário"
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Tela de sucesso com link de redefinição
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-sm text-gray-600">
              Usuário criado com sucesso. Envie o link abaixo para o usuário
              definir sua senha:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 break-all text-xs text-gray-700">
              {linkRedefinicao}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(linkRedefinicao);
              }}
            >
              Copiar Link
            </Button>
            <Button onClick={handleClose} className="bg-[#1D68B4]">
              Concluir
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
