export interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function fetcher<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(fetchOptions.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Request failed (${response.status})`
      );
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}