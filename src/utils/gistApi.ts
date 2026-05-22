import { UserProfile } from '../types';

const GIST_FILE_NAME = 'peppa-users.json';
const LS_TOKEN_KEY = 'peppa-gist-token';
const LS_GIST_ID_KEY = 'peppa-gist-id';

export interface GistConfig {
  gistId: string;
  token: string;
}

interface GistResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function deobfuscate(encoded: string): string {
  const reversed = encoded.split('').reverse().join('');
  return atob(reversed);
}

let remoteConfigCache: GistConfig | null = null;

async function loadRemoteConfig(): Promise<GistConfig | null> {
  if (remoteConfigCache) return remoteConfigCache;
  try {
    const base = import.meta.env.BASE_URL || '/';
    const res = await fetch(`${base}sync-config.json`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.g || !json.k) return null;
    if (json.k === 'PASTE_YOUR_TOKEN_HERE') return null;
    const token = json.k.startsWith('ghp_') ? json.k : deobfuscate(json.k);
    remoteConfigCache = { gistId: json.g, token };
    return remoteConfigCache;
  } catch {
    return null;
  }
}

export function setGistConfig(token: string, gistId: string): void {
  localStorage.setItem(LS_TOKEN_KEY, token);
  localStorage.setItem(LS_GIST_ID_KEY, gistId);
}

export function clearGistConfig(): void {
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_GIST_ID_KEY);
}

function getLocalStorageConfig(): GistConfig | null {
  const token = localStorage.getItem(LS_TOKEN_KEY);
  const gistId = localStorage.getItem(LS_GIST_ID_KEY);
  if (token && gistId) return { token, gistId };
  return null;
}

function getEnvConfig(): GistConfig | null {
  const token = import.meta.env.VITE_GIST_TOKEN;
  const gistId = import.meta.env.VITE_GIST_ID;
  if (token && gistId) return { token, gistId };
  return null;
}

export async function getGistConfig(): Promise<GistConfig | null> {
  const local = getLocalStorageConfig();
  if (local) return local;

  const remote = await loadRemoteConfig();
  if (remote) return remote;

  return getEnvConfig();
}

export async function readGist(config: GistConfig): Promise<GistResult<Record<string, UserProfile>>> {
  try {
    const res = await fetch(`https://api.github.com/gists/${config.gistId}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }

    const gist = await res.json();
    const file = gist.files?.[GIST_FILE_NAME];
    if (!file || !file.content) {
      return { success: true, data: {} };
    }

    const data = JSON.parse(file.content) as Record<string, UserProfile>;
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}

export async function writeGist(config: GistConfig, users: Record<string, UserProfile>): Promise<GistResult<void>> {
  try {
    const res = await fetch(`https://api.github.com/gists/${config.gistId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [GIST_FILE_NAME]: {
            content: JSON.stringify(users, null, 2),
          },
        },
      }),
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}
