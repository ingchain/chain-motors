import { useEffect, useState, type ReactNode } from "react";

import { getAuthState } from "../../stores/authStore";

type Props = {
  requiredRole?: "client" | "admin";
  children: ReactNode;
};

export default function PrivateRouteGuard({ requiredRole, children }: Props) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const state = getAuthState();
    if (!state) {
      window.location.href = "/auth/login";
      return;
    }

    if (requiredRole && state.user.role !== requiredRole) {
      window.location.href = "/";
      return;
    }

    setAllowed(true);
  }, [requiredRole]);

  if (!allowed) {
    return <p className="text-sm text-chain-300">Verificando sesion...</p>;
  }

  return <>{children}</>;
}
