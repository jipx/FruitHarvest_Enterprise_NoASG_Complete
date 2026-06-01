const API_URL = import.meta.env.VITE_API_URL || "";

function buildUrl(path) {
  const base = API_URL.replace(/\/$/, "");
  return `${base}${path}`;
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function getProducts() {
  try {
    const data = await request("/products");
    return Array.isArray(data) ? data : data.items || data.products || [];
  } catch (error) {
    console.warn("Using demo products because API failed:", error.message);

    return [
      {
        id: "apple-001",
        name: "Premium Apples",
        description: "Fresh red apples for retail and bulk orders.",
        price: 2.5,
        stock: 120,
        icon: "🍎"
      },
      {
        id: "orange-001",
        name: "Sweet Oranges",
        description: "Juicy oranges suitable for family and office orders.",
        price: 3.2,
        stock: 95,
        icon: "🍊"
      },
      {
        id: "banana-001",
        name: "Banana Bundle",
        description: "Fresh banana bundle with daily harvest quality.",
        price: 1.8,
        stock: 150,
        icon: "🍌"
      },
      {
        id: "mango-001",
        name: "Golden Mangoes",
        description: "Premium mangoes for seasonal customer orders.",
        price: 5.5,
        stock: 60,
        icon: "🥭"
      }
    ];
  }
}

export async function createCustomerOrder(order) {
  try {
    return await request("/orders", {
      method: "POST",
      body: JSON.stringify(order)
    });
  } catch (error) {
    console.warn("Using demo order response because API failed:", error.message);

    return {
      orderId: `DEMO-${Date.now()}`,
      status: "SUBMITTED"
    };
  }
}

export async function getOrders() {
  try {
    const data = await request("/orders");
    return Array.isArray(data) ? data : data.items || data.orders || [];
  } catch (error) {
    console.warn("Using demo orders because API failed:", error.message);

    return [
      {
        id: "ORD-1001",
        customerName: "Mary Tan",
        channel: "WEB",
        status: "SUBMITTED",
        total: 24.5
      },
      {
        id: "ORD-1002",
        customerName: "Ahmad",
        channel: "WHATSAPP",
        status: "AI_REVIEW",
        total: 42.0
      },
      {
        id: "ORD-1003",
        customerName: "Siti",
        channel: "WEB",
        status: "CONFIRMED",
        total: 18.2
      }
    ];
  }
}