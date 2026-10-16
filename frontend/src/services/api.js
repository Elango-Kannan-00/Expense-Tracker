const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    const message = result?.message || (response.status === 401
      ? "Please log in."
      : `Request failed (${response.status})`);
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const signup = (details) =>
  request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(details),
  });

export const login = (credentials) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const getCurrentUser = () => request("/api/auth/me");

export const logout = () =>
  request("/api/auth/logout", {
    method: "POST",
  });

export const getExpenses = () => request("/api/expenses");

export const addExpense = (expense) =>
  request("/api/expenses", {
    method: "POST",
    body: JSON.stringify(expense),
  });

export const deleteExpense = (id) =>
  request(`/api/expenses/${id}`, {
    method: "DELETE",
  });
