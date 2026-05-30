import { useEffect, useState } from "react";
import { ClipboardList, MessageSquareText, PackageCheck } from "lucide-react";
import { getOrders } from "../api/client";

function statusBadge(status) {
  if (status === "AI_REVIEW") {
    return <span className="badge warning">AI Review</span>;
  }

  if (status === "FAILED") {
    return <span className="badge danger">Failed</span>;
  }

  if (status === "CONFIRMED") {
    return <span className="badge">Confirmed</span>;
  }

  return <span className="badge warning">{status || "Submitted"}</span>;
}

export default function StaffDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      const items = await getOrders();
      setOrders(items);
    }

    loadOrders();
  }, []);

  return (
    <main className="container">
      <section className="hero">
        <div className="hero-card">
          <div className="eyebrow">Staff Operations</div>
          <h1 className="hero-title">Order control center</h1>
          <p className="hero-text">
            Staff can monitor customer web orders, WhatsApp AI-extracted orders,
            fulfillment status, and review items that need human approval.
          </p>
        </div>

        <div className="hero-side">
          <div className="metric-card">
            <div className="metric-label">Open Orders</div>
            <div className="metric-value">{orders.length}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">AI Review Queue</div>
            <div className="metric-value">
              {orders.filter((order) => order.status === "AI_REVIEW").length}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-3" style={{ marginBottom: "24px" }}>
        <div className="card">
          <ClipboardList size={28} />
          <h3>Order Intake</h3>
          <p className="product-desc">
            Manage orders submitted from customer web portal and API channels.
          </p>
        </div>

        <div className="card">
          <MessageSquareText size={28} />
          <h3>WhatsApp Review</h3>
          <p className="product-desc">
            Review uncertain AI entity extraction from WhatsApp order messages.
          </p>
        </div>

        <div className="card">
          <PackageCheck size={28} />
          <h3>Fulfillment</h3>
          <p className="product-desc">
            Confirm inventory availability and update delivery status.
          </p>
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">Recent Orders</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id || order.orderId}>
                <td>{order.id || order.orderId}</td>
                <td>{order.customerName}</td>
                <td>{order.channel}</td>
                <td>{statusBadge(order.status)}</td>
                <td>${Number(order.total || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
