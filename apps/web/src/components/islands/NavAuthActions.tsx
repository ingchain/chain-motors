import { useEffect, useState } from "react";

import { getAuthState, logoutAuthState } from "../../stores/authStore";

type Role = "client" | "admin";

type AuthSnapshot = {
  role: Role;
  name: string;
} | null;

export default function NavAuthActions() {
  const [session, setSession] = useState<AuthSnapshot>(null);

  useEffect(() => {
    const current = getAuthState();
    if (!current) {
      setSession(null);
      return;
    }

    setSession({
      role: current.user.role,
      name: current.user.name
    });
  }, []);

  function onLogout() {
    logoutAuthState();
    setSession(null);
    window.location.href = "/";
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="/auth/login"
          className="rounded-md border border-chain-700 bg-white px-3 py-1.5 text-xs font-semibold text-chain-200 transition hover:bg-chain-900"
        >
          Login
        </a>
        <a
          href="/auth/register"
          className="rounded-md border border-chain-500 bg-chain-500 px-3 py-1.5 text-xs font-semibold text-white shadow-neon transition hover:bg-blue-700"
        >
          Registro
        </a>
      </div>
    );
  }

  const dashboardHref = session.role === "admin" ? "/dashboard/admin" : "/dashboard/cliente";

  return (
    <div className="flex items-center gap-2">
      <a
        href={dashboardHref}
        className="rounded-md border border-chain-500 bg-chain-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
      >
        Panel
      </a>
      <button
        type="button"
        onClick={onLogout}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Cerrar sesion
      </button>
    </div>
  );
}