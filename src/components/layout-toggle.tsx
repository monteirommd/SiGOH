import type { LayoutMode } from "@/model/model";
import { ChartColumnBig, Map } from "lucide-react";

interface LayoutToggleProps {
  current: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

const options = [
  { mode: "graficos", icon: ChartColumnBig, label: "Gráficos" },
  { mode: "mapa", icon: Map, label: "Mapa" },
] as const;

export function LayoutToggle({ current, onChange }: LayoutToggleProps) {
  return (
    <div>
      {options.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          title={label}
          className={`p-2 rounded-full mr-1 ${current === mode ? "bg-blue-500 text-white" : " text-gray-700"} hover:bg-gray-300 transition-colors duration-150`}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
}

export default LayoutToggle;
