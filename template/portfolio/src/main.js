const app = document.querySelector('#app');

app.innerHTML = `
  <div class="page">
    <header class="nav">
      <div class="brand">Ava Stone</div>
      <nav>
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div>
          <span class="eyebrow">Product designer • builder</span>
          <h1>I design digital products that feel clear and fast.</h1>
          <p>I help startups turn complex ideas into calm, high-converting experiences.</p>
          <div class="actions">
            <button class="primary">View projects</button>
            <button>Contact</button>
          </div>
        </div>
        <div class="photo-card">
          <div class="circle">AS</div>
        </div>
      </section>

      <section id="work" class="projects">
        <article><strong>NovaFlow</strong><span>Growth platform</span></article>
        <article><strong>Northstar</strong><span>Analytics suite</span></article>
        <article><strong>Mercury</strong><span>SaaS design system</span></article>
      </section>
    </main>
  </div>
`;

const style = document.createElement('style');
style.textContent = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, Arial, sans-serif; background: #f8fafc; color: #0f172a; }
  .page { max-width: 1180px; margin: 0 auto; padding: 24px 24px 80px; }
  .nav { display: flex; align-items: center; justify-content: space-between; padding: 18px 0; }
  .brand { font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
  nav { display: flex; gap: 20px; }
  a { color: #334155; text-decoration: none; }
  .hero { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 28px; align-items: center; padding: 52px 0; }
  h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1.04; margin: 16px 0; }
  p { color: #475569; line-height: 1.8; }
  .eyebrow { color: #7c3aed; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; font-size: 12px; }
  .actions { display: flex; gap: 12px; margin-top: 18px; }
  button { background: transparent; border: 1px solid #cbd5e1; border-radius: 999px; padding: 12px 18px; cursor: pointer; }
  button.primary { background: #0f172a; color: white; border: none; }
  .photo-card { display: grid; place-items: center; min-height: 360px; background: linear-gradient(135deg, #e2e8f0, #c7d2fe); border-radius: 32px; }
  .circle { width: 180px; height: 180px; border-radius: 50%; display: grid; place-items: center; font-size: 3rem; font-weight: 800; background: #fff; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12); }
  .projects { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-top: 18px; }
  .projects article { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 20px; }
  .projects strong { display: block; font-size: 1.15rem; margin-bottom: 8px; }
  .projects span { color: #64748b; }
  @media (max-width: 760px) {
    .hero, .projects { grid-template-columns: 1fr; display: block; }
    nav { display: none; }
  }
`;
document.head.appendChild(style);
