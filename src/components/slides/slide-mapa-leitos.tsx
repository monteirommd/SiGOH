// slides/slide-mapa-leitos.tsx
import { MapaLeitos } from "@/components/mapa/mapa-leitos";

export function SlideMapaLeitos() {
  return (
    <div className="h-full flex flex-col gap-4 overflow-auto">
      <p className="text-gray-800 text-lg tracking-widest uppercase text-center">
        Mapa de Leitos
      </p>
      <MapaLeitos />
    </div>
  );
}
