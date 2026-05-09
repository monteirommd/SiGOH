import RoomCard from "@/components/room-card";
import { HeaderLayout } from "@/components/header-layout";
import { useAppData } from "@/context/app-data-context";

export const Home = () => {
  const { blocos, leitosByBloco, loading } = useAppData();

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <HeaderLayout />

      <div className="gap-2 flex flex-col mx-2">
        {blocos.map((room) => (
          <RoomCard
            key={room.id}
            bloco={room}
            leitos={leitosByBloco.get(room.id) ?? []}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
