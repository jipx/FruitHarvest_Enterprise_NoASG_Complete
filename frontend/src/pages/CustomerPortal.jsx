import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, Truck } from "lucide-react";
import { createCustomerOrder, getProducts } from "../api/client";

export default function CustomerPortal() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);

      try {
        const items = await getProducts();
        setProducts(items);
      } catch (error) {
        setStatus("Unable to load products.");
        setStatusType("error");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 0);
    }, 0);
  }, [cart]);

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          quantity: 1
        }
      ]);
    }

    setStatus(`${product.name} added to cart.`);
    setStatusType("success");
  }

  function decreaseQuantity(productId) {
    setCart(
      cart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart(cart.filter((item) => item.id !== productId));
  }

  async function submitOrder() {
    if (!customerName.trim()) {
      setStatus("Please enter customer name.");
      setStatusType("error");
      return;
    }

    if (!phone.trim()) {
      setStatus("Please enter phone number.");
      setStatusType("error");
      return;
    }

    if (cart.length === 0) {
      setStatus("Please add at least one product to cart.");
      setStatusType("error");
      return;
    }

    const order = {
      customerName,
      phone,
      deliveryAddress,
      channel: "WEB",
      status: "SUBMITTED",
      items: cart,
      total
    };

    try {
      const result = await createCustomerOrder(order);

      setStatus(
        `Order submitted successfully. Order ID: ${
          result.orderId || result.id || "Created"
        }`
      );
      setStatusType("success");
      setCart([]);
      setCustomerName("");
      setPhone("");
      setDeliveryAddress("");
    } catch (error) {
      setStatus("Order submission failed. Please try again.");
      setStatusType("error");
    }
  }

  return (
    <main className="container">
      <section className="hero">
        <motion.div
          className="hero-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="eyebrow">Customer Portal</div>

          <h1 className="hero-title">Order fresh fruits online</h1>

          <p className="hero-text">
            Customers can browse available fruits, add items to cart, and submit
            orders directly from the web portal. The same backend can also
            support WhatsApp orders through the AI extraction workflow.
          </p>
        </motion.div>

        <div className="hero-side">
          <div className="metric-card">
            <div className="metric-label">Products Available</div>
            <div className="metric-value">{products.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Cart Items</div>
            <div className="metric-value">{cart.length}</div>
          </div>
        </div>
      </section>

      <section className="customer-layout">
        <div>
          <h2 className="section-title">Fresh Products</h2>

          {loading ? (
            <div className="empty">Loading products...</div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <motion.article
                  key={product.id}
                  className="card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="product-image">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <span>{product.icon || "🍏"}</span>
                    )}
                  </div>

                  <div className="product-name">{product.name}</div>

                  <div className="product-desc">
                    {product.description ||
                      "Freshly harvested product available for customer orders."}
                  </div>

                  <div className="product-footer">
                    <div>
                      <div className="price">
                        ${Number(product.price || 0).toFixed(2)}
                      </div>
                      <div className="cart-meta">
                        Stock: {product.stock ?? "Available"}
                      </div>
                    </div>

                    <button className="button" onClick={() => addToCart(product)}>
                      Add
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        <aside className="panel">
          <h2 className="section-title">Customer Order</h2>

          <div className="form">
            <input
              className="input"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Customer name"
            />

            <input
              className="input"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone number"
            />

            <input
              className="input"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              placeholder="Delivery address"
            />
          </div>

          <div className="cart-list">
            {cart.length === 0 && <div className="empty">Cart is empty.</div>}

            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <div className="cart-name">{item.name}</div>
                  <div className="cart-meta">
                    Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    className="button secondary"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </button>

                  <button
                    className="button danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-item">
            <div>
              <div className="cart-name">Total</div>
              <div className="cart-meta">Before tax and delivery adjustment</div>
            </div>

            <div className="price">${total.toFixed(2)}</div>
          </div>

          <button className="button full" onClick={submitOrder}>
            Submit Order
          </button>

          {status && (
            <div className={`status ${statusType === "error" ? "error" : ""}`}>
              {statusType === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <ShoppingBag size={18} />
              )}{" "}
              {status}
            </div>
          )}

          <div className="status" style={{ marginTop: "18px" }}>
            <Truck size={18} /> Order will be routed to staff dashboard for
            confirmation and fulfillment.
          </div>
        </aside>
      </section>
    </main>
  );
}
