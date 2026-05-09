import { Button } from "@/components/ui/button";
import WardCard from "@/components/ward-card";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { sortEnfermariasByNome, sortLeitosByCodigo } from "@/utils/sort";
import { useAppData } from "@/context/app-data-context";
import { useMemo } from "react";

function BlocoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blocos, enfermariasByBloco, leitosByEnfermaria, loading } =
    useAppData();

  const bloco = useMemo(
    () => blocos.find((b) => b.id === id) ?? null,
    [blocos, id],
  );
  const enfermarias = useMemo(
    () => enfermariasByBloco.get(id!) ?? [],
    [enfermariasByBloco, id],
  );

  if (loading) return <div>Carregando...</div>;
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="sticky top-0 z-20 bg-white items-center p-4 gap-4 shadow-md grid grid-cols-6 justify-items-center">
        <div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft />
          </Button>
        </div>
        <div className="col-span-4 col-start-2">
          <h1 className="font-bold text-2xl">{bloco?.nome}</h1>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 pb-4">
        <div className="flex flex-col gap-y-2 items-center justify-start mt-2">
          {sortEnfermariasByNome(enfermarias).map((enfermaria) => (
            <WardCard
              enfermaria={enfermaria}
              key={enfermaria.id}
              leitos={sortLeitosByCodigo(
                leitosByEnfermaria.get(enfermaria.id) ?? [],
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlocoPage;
