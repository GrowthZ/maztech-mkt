export async function clearBrowserSessionState() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.clear();
  } catch {
    // Ignore storage access errors.
  }

  try {
    window.sessionStorage.clear();
  } catch {
    // Ignore storage access errors.
  }

  try {
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0]?.trim();
      if (!name) return;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    });
  } catch {
    // Ignore cookie cleanup errors.
  }

  try {
    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }
  } catch {
    // Ignore Cache Storage errors.
  }

  try {
    const indexedDb = window.indexedDB as IDBFactory & { databases?: () => Promise<Array<{ name?: string }>> };
    if (typeof indexedDb.databases === 'function') {
      const databases = await indexedDb.databases();
      await Promise.all(
        databases
          .map((database) => database.name)
          .filter((name): name is string => Boolean(name))
          .map((name) => new Promise<void>((resolve) => {
            const request = window.indexedDB.deleteDatabase(name);
            request.onsuccess = () => resolve();
            request.onerror = () => resolve();
            request.onblocked = () => resolve();
          }))
      );
    }
  } catch {
    // Ignore IndexedDB cleanup errors.
  }
}

export async function logoutAndClearClientState() {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include', keepalive: true });
  } catch {
    // Continue cleanup even if logout API call fails.
  }

  await clearBrowserSessionState();
}
