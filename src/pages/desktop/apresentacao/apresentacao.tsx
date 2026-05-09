// pages/apresentacao/apresentacao.tsx
import { useState, useCallback, useEffect } from "react";

// Slides disponíveis
import { SlideOcupacaoGeral } from "@/components/slides/slide-ocupacao-geral";
import { SlideOcupacaoPorBloco } from "@/components/slides/slide-ocupacao-por-bloco";
import { SlideResumoTabela } from "@/components/slides/slide-resumo-tabela";
import { SlideMapaLeitos } from "@/components/slides/slide-mapa-leitos";
import { SlideOcupacaoTemporal } from "@/components/slides/slide-ocupacao-temporal";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SLIDES = [
  SlideOcupacaoGeral,
  SlideOcupacaoPorBloco,
  SlideResumoTabela,
  SlideMapaLeitos,
  SlideOcupacaoTemporal,
];

const INTERVALO_MS = 8000; // 8 segundos por slide

export default function Apresentacao() {
  const [slideAtual, setSlideAtual] = useState(0);
  const [visivel, setVisivel] = useState(true); // controla o fade
  const navigate = useNavigate();

  // Alternância automática com fade
  const avancarSlide = useCallback(() => {
    setVisivel(false); // inicia fade out

    setTimeout(() => {
      setSlideAtual((prev) => (prev + 1) % SLIDES.length);
      setVisivel(true); // inicia fade in
    }, 500); // duração do fade
  }, []);

  useEffect(() => {
    const timer = setInterval(avancarSlide, INTERVALO_MS);
    return () => clearInterval(timer);
  }, [avancarSlide]);

  const SlideComponente = SLIDES[slideAtual];

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {/* Header fixo */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-400">
        <h1 className="text-black font-bold text-xl tracking-wide">
          SiGOH — Mapa de Leitos
        </h1>
        <div className="flex items-center gap-3">
          {/* Indicadores de slide */}
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideAtual(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === slideAtual ? "bg-black w-6" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-4">
          <span className="text-gray-800 text-sm">
            {new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <LogOut
            size={16}
            className="mr-2 hover:text-gray-600 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />
        </div>
      </div>

      <div
        className="flex-1 p-8 transition-opacity duration-500"
        style={{ opacity: visivel ? 1 : 0 }}
      >
        <SlideComponente />
      </div>
    </div>
  );
}
