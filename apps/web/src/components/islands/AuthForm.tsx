import { useState, type FormEvent } from "react";

import { apiRequest } from "../../lib/api";
import { setAuthState } from "../../stores/authStore";

type Mode = "login" | "register";

type Props = {
  mode: Mode;
};

type AuthResponse = {
  access_token: string;
  role: "client" | "admin";
  name: string;
  email: string;
};

export default function AuthForm({ mode }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLabel = mode === "login" ? "Iniciar Sesion" : "Crear Cuenta";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Correo invalido");
      return;
    }

    if (password.length < 8) {
      setError("La contrasena debe tener al menos 8 caracteres");
      return;
    }

    if (mode === "register") {
      if (name.trim().length < 2) {
        setError("Nombre invalido");
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contrasenas no coinciden");
        return;
      }
    }

    setLoading(true);

    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login" ? { email, password } : { name, email, password };
      const data = await apiRequest<AuthResponse>(path, {
        method: "POST",
        body: JSON.stringify(body)
      });

      setAuthState({
        accessToken: data.access_token,
        user: {
          name: data.name,
          email: data.email,
          role: data.role
        }
      });

      window.location.href = data.role === "admin" ? "/dashboard/admin" : "/dashboard/cliente";
    } catch {
      setError("No se pudo autenticar. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="neon-border mx-auto max-w-md rounded-xl bg-chain-900/30 p-6">
      <h1 className="font-display text-xl uppercase tracking-wider text-chain-100">{submitLabel}</h1>

      {mode === "register" && (
        <input
          className="mt-4 w-full rounded-md border border-chain-500/70 bg-chain-950/60 px-3 py-2 text-sm"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        className="mt-4 w-full rounded-md border border-chain-500/70 bg-chain-950/60 px-3 py-2 text-sm"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="mt-4 w-full rounded-md border border-chain-500/70 bg-chain-950/60 px-3 py-2 text-sm"
        placeholder="Contrasena"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {mode === "register" && (
        <input
          className="mt-4 w-full rounded-md border border-chain-500/70 bg-chain-950/60 px-3 py-2 text-sm"
          placeholder="Confirmar contrasena"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}

      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-md border border-chain-500 bg-chain-500/20 px-3 py-2 text-sm font-medium text-chain-50 shadow-neon"
      >
        {loading ? "Procesando..." : submitLabel}
      </button>
    </form>
  );
}
