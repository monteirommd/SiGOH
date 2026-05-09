// components/gestao/nomear-dialog.tsx
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

interface Props {
  open: boolean;
  titulo: string;
  label: string;
  placeholder?: string;
  onClose: () => void;
  onConfirmar: (valor: string) => Promise<void>;
  onConfirmText?: string;
}

export function NomearDialog({
  open,
  titulo,
  label,
  placeholder,
  onClose,
  onConfirmar,
  onConfirmText,
}: Props) {
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleClose = () => {
    setValor("");
    setErro("");
    onClose();
  };

  const handleConfirmar = async () => {
    if (!valor.trim()) {
      setErro("Campo obrigatório.");
      return;
    }
    setLoading(true);
    try {
      await onConfirmar(valor.trim());
      handleClose();
    } catch {
      setErro("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1">
            <Label>{label}</Label>
            <Input
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => e.key === "Enter" && handleConfirmar()}
              autoFocus
            />
          </div>
          {erro && <p className="text-sm text-red-500">{erro}</p>}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmar}
              disabled={loading}
              className="bg-[#1D68B4]"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : onConfirmText ? (
                onConfirmText
              ) : (
                "Criar"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
