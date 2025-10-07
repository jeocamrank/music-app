import { useAuth } from "@/hook/useAuth";


export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  return <>{children}</>;
};

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading || user) return null;
  return <>{children}</>;
};
