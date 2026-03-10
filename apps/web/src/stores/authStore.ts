import { clearSession, getSession, saveSession, type SessionState } from "../lib/session";

let authState: SessionState | null = null;

export function initAuthState(): SessionState | null {
  if (!authState) {
    authState = getSession();
  }
  return authState;
}

export function setAuthState(next: SessionState): void {
  authState = next;
  saveSession(next);
}

export function getAuthState(): SessionState | null {
  return authState || getSession();
}

export function logoutAuthState(): void {
  authState = null;
  clearSession();
}
