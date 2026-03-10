export type SessionUser = {
  name: string;
  email: string;
  role: "client" | "admin";
};

export type SessionState = {
  accessToken: string;
  user: SessionUser;
};

const SESSION_KEY = "chain_session";

export function saveSession(session: SessionState): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): SessionState | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
