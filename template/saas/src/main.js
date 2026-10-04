const app = document.querySelector('#app');

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <div class="brand">Teptop SaaS</div>
      <nav>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#customers">Customers</a>
      </nav>
      <button>Book demo</button>
    </header>

    <main>
      <section class="hero">
        <div>
          <span class="eyebrow">Fast product workflow</span>
          <h1>Ship your SaaS faster without heavy framework drag.</h1>
          <p>Teptop helps product teams build confident dashboards, marketing pages, and internal tools with modern DX.</p>
          <div class="actions">
            <button class="primary">Start free</button>
            <button>View docs</button>
          </div>
        </div>
        <div class="panel">
          <div class="card metric">
            <span>MRR</span>
            <strong>$124k</strong>
            <small>+24.8% this month</small>
          </div>
          <div class="card small">Activation 64%</div>
          <div class="card small">NPS 72</div>
        </div>
      </section>

      <section id="features" class="grid">
        <article class="feature">
          <h3>Instant shipping</h3>
          <p>Launch MVPs with focused templates and production-aware architecture.</p>
        </article>
        <article class="feature">
          <h3>Full-stack ready</h3>
          <p>Blend UI, routing, API flows, and business logic in one cohesive system.</p>
        </article>
        <article class="feature">
          <h3>Deploy confidently</h3>
          <p>Use static hosting, Node deployments, or server-driven SSR patterns.</p>
        </article>
      </section>
    </main>
  </div>
`;

const style = document.createElement('style');
style.textContent = `
  :root {
    --bg: #08101f;
    --panel: rgba(17, 24, 39, 0.9);
    --panel-strong: #111827;
    --border: rgba(148, 163, 184, 0.2);
    --text: #f8fafc;
    --muted: #cbd5e1;
    --accent: #7c3aed;
    --accent-2: #22c55e;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: Inter, Arial, sans-serif; background: linear-gradient(135deg, #020817, #111827 50%, #0f172a); color: var(--text);
  }
  .shell { max-width: 1180px; margin: 0 auto; padding: 24px 24px 80px; }
  .topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; border: 1px solid var(--border); background: rgba(15, 23, 42, 0.7); border-radius: 18px; padding: 16px 18px; }
  .brand { font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
  nav { display: flex; gap: 18px; }
  nav a { color: var(--muted); text-decoration: none; }
  button { background: transparent; color: var(--text); border: 1px solid var(--border); border-radius: 10px; padding: 10px 16px; cursor: pointer; }
  button.primary { background: linear-gradient(90deg, var(--accent), #2563eb); border: none; }
  .hero { display: grid; grid-template-columns: 1.3fr 0.8fr; gap: 32px; align-items: center; padding: 56px 0; }
  h1 { font-size: clamp(2.5rem, 4vw, 4.4rem); line-height: 1.05; margin: 16px 0; }
  p { color: var(--muted); line-height: 1.7; }
  .eyebrow { color: #a78bfa; text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; font-weight: 700; }
  .actions { display: flex; gap: 12px; margin-top: 24px; }
  .panel { display: grid; gap: 16px; }
  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 18px; padding: 20px; }
  .metric strong { display: block; font-size: 2.2rem; margin: 12px 0 6px; }
  .metric small { color: #86efac; }
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 18px; }
  .feature { border: 1px solid var(--border); border-radius: 18px; background: rgba(15, 23, 42, 0.75); padding: 22px; }
  @media (max-width: 800px) {
    .hero, .grid, .topbar { grid-template-columns: 1fr; display: block; }
    nav { display: none; }
    .topbar { display: flex; flex-wrap: wrap; }
  }
`;
document.head.appendChild(style);
