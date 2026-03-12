const API_BASE =
    import.meta.env.PUBLIC_API_URL || "http://localhost:8000/api/v1";

function normalizeApiError(payload: unknown): string {
    if (!payload || typeof payload !== "object") {
        return "Request failed";
    }

    const maybeDetail = (payload as { detail?: unknown }).detail;
    if (typeof maybeDetail === "string") {
        return maybeDetail;
    }

    if (Array.isArray(maybeDetail) && maybeDetail.length > 0) {
        const first = maybeDetail[0] as { msg?: unknown };
        if (typeof first?.msg === "string") {
            return first.msg;
        }
    }

    return "Request failed";
}

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
        const text = await response.text();
        if (!text) {
            throw new Error("Request failed");
        }

        try {
            const parsed = JSON.parse(text) as unknown;
            throw new Error(normalizeApiError(parsed));
        } catch {
            throw new Error(text);
        }
    }

    return (await response.json()) as T;
}
