import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AuthService } from "@/service/auth";

export const HeaderLayout = () => {
  const handleLogout = () => {
    AuthService.logoutUser();
  };
  return (
    <div className="w-screen bg-white shadow-md h-20 text-black grid grid-cols-6 justify-items-center items-center rounded-b-md p-4 mb-4">
      <div className="justify-self-start">
        <Avatar>
          <AvatarFallback>TEC</AvatarFallback>
        </Avatar>
      </div>
      <div className="col-span-4">
        <h2 className="font-bold text-2xl">NIR - Mapa de leitos</h2>
      </div>
      <div className="justify-self-end">
        <LogOut
          className="hover:text-gray-300 cursor-pointer transition-colors transition-duration-200"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};
