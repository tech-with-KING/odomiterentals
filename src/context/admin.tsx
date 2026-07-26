'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';

export interface AdminDetails {
  name: string;
  privilege: 'dev' | 'admin';
  email: string;
}

interface AdminContextValue {
  isAdmin: boolean;
  /** True until we know one way or the other — never redirect while this is true. */
  isLoading: boolean;
  adminDetails: AdminDetails | undefined;
  refetch: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

/**
 * Resolves the signed-in user's admin row once for the whole tree.
 *
 * The `admins` table is protected by a "self read" RLS policy, so this query
 * returns the caller's own row and nothing else — a non-admin simply gets null.
 */
export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useAuth();
  const email = user?.email;

  const [adminDetails, setAdminDetails] = useState<AdminDetails | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = useCallback(async () => {
    if (!email) {
      setAdminDetails(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('name, privilege, email')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      setAdminDetails((data as AdminDetails | null) ?? undefined);
    } catch (error) {
      console.error('Error while checking admin status:', error);
      setAdminDetails(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(true);
      return;
    }
    checkAdminStatus();
  }, [isLoaded, checkAdminStatus]);

  const value = useMemo<AdminContextValue>(
    () => ({
      isAdmin: !!adminDetails,
      isLoading: !isLoaded || isLoading,
      adminDetails,
      refetch: checkAdminStatus,
    }),
    [adminDetails, isLoaded, isLoading, checkAdminStatus]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminCheck() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdminCheck must be used within an AdminProvider');
  return ctx;
}
