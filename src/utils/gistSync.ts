import { UserProfile } from '../types';
import { getGistConfig, readGist, writeGist } from './gistApi';

const USERS_KEY = 'peppa-users';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline' | 'unconfigured';

let status: SyncStatus = 'idle';
let debounceTimer: number | null = null;
const listeners: Set<(s: SyncStatus) => void> = new Set();

function setStatus(s: SyncStatus) {
  status = s;
  listeners.forEach(cb => cb(s));
}

export function getSyncStatus(): SyncStatus {
  return status;
}

export function addSyncListener(cb: (s: SyncStatus) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getLocalUsers(): Record<string, UserProfile> {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) return JSON.parse(data);
  } catch { /* corrupted */ }
  return {};
}

export async function initSync(): Promise<void> {
  const config = await getGistConfig();
  if (!config) {
    setStatus('unconfigured');
    return;
  }

  if (!navigator.onLine) {
    setStatus('offline');
    return;
  }

  setStatus('syncing');
  const result = await readGist(config);

  if (!result.success) {
    setStatus('error');
    return;
  }

  const remoteUsers = result.data!;
  const localUsers = getLocalUsers();
  const remoteHasData = Object.keys(remoteUsers).length > 0;
  const localHasData = Object.keys(localUsers).length > 0;

  if (remoteHasData) {
    localStorage.setItem(USERS_KEY, JSON.stringify(remoteUsers));
  } else if (localHasData) {
    await writeGist(config, localUsers);
  }

  setStatus('idle');
}

async function syncToGist(): Promise<void> {
  const config = await getGistConfig();
  if (!config) {
    setStatus('unconfigured');
    return;
  }

  if (!navigator.onLine) {
    setStatus('offline');
    return;
  }

  setStatus('syncing');
  const users = getLocalUsers();
  const result = await writeGist(config, users);

  if (!result.success) {
    await new Promise(r => setTimeout(r, 2000));
    const retry = await writeGist(config, getLocalUsers());
    if (!retry.success) {
      setStatus('error');
      return;
    }
  }

  setStatus('idle');
}

export function scheduleSyncToGist(): void {
  if (debounceTimer !== null) {
    window.clearTimeout(debounceTimer);
  }
  debounceTimer = window.setTimeout(() => {
    debounceTimer = null;
    syncToGist();
  }, 500);
}

window.addEventListener('online', () => {
  if (status === 'offline') {
    syncToGist();
  }
});

window.addEventListener('offline', () => {
  setStatus('offline');
});
