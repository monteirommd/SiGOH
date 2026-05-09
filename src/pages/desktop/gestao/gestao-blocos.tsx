// pages/gestao/gestao-blocos.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabelaGestao, type ItemTabela } from "@/components/tabela-gestao";
import { NomearDialog } from "@/components/nomear-dialog";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/service/firebase";
import type { Bloco } from "@/model/model";
import { criarBloco, updateBloco, deletarBloco } from "@/service/estrutura";

export default function GestaoBlocos() {
  const navigate = useNavigate();
  const [blocos, setBlocos] = useState<ItemTabela[]>([]);
  const [blocosDesativados, setBlocosDesativados] = useState<ItemTabela[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoOpen, setNovoOpen] = useState(false);

  // Uma única query busca todos os blocos e divide localmente — evita 2 leituras
  useEffect(() => {
    getDocs(collection(db, "blocos"))
      .then((snap) => {
        const todos = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as unknown as Bloco,
        );
        setBlocos(
          todos
            .filter((b) => b.ativo)
            .map((b) => ({ id: b.id, nome: b.nome, ativo: b.ativo })),
        );
        setBlocosDesativados(
          todos
            .filter((b) => !b.ativo)
            .map((b) => ({ id: b.id, nome: b.nome, ativo: b.ativo })),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCriar = async (nome: string) => {
    const id = await criarBloco(nome);
    setBlocos((prev) => [...prev, { id, nome, ativo: true }]);
  };

  const handleEditar = async (id: string, nome: string) => {
    await updateBloco(id, { nome });
    setBlocos((prev) => prev.map((b) => (b.id === id ? { ...b, nome } : b)));
  };

  const handleToggle = async (id: string, ativo: boolean) => {
    await updateBloco(id, { ativo });
    setBlocos((prev) => prev.map((b) => (b.id === id ? { ...b, ativo } : b)));
  };

  const handleDeletar = async (id: string) => {
    await deletarBloco(id);
    setBlocos((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 px-6 py-4 bg-white shadow-sm border-b">
        <Button size="icon" variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="font-bold text-xl">Blocos</h1>
      </div>

      <div className="p-6">
        <TabelaGestao
          items={blocos}
          labelCriar="Novo Bloco"
          labelAcessar="Enfermarias"
          onCriar={() => setNovoOpen(true)}
          onAcessar={(id) => navigate(`/gestao/enfermarias/${id}`)}
          onEditar={handleEditar}
          onToggleAtivo={handleToggle}
          onDeletar={handleDeletar}
          disableItems={blocosDesativados}
        />
      </div>

      <NomearDialog
        open={novoOpen}
        titulo="Novo Bloco"
        label="Nome do bloco"
        placeholder="Ex: Bloco A"
        onClose={() => setNovoOpen(false)}
        onConfirmar={handleCriar}
      />
    </div>
  );
}
