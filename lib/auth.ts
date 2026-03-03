import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get the current session from cookies
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return null;
    }
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  return session;
}

/**
 * Get current user's role from custom claims
 */
export async function getUserRole(session?: any) {
  const user = session || (await getSession());
  if (!user) return null;

  // Role is stored in user metadata
  return user.user_metadata?.role || null;
}

/**
 * Get current user's department
 */
export async function getUserDepartment(session?: any) {
  const user = session || (await getSession());
  if (!user) return null;

  return user.user_metadata?.department_id || null;
}

/**
 * Get current user's tenant
 */
export async function getUserTenant(session?: any) {
  const user = session || (await getSession());
  if (!user) return null;

  return user.user_metadata?.tenant_id || null;
}
