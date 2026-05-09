import { PROXIMO_STATUS, type Enfermaria, type Leito } from "@/model/model";
import { getLeitoColor } from "@/utils/leito-util";
import React, { useEffect, useState } from "react";
import { toggleLeitoStatus } from "@/service/leito";
import { useAuth } from "@/context/auth-context";

interface WardCardProps {
  enfermaria: Enfermaria;
  leitos: Leito[];
  onEditar?: (enfermaria: Enfermaria) => void;
}

function WardCard({ enfermaria, leitos }: WardCardProps) {
  const [leitosState, setLeitosState] = useState<Leito[]>(leitos);

  const { profile, user } = useAuth();

  useEffect(() => {
    setLeitosState(leitos);
  }, [leitos]);

  const handleStatusChange = async (leito: Leito) => {
    setLeitosState((prev) =>
      prev.map((l) =>
        l.id === leito.id ? { ...l, status: PROXIMO_STATUS[leito.status] } : l,
      ),
    );

    try {
      await toggleLeitoStatus({
        leitoId: leito.id,
        currentStatus: leito.status,
        uid: user?.uid || "unknown",
        nomeUsuario: profile?.nome || "unknown",
      });
    } catch {
      setLeitosState((prev) =>
        prev.map((l) =>
          l.id === leito.id ? { ...l, status: leito.status } : l,
        ),
      );
    }
  };

  return (
    <div className="w-full max-w-5xl p-2">
      <div className="font-bold text-xl">{enfermaria.nome}</div>
      <div className="w-full py-3">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-[repeat(auto-fit,minmax(4.75rem,1fr))] gap-3">
          {leitosState.map((leito) => (
            <button
              key={leito.id}
              onClick={() => handleStatusChange(leito)}
              className={`${getLeitoColor(leito.status)} p-4 w-full rounded-full text-white text-base sm:text-lg font-bold hover:opacity-80 transition-opacity`}
            >
              {leito.codigo}
            </button>
          ))}
        </div>
      </div>
      <hr className="border-t-4 text-black" />{" "}
    </div>
  );
}

export default React.memo(WardCard);
