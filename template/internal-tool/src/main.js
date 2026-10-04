const app = document.querySelector('#app');

app.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">OpsBoard</div>
      <nav>
        <a>Overview</a>
        <a>Customers</a>
        <a>Orders</a>
        <a>Fulfillment</a>
      </nav>
    </aside>
    <main class="content">
      <header class="header">
        <h1>Operations dashboard</h1>
        <button>Export</button>
      </header>
      <section class="cards">
        <article><span>Today</span><strong>1,284</strong><small>Orders</small></article>
        <article><span>Team</span><strong>18</strong><small>Active</small></article>
        <article><span>Issues</span><strong>03</strong><small>Open</small></article>
      </section>
      <section class="table">
        <div class="row header-row"><span>Customer</span><span>Stage</span><span>Value</span></div>
        <div class="row"><span>Alina Park</span><span>Review</span><span>$4.2k</span></div>
        <div class="row"><span>Cello Labs</span><span>Ready</span><span>$8.6k</span></div>
      </section>
    </main>
  </div>
`;

const style = document.createElement('style');
style.textContent = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, Arial, sans-serif; background: #f1f5f9; color: #0f172a; }
  .shell { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
  .sidebar { background: #0f172a; color: #e2e8f0; padding: 24px; }
  .brand { font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
  nav { display: grid; gap: 12px; margin-top: 24px; }
  nav a { color: #cbd5e1; text-decoration: none; }
  .content { padding: 24px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
  h1 { margin: 0; font-size: clamp(2rem, 3vw, 3rem); }
  button { padding: 10px 14px; background: #2563eb; color: white; border: none; border-radius: 10px; cursor: pointer; }
  .cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
  .cards article { background: white; border-radius: 18px; padding: 20px; border: 1px solid #e2e8f0; }
  .cards span, .cards small { display: block; color: #64748b; }
  .cards strong { display: block; font-size: 2rem; margin: 10px 0; }
  .table { background: white; border-radius: 18px; border: 1px solid #e2e8f0; margin-top: 24px; overflow: hidden; }
  .row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 14px 18px; border-bottom: 1px solid #e2e8f0; }
  .header-row { font-weight: 700; background: #f8fafc; }
  @media (max-width: 760px) { .shell { grid-template-columns: 1fr; } .cards { grid-template-columns: 1fr; } }
`;
document.head.appendChild(style);
