const API_BASE =
    import.meta.env.PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function apiRequest<T>(
    path: string,
    options: RequestInit = {},
    accessToken?: string,
): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Request failed");
    }

    return (await response.json()) as T;
}
