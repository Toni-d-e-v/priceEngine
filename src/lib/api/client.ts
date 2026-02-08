const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  if (USE_MOCK) {
    const { getMockData } = await import('./mock-data');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const data = getMockData(endpoint);
    if (data === null) throw new ApiError(404, `Nicht gefunden: ${endpoint}`);
    return data as T;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
  });

  if (!res.ok) throw new ApiError(res.status, await res.text());
  const json = await res.json();
  return json.data as T;
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 100));
    // In Phase 0 geben wir den Body zurück (simuliertes Erstellen)
    return body as T;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new ApiError(res.status, await res.text());
  const json = await res.json();
  return json.data as T;
}

export async function apiPut<T>(endpoint: string, body: unknown): Promise<T> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return body as T;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new ApiError(res.status, await res.text());
  const json = await res.json();
  return json.data as T;
}

export async function apiDelete(endpoint: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
  });

  if (!res.ok) throw new ApiError(res.status, await res.text());
}

export { ApiError };
