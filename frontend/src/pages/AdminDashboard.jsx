import {
  Activity,
  Brain,
  Cloud,
  Database,
  LockKeyhole,
  ServerCog
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <main className="container">
      <section className="hero">
        <div className="hero-card">
          <div className="eyebrow">Admin Portal</div>
          <h1 className="hero-title">Enterprise control plane</h1>
          <p className="hero-text">
            Admins manage platform configuration, security posture, AI workflow
            controls, deployment status, monitoring, and cloud infrastructure
            visibility.
          </p>
        </div>

        <div className="hero-side">
          <div className="metric-card">
            <div className="metric-label">Environment</div>
            <div className="metric-value">Prod</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Security Status</div>
            <div className="metric-value">Healthy</div>
          </div>
        </div>
      </section>

      <section className="grid grid-3">
        <div className="card">
          <Cloud size={32} />
          <h3>Frontend Delivery</h3>
          <p className="product-desc">
            S3 static hosting with CloudFront distribution and GitHub Actions
            deployment.
          </p>
          <span className="badge">S3 + CloudFront</span>
        </div>

        <div className="card">
          <ServerCog size={32} />
          <h3>Backend Workload</h3>
          <p className="product-desc">
            Backend APIs can run on EC2 Node.js, Lambda, or mixed workload
            architecture.
          </p>
          <span className="badge">API + EC2</span>
        </div>

        <div className="card">
          <Database size={32} />
          <h3>Data Layer</h3>
          <p className="product-desc">
            Product and order data can be stored in RDS, DynamoDB, or separated
            by workload type.
          </p>
          <span className="badge">RDS / DynamoDB</span>
        </div>

        <div className="card">
          <Brain size={32} />
          <h3>AI Order Extraction</h3>
          <p className="product-desc">
            WhatsApp orders are mapped from unstructured text into structured
            JSON for validation.
          </p>
          <span className="badge warning">Human Review</span>
        </div>

        <div className="card">
          <Activity size={32} />
          <h3>Monitoring</h3>
          <p className="product-desc">
            CloudWatch dashboards, alarms, logs, deployment status, and
            operational metrics.
          </p>
          <span className="badge">CloudWatch</span>
        </div>

        <div className="card">
          <LockKeyhole size={32} />
          <h3>Security</h3>
          <p className="product-desc">
            IAM least privilege, GitHub OIDC, KMS encryption, WAF, and
            centralized audit logging.
          </p>
          <span className="badge">IAM + OIDC</span>
        </div>
      </section>
    </main>
  );
}
