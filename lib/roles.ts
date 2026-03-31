import { supabase } from './supabase'

export type AppRole = 'admin' | 'user' | 'guest'

export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)

  if (error || !data) return []
  return data.map((r) => r.role as AppRole)
}

export async function hasRole(userId: string, role: AppRole): Promise<boolean> {
  const roles = await getUserRoles(userId)
  return roles.includes(role)
}

export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, 'admin')
}
