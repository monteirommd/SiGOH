// components/grafico-ocupacao-temporal.tsx
import { useEffect, useRef, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getSnapshots,
  solicitarSnapshotManual,
  aguardarSnapshotProcessado,
  type PeriodoSnapshot,
  type SnapshotOcupacao,
} from "@/service/snapshot";
import { useAppData } from "@/context/app-data-context";
import { useAuth } from "@/context/auth-context";
import { usePermission } from "@/hooks/usePermission";
import { Loader2 } from "lucide-react";

const CORES = [
  "#185FA5",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

interface Props {
  blocoId?: string;
}

export function GraficoOcupacaoTemporal({ blocoId }: Props) {
  const { blocos } = useAppData();
  const { user } = useAuth();
  const isGestao = usePermission(["GESTOR_BASE", "GESTOR_ADMIN"]);

  const blocosVisiveis = blocoId
    ? blocos.filter((b) => b.id === blocoId)
    : blocos;

  const [periodo, setPeriodo] = useState<PeriodoSnapshot>("hoje");
  const [snapshots, setSnapshots] = useState<SnapshotOcupacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [disparando, setDisparando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Ref para cancelar o listener de snapshot_request se o componente desmontar
  const unsubscribeRequestRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setLoading(true);
    setErro(null);
    getSnapshots(periodo)
      .then(setSnapshots)
      .catch((e) => setErro(e?.message ?? "Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, [periodo]);

  // Cancela listener pendente ao desmontar para evitar memory leak
  useEffect(() => {
    return () => {
      unsubscribeRequestRef.current?.();
    };
  }, []);

  const dados = useMemo(() => {
    return snapshots.map((snap) => {
      const ponto: Record<string, string | number> = {
        label:
          periodo === "hoje"
            ? `${String(snap.hora).padStart(2, "0")}h`
            : snap.dia.slice(5),
      };
      snap.blocos.forEach((b) => {
        ponto[b.nome] = b.taxa;
      });
      return ponto;
    });
  }, [snapshots, periodo]);

  const handleDisparar = async () => {
    if (!user || disparando) return;

    setDisparando(true);
    setErro(null);

    try {
      // 1. Escreve a solicitação no Firestore — sem CORS, sem callable
      const requestId = await solicitarSnapshotManual(user.uid);

      // 2. Escuta o documento até a function processar (done/error)
      unsubscribeRequestRef.current = aguardarSnapshotProcessado(
        requestId,
        async () => {
          // Snapshot pronto: recarrega os dados do gráfico
          const novos = await getSnapshots(periodo);
          setSnapshots(novos);
          setDisparando(false);
        },
        (mensagem) => {
          setErro(mensagem);
          setDisparando(false);
        },
      );
    } catch (e: unknown) {
      const mensagem =
        e instanceof Error ? e.message : "Erro ao solicitar snapshot";
      setErro(mensagem);
      setDisparando(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium">
          Ocupação por bloco ao longo do tempo
        </p>
        <div className="flex items-center gap-2">
          {isGestao && (
            <button
              onClick={handleDisparar}
              disabled={disparando}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
            >
              {disparando ? (
                <>
                  <Loader2 size={11} className="animate-spin" /> Gravando...
                </>
              ) : (
                "Gravar agora"
              )}
            </button>
          )}
          <div className="flex gap-1">
            {(["hoje", "7dias", "30dias"] as PeriodoSnapshot[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  periodo === p
                    ? "bg-[#185FA5] text-white border-[#185FA5]"
                    : "text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {p === "hoje" ? "Hoje" : p === "7dias" ? "7 dias" : "30 dias"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Atualizado automaticamente a cada hora
      </p>

      {erro && <p className="text-xs text-red-500 mb-2">{erro}</p>}

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-300" size={24} />
        </div>
      ) : dados.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-gray-400">
            Sem dados para o período selecionado
          </p>
          {isGestao && (
            <button
              onClick={handleDisparar}
              disabled={disparando}
              className="text-xs text-[#185FA5] border border-[#185FA5] rounded-full px-3 py-1.5 hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {disparando ? "Gravando..." : "Gravar primeiro snapshot"}
            </button>
          )}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={dados}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {blocosVisiveis.map((bloco, i) => (
              <Line
                key={bloco.id}
                type="monotone"
                dataKey={bloco.nome}
                stroke={CORES[i % CORES.length]}
                strokeWidth={2}
                dot={periodo === "hoje"}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
