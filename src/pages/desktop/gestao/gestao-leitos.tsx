// pages/gestao/gestao-leitos.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabelaGestao, type ItemTabela } from "@/components/tabela-gestao";
import { NomearDialog } from "@/components/nomear-dialog";
import { getLeitosByEnfermaria } from "@/service/leito";
import { criarLeito, updateLeito, deletarLeito } from "@/service/estrutura";
import { useAppData } from "@/context/app-data-context";

export default function GestaoLeitos() {
  const { blocoId, enfermariaId } = useParams();
  const navigate = useNavigate();
  // bloco e enfermaria vêm do contexto — elimina 2 leituras ao Firestore
  const { blocos, enfermarias } = useAppData();
  const bloco = blocos.find((b) => b.id === blocoId) ?? null;
  const enfermaria = enfermarias.find((e) => e.id === enfermariaId) ?? null;
  const [leitos, setLeitos] = useState<ItemTabela[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoOpen, setNovoOpen] = useState(false);

  useEffect(() => {
    if (!enfermariaId) return;

    getLeitosByEnfermaria(enfermariaId)
      .then((leitosData) => {
        setLeitos(
          leitosData.map((l) => ({
            id: l.id,
            nome: l.codigo, // reutiliza o campo nome para exibir o código
            ativo: l.ativo ?? true,
            extra: l.status,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [enfermariaId]);

  const handleCriar = async (codigo: string) => {
    const id = await criarLeito(codigo, enfermariaId!, blocoId!);
    setLeitos((prev) => [
      ...prev,
      { id, nome: codigo, ativo: true, extra: "DISPONIVEL" },
    ]);
  };

  const handleEditar = async (id: string, codigo: string) => {
    await updateLeito(id, { codigo });
    setLeitos((prev) =>
      prev.map((l) => (l.id === id ? { ...l, nome: codigo } : l)),
    );
  };

  const handleToggle = async (id: string, ativo: boolean) => {
    await updateLeito(id, { ativo });
    setLeitos((prev) => prev.map((l) => (l.id === id ? { ...l, ativo } : l)));
  };

  const handleDeletar = async (id: string) => {
    await deletarLeito(id);
    setLeitos((prev) => prev.filter((l) => l.id !== id));
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 px-6 py-4 bg-white shadow-sm border-b">
        <Button size="icon" variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <p className="text-xs text-gray-400">
            {bloco?.nome} · {enfermaria?.nome}
          </p>
          <h1 className="font-bold text-xl leading-tight">Leitos</h1>
        </div>
      </div>

      <div className="p-6">
        <TabelaGestao
          items={leitos}
          labelCriar="Novo Leito"
          onCriar={() => setNovoOpen(true)}
          onEditar={handleEditar}
          onToggleAtivo={handleToggle}
          onDeletar={handleDeletar}
        />
      </div>

      <NomearDialog
        open={novoOpen}
        titulo="Novo Leito"
        label="Código do leito"
        placeholder="Ex: A1-01"
        onClose={() => setNovoOpen(false)}
        onConfirmar={handleCriar}
      />
    </div>
  );
}
