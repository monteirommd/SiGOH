import type { Enfermaria, Leito, StatusLeito } from "@/model/model";
import { getLeitoColor } from "@/utils/leito-util";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { updateLeitoStatus } from "@/service/leito";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface LeitosViewerProps {
  enfermaria: Enfermaria | null;
  leitos: Leito[];
  open: boolean;
  onClose: () => void;
}

function LeitosViewer({
  enfermaria,
  leitos,
  open,
  onClose,
}: LeitosViewerProps) {
  const { profile, user } = useAuth();

  const [leitosState, setLeitosState] = useState<Leito[]>(leitos);
  const [selectedLeito, setSelectedLeito] = useState<Leito | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sincroniza quando os leitos da prop mudarem (tempo real do dashboard)
  useEffect(() => {
    setLeitosState(leitos);
  }, [leitos]);

  const handleLeitoClick = (leito: Leito) => {
    setSelectedLeito(leito);
    setIsDrawerOpen(true);
  };

  const handleStatusChange = async (novoStatus: StatusLeito) => {
    if (!selectedLeito) return;

    await updateLeitoStatus({
      leitoId: selectedLeito.id,
      novoStatus,
      uid: user?.uid || "unknown",
      nomeUsuario: profile?.nome || "unknown",
    })
      .then(() => {
        setLeitosState((prev) =>
          prev.map((l) =>
            l.id === selectedLeito.id ? { ...l, status: novoStatus } : l,
          ),
        );
      })
      .finally(() => setIsDrawerOpen(false));
  };

  if (!enfermaria) return null;

  // Conteúdo compartilhado — igual ao WardCard atual
  const gridLeitos = (
    <div className="">
      {leitosState.map((leito) => (
        <button
          key={leito.id}
          onClick={() => handleLeitoClick(leito)}
          className={`${getLeitoColor(leito.status)} text-white rounded-full p-6 text-lg font-bold hover:opacity-80 transition-opacity m-1`}
        >
          {leito.codigo}
        </button>
      ))}
    </div>
  );

  const drawerStatus = (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Leito {selectedLeito?.codigo}</DrawerTitle>
          <DrawerDescription>
            Selecione o novo status do leito
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-3">
          <Button
            onClick={() => handleStatusChange("DISPONIVEL")}
            className="w-full bg-green-500 hover:bg-green-600"
            size="lg"
          >
            Pronto
          </Button>
          <Button
            onClick={() => handleStatusChange("LIMPEZA")}
            className="w-full bg-red-500 hover:bg-red-600"
            size="lg"
          >
            Em Limpeza
          </Button>
          <Button
            onClick={() => handleStatusChange("OCUPADO")}
            className="w-full bg-yellow-500 hover:bg-yellow-600"
            size="lg"
          >
            Ocupado
          </Button>
          <Button
            onClick={() => handleStatusChange("BLOQUEADO")}
            className="w-full bg-gray-500 hover:bg-gray-600"
            size="lg"
          >
            Bloqueado
          </Button>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  // Desktop → Sheet lateral

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="min-w-120">
          <DialogHeader>
            <DialogTitle>Leitos — {enfermaria.nome}</DialogTitle>
          </DialogHeader>
          {gridLeitos}
        </DialogContent>
      </Dialog>
      {drawerStatus}
    </>
  );
}

export default LeitosViewer;
