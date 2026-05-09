// components/HeaderActions.tsx
import { LogOut, Users, Plus, MoreVertical, Play } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthService } from "@/service/auth";

export function HeaderActions() {
  const isGestao = usePermission(["GESTOR_ADMIN"]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await AuthService.logoutUser();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <MoreVertical size={20} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {isGestao && (
          <>
            <DropdownMenuItem onClick={() => navigate("/gestao/usuarios")}>
              <Users size={16} className="mr-2" />
              Gerenciar usuários
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/gestao/blocos")}>
              <Plus size={16} className="mr-2" />
              Adicionar estrutura
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/apresentacao")}>
              <Play size={16} className="mr-2" />
              Modo Apresentação
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          <LogOut size={16} className="mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
