const app = document.querySelector('#app');

app.innerHTML = `
  <div class="wrapper">
    <section class="hero">
      <span class="badge">Launch-ready</span>
      <h1>Build small products with speed and clarity.</h1>
      <p>Teptop app-lite is perfect for startup MVPs, niche ops tools, and fast internal products.</p>
      <div class="actions">
        <button class="primary">Launch MVP</button>
        <button>See roadmap</button>
      </div>
    </section>
    <section class="cards">
      <article>
        <span>Speed</span>
        <strong>2x</strong>
        <small>faster iteration</small>
      </article>
      <article>
        <span>Focus</span>
        <strong>1 app</strong>
        <small>single product flow</small>
      </article>
      <article>
        <span>Scale</span>
        <strong>∞</strong>
        <small>ready to grow</small>
      </article>
    </section>
  </div>
`;

const style = document.createElement('style');
style.textContent = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, Arial, sans-serif; background: linear-gradient(135deg, #f8fafc, #e2e8f0); color: #0f172a; }
  .wrapper { max-width: 1100px; margin: 0 auto; padding: 64px 24px 80px; }
  .hero { background: rgba(255,255,255,0.8); border: 1px solid #dbeafe; border-radius: 28px; padding: 40px; }
  .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; border-radius: 999px; padding: 6px 10px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; }
  h1 { font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1.05; margin: 18px 0; }
  p { color: #475569; line-height: 1.8; max-width: 620px; }
  .actions { display: flex; gap: 12px; margin-top: 20px; }
  button { border: 1px solid #cbd5e1; background: white; border-radius: 999px; padding: 12px 18px; cursor:pointer; }
  button.primary { background: #111827; color: white; border: none; }
  .cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-top: 28px; }
  .cards article { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 22px; }
  .cards span, .cards small { display: block; color: #64748b; }
  .cards strong { display: block; font-size: 2rem; margin: 10px 0; }
  @media (max-width: 760px) { .cards { grid-template-columns: 1fr; } }
`;
document.head.appendChild(style);
