// layouts/protected-layout.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import type { UserRole } from "@/model/model";

interface Props {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

function ProtectedLayout({ allowedRoles, redirectTo = "/login" }: Props) {
  const { user, profile, loading } = useAuth();

  // Aguarda Firebase Auth e Firestore carregarem
  if (loading) return <div>Carregando...</div>;

  // Não autenticado
  if (!user) return <Navigate to="/login" replace />;

  // Autenticado mas perfil ainda não carregou
  if (!profile) return <div>Carregando...</div>;

  // Usuário desativado
  if (!profile.ativo) return <Navigate to="/login" replace />;

  // Role não permitido
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;
