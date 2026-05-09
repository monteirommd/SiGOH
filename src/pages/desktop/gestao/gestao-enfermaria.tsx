// pages/gestao/gestao-enfermarias.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabelaGestao, type ItemTabela } from "@/components/tabela-gestao";
import { NomearDialog } from "@/components/nomear-dialog";
import { getEnfermariasByBloco } from "@/service/bloco";
import {
  criarEnfermaria,
  updateEnfermaria,
  deletarEnfermaria,
} from "@/service/estrutura";
import { useAppData } from "@/context/app-data-context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/service/firebase";

export default function GestaoEnfermarias() {
  const { blocoId } = useParams();
  const navigate = useNavigate();
  // bloco vem do contexto — elimina 1 leitura ao Firestore
  const { blocos } = useAppData();
  const bloco = blocos.find((b) => b.id === blocoId) ?? null;
  const [enfermarias, setEnfermarias] = useState<ItemTabela[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoOpen, setNovoOpen] = useState(false);

  useEffect(() => {
    if (!blocoId) return;

    getEnfermariasByBloco(blocoId)
      .then((enfs) => {
        setEnfermarias(
          enfs.map((e) => ({
            id: e.id,
            nome: e.nome,
            ativo: e.ativo,
            exibirResumo: e.exibirResumo,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [blocoId]);

  const handleCriar = async (nome: string) => {
    const id = await criarEnfermaria(nome, blocoId!);
    setEnfermarias((prev) => [...prev, { id, nome, ativo: true }]);
  };

  const handleEditar = async (id: string, nome: string) => {
    await updateEnfermaria(id, { nome });
    setEnfermarias((prev) =>
      prev.map((e) => (e.id === id ? { ...e, nome } : e)),
    );
  };

  const handleToggle = async (id: string, ativo: boolean) => {
    await updateEnfermaria(id, { ativo });
    setEnfermarias((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ativo } : e)),
    );
  };

  const handleDeletar = async (id: string) => {
    await deletarEnfermaria(id);
    setEnfermarias((prev) => prev.filter((e) => e.id !== id));
  };

  const handleToggleDestaque = async (id: string, exibirResumo: boolean) => {
    await updateDoc(doc(db, "enfermarias", id), { exibirResumo });
    setEnfermarias((prev) =>
      prev.map((e) => (e.id === id ? { ...e, exibirResumo } : e)),
    );
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 px-6 py-4 bg-white shadow-sm border-b">
        <Button size="icon" variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <p className="text-xs text-gray-400">{bloco?.nome}</p>
          <h1 className="font-bold text-xl leading-tight">Enfermarias</h1>
        </div>
      </div>

      <div className="p-6">
        <TabelaGestao
          items={enfermarias}
          labelCriar="Nova Enfermaria"
          labelAcessar="Leitos"
          onCriar={() => setNovoOpen(true)}
          onAcessar={(id) => navigate(`/gestao/leitos/${blocoId}/${id}`)}
          onEditar={handleEditar}
          onToggleAtivo={handleToggle}
          onDeletar={handleDeletar}
          enableList={handleToggleDestaque}
        />
      </div>

      <NomearDialog
        open={novoOpen}
        titulo="Nova Enfermaria"
        label="Nome da enfermaria"
        placeholder="Ex: Enfermaria 01"
        onClose={() => setNovoOpen(false)}
        onConfirmar={handleCriar}
      />
    </div>
  );
}
