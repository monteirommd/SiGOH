// contexts/app-data-context.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/service/firebase";
import { useAuth } from "./auth-context";
import type { Bloco, Enfermaria, Leito } from "@/model/model";

interface AppDataContextType {
  blocos: Bloco[];
  enfermarias: Enfermaria[];
  leitos: Leito[];
  leitosByBloco: Map<string, Leito[]>;
  leitosByEnfermaria: Map<string, Leito[]>;
  enfermariasByBloco: Map<string, Enfermaria[]>;
  loading: boolean;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [enfermarias, setEnfermarias] = useState<Enfermaria[]>([]);
  const [leitos, setLeitos] = useState<Leito[]>([]);
  const [loading, setLoading] = useState(true);

  // Listener único para blocos — substitui getBlocos() em toda a app
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "blocos"), where("ativo", "==", true));
    const unsub = onSnapshot(q, (snap) => {
      setBlocos(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as Bloco),
      );
    });

    return unsub;
  }, [user]);

  // Listener único para enfermarias
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "enfermarias"), where("ativo", "==", true));
    const unsub = onSnapshot(q, (snap) => {
      setEnfermarias(
        snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as unknown as Enfermaria,
        ),
      );
    });

    return unsub;
  }, [user]);

  // Listener único para leitos
  useEffect(() => {
    if (!user || blocos.length === 0) return;

    const q = query(collection(db, "leitos"));
    const unsub = onSnapshot(q, (snap) => {
      setLeitos(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as Leito),
      );
      setLoading(false);
    });

    return unsub;
  }, [user, blocos]);

  // Maps derivados — O(1) lookup, recalcula só quando os arrays mudam
  const leitosByBloco = useMemo(() => {
    const m = new Map<string, Leito[]>();
    for (const l of leitos) {
      const arr = m.get(l.blocoId) ?? [];
      arr.push(l);
      m.set(l.blocoId, arr);
    }
    return m;
  }, [leitos]);

  const leitosByEnfermaria = useMemo(() => {
    const m = new Map<string, Leito[]>();
    for (const l of leitos) {
      const arr = m.get(l.enfermariaId) ?? [];
      arr.push(l);
      m.set(l.enfermariaId, arr);
    }
    return m;
  }, [leitos]);

  const enfermariasByBloco = useMemo(() => {
    const m = new Map<string, Enfermaria[]>();
    for (const e of enfermarias) {
      const arr = m.get(e.blocoId) ?? [];
      arr.push(e);
      m.set(e.blocoId, arr);
    }
    return m;
  }, [enfermarias]);

  return (
    <AppDataContext.Provider
      value={{
        blocos,
        enfermarias,
        leitos,
        leitosByBloco,
        leitosByEnfermaria,
        enfermariasByBloco,
        loading,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx)
    throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  return ctx;
}
