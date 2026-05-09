// components/mapa/mapa-leitos.tsx
import { useCallback, useState } from "react";
import { LayoutGrid, Grid3x3 } from "lucide-react";
import { useAppData } from "@/context/app-data-context";
import { useAuth } from "@/context/auth-context";
import BlocoMapa from "./bloco-mapa";
import type { Leito, StatusLeito } from "@/model/model";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { updateLeitoStatus } from "@/service/leito";

interface StatusOption {
  status: StatusLeito;
  label: string;
  className: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    status: "DISPONIVEL",
    label: "Pronto",
    className: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    status: "LIMPEZA",
    label: "Em Limpeza",
    className: "bg-amber-500 hover:bg-amber-600",
  },
  {
    status: "OCUPADO",
    label: "Ocupado",
    className: "bg-red-500 hover:bg-red-600",
  },
  {
    status: "BLOQUEADO",
    label: "Bloqueado",
    className: "bg-gray-500 hover:bg-gray-600",
  },
];

export function MapaLeitos() {
  const { blocos, enfermariasByBloco, leitosByBloco } = useAppData();
  const { user, profile } = useAuth();
  const [compacto, setCompacto] = useState(false);
  const [selectedLeito, setSelectedLeito] = useState<Leito | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<StatusLeito | null>(null);

  const handleLeitoClick = useCallback((leito: Leito) => {
    setSelectedLeito(leito);
    setIsDrawerOpen(true);
  }, []);

  const handleDrawerOpenChange = useCallback(
    (open: boolean) => {
      // Impede fechar enquanto há uma operação em andamento
      if (!pendingStatus) setIsDrawerOpen(open);
    },
    [pendingStatus],
  );

  const handleStatusChange = async (novoStatus: StatusLeito) => {
    if (!selectedLeito || pendingStatus !== null) return;

    setPendingStatus(novoStatus);
    try {
      await updateLeitoStatus({
        leitoId: selectedLeito.id,
        novoStatus,
        uid: user?.uid ?? "unknown",
        nomeUsuario: profile?.nome ?? "unknown",
      });
      setIsDrawerOpen(false);
    } finally {
      setPendingStatus(null);
    }
  };

  return (
    <div>
      {/* Controles */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">Mapa de leitos</p>
        <button
          onClick={() => setCompacto((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          title={compacto ? "Modo detalhado" : "Modo compacto"}
        >
          {compacto ? (
            <>
              <LayoutGrid size={13} /> Detalhado
            </>
          ) : (
            <>
              <Grid3x3 size={13} /> Compacto
            </>
          )}
        </button>
      </div>

      {/* Grid de blocos */}
      <div className="grid grid-cols-3 gap-3 items-start">
        {blocos.map((bloco) => (
          <BlocoMapa
            key={bloco.id}
            bloco={bloco}
            enfermarias={enfermariasByBloco.get(bloco.id) ?? []}
            leitos={leitosByBloco.get(bloco.id) ?? []}
            compacto={compacto}
            onLeitoClick={handleLeitoClick}
          />
        ))}
      </div>

      {/* Drawer de alteração de status */}
      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Leito {selectedLeito?.codigo}</DrawerTitle>
            <DrawerDescription>
              Selecione o novo status do leito
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-3">
            {STATUS_OPTIONS.map(({ status, label, className }) => (
              <Button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={pendingStatus !== null}
                className={`w-full text-white ${className}`}
                size="lg"
              >
                {pendingStatus === status ? "Salvando..." : label}
              </Button>
            ))}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" disabled={pendingStatus !== null}>
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
