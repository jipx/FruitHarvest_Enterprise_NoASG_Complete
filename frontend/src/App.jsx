import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShoppingCart, Package, Truck, Database, ShieldCheck } from 'lucide-react';
import './style.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Card({ title, value, icon }) {
  return <div className="card"><div className="icon">{icon}</div><div><p>{title}</p><h2>{value}</h2></div></div>
}

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/products`).then(r => r.json()).then(setProducts).catch(() => setProducts([]));
    fetch(`${API_URL}/api/v1/orders`).then(r => r.json()).then(setOrders).catch(() => setOrders([]));
    fetch(`${API_URL}/api/v1/inventory`).then(r => r.json()).then(setInventory).catch(() => setInventory([]));
  }, []);

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">FruitHarvest Enterprise Platform</p>
          <h1>Customer portal, inventory operations, and AI review readiness.</h1>
          <p className="sub">Powered by CloudFront, S3, ALB, EC2, RDS MySQL, Cognito, SSM, and GitHub Actions.</p>
        </div>
        <div className="badge"><ShieldCheck /> No ASG baseline deployment</div>
      </section>

      <section className="grid">
        <Card title="Products" value={products.length} icon={<Package />} />
        <Card title="Orders" value={orders.length} icon={<ShoppingCart />} />
        <Card title="Inventory Rows" value={inventory.length} icon={<Database />} />
        <Card title="Delivery Mode" value="ALB + EC2" icon={<Truck />} />
      </section>

      <section className="panel">
        <h2>Product Catalogue</h2>
        <div className="products">
          {products.map(p => (
            <div className="product" key={p.product_id}>
              <div className="fruit">🍎</div>
              <h3>{p.product_name}</h3>
              <p>{p.category_name || 'Category'}</p>
              <strong>${Number(p.unit_price || 0).toFixed(2)}</strong>
              <span>{p.available_qty || 0} available</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Recent Orders</h2>
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Channel</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.order_id}>
                <td>{o.order_number}</td>
                <td>{o.customer_name}</td>
                <td>{o.order_channel}</td>
                <td><span className="status">{o.order_status}</span></td>
                <td>${Number(o.total_amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
