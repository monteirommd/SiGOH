import type { Bloco, Leito } from "@/model/model";
import { getOcupacaoColor } from "@/utils/leito-util";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  bloco: Bloco;
  leitos: Leito[];
}

function RoomCard({ bloco, leitos }: RoomCardProps) {
  const navigate = useNavigate();
  const ocupados = leitos.filter((l) => l.status === "OCUPADO").length;
  const total = leitos.length;
  const taxa = total > 0 ? Math.round((ocupados / total) * 100) : 0;

  const handleClicle = () => {
    navigate(`/bloco/${bloco.id}`);
  };
  return (
    <div
      className="w-full flex items-center justify-between shadow-lg rounded-sm border bg-white hover:cursor-pointer transition-colors hover:bg-[#e9e9e9]"
      onClick={handleClicle}
    >
      <div className="p-3.5">
        <h2 className="font-bold">{bloco.nome}</h2>
      </div>
      <div className="p-3.5">
        <span
          className={`${getOcupacaoColor(taxa)} text-white text-xs px-2 py-1 rounded-full font-medium`}
        >
          {taxa}% ocupação
        </span>
      </div>
    </div>
  );
}

export default RoomCard;
