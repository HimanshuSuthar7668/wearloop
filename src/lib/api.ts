const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const json = await response.json();
  // Unwrap the backend's { success, data } envelope
  return json.data !== undefined ? json.data : json;
}

// Auth
export const authApi = {
  register: (name: string, email: string, password: string) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),

  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string; role: string } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),
};

// Products
export const productsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/products${query}`);
  },
  getById: (id: string) => request(`/products/${id}`),
};

// Orders
export const ordersApi = {
  create: (data: object, token: string) =>
    request("/orders", { method: "POST", body: JSON.stringify(data), token }),

  getMyOrders: (token: string) =>
    request("/orders", { token }),

  cancel: (id: string, token: string) =>
    request(`/orders/${id}/cancel`, { method: "POST", token }),
};

// Payments
export const paymentsApi = {
  create: (data: object, token: string) =>
    request("/payments", { method: "POST", body: JSON.stringify(data), token }),

  getMyPayments: (token: string) =>
    request("/payments/my", { token }),
};

// Cart
export const cartApi = {
  addToCart: (productId: number, token: string) =>
    request<{ id: number; user_id: number; product_id: number; created_at: string }>(
      "/cart",
      { method: "POST", body: JSON.stringify({ productId }), token }
    ),

  checkInCart: (productId: number, token: string) =>
    request<{ inCart: boolean }>(`/cart/check/${productId}`, { token }),

  getAll: (token: string) =>
    request<{ id: number; user_id: number; product_id: number; created_at: string }[]>(
      "/cart",
      { token }
    ),
};

export default { authApi, productsApi, ordersApi, paymentsApi, cartApi };
