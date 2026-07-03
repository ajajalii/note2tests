const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://note2tests.onrender.com";

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

export function clearSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    clearSession();
    return null;
  }

  const response = await fetch(apiUrl("/api/token/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    return null;
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access);

  if (data.refresh) {
    localStorage.setItem("refresh_token", data.refresh);
  }

  return data.access;
}

export async function apiFetch(path, options = {}) {
  const { auth = false, retryOnUnauthorized = true, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});
  const accessToken = localStorage.getItem("access_token");

  if (auth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(apiUrl(path), {
    ...fetchOptions,
    headers,
  });

  if (auth && response.status === 401 && retryOnUnauthorized) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      response = await fetch(apiUrl(path), {
        ...fetchOptions,
        headers,
      });
    }
  }

  return response;
}
