import type { Usuario } from "@/model/model";
import { auth, db } from "@/service/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextData {
  user: User | null;
  profile: Usuario | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

const AUTH_PROFILE_KEY = "mapa-leitos:profile";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Usuario | null>(() => {
    try {
      const raw = sessionStorage.getItem(AUTH_PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await signOut(auth);
    sessionStorage.removeItem(AUTH_PROFILE_KEY);
    setProfile(null);
    setUser(null);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const cached = sessionStorage.getItem(AUTH_PROFILE_KEY);
        if (cached) {
          setProfile(JSON.parse(cached));
          setLoading(false);

          getDoc(doc(db, "usuarios", firebaseUser.uid)).then((snap) => {
            if (!snap.exists() || !snap.data()?.ativo) {
              logout();
              return;
            }
            const perfil = snap.data() as Usuario;
            sessionStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(perfil));
            setProfile(perfil);
          });
        } else {
          const snap = await getDoc(doc(db, "usuarios", firebaseUser.uid));
          if (!snap.exists() || !snap.data()?.ativo) {
            await signOut(auth);
            setLoading(false);
            return;
          }
          const perfil = snap.data() as Usuario;
          sessionStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(perfil));
          setProfile(perfil);
          setLoading(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        sessionStorage.removeItem(AUTH_PROFILE_KEY);
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
