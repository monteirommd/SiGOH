import { useAppData } from "@/context/app-data-context";
import type { LayoutMode } from "@/model/model";

import { HeaderActions } from "@/components/header-actions";
import LayoutToggle from "@/components/layout-toggle";
import ViewGraficos from "@/components/views/view-graficos";
import { MapaLeitos } from "@/components/mapa/mapa-leitos";
import { useSearchParams } from "react-router-dom";

function Dashboard() {
  const { blocos, enfermarias, leitos, loading } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();
  const layout = (searchParams.get("view") as LayoutMode) || "mapa";

  const setLayout = (newLayout: LayoutMode) => {
    setSearchParams({ view: newLayout });
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shadow-md border-b">
        <div className="flex items-center gap-4">
          <img
            src="/logo-sigoh.png"
            alt="Logo do SiGOH"
            className="h-10 w-auto"
            draggable={false}
          />
          {/* <h1 className="font-bold text-2xl">
            Sistema de Gestão de Ocupação Hospitalar
          </h1> */}
        </div>
        <span className="text-gray-800 text-lg font-bold">
          {new Date().toLocaleTimeString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <div className="flex items-center gap-3">
          <LayoutToggle current={layout} onChange={setLayout} />
          <HeaderActions />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto py-6 px-8">
        {layout === "graficos" && (
          <ViewGraficos
            bloco={blocos}
            enfermarias={enfermarias}
            leitos={leitos}
            layout={layout}
          />
        )}

        {layout === "mapa" && <MapaLeitos />}
      </div>
    </div>
  );
}

export default Dashboard;
