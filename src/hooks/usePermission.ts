import { useAuth } from "@/context/auth-context";
import type { UserRole } from "@/model/model";

export function usePermission(roles: UserRole[]): boolean {
  const { profile } = useAuth();
  if (!profile) return false;
  return roles.includes(profile.role);
}
