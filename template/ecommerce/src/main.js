const app = document.querySelector('#app');

app.innerHTML = `
  <div class="storefront">
    <header class="nav">
      <div class="brand">Northlane</div>
      <nav>
        <a href="#new">New</a>
        <a href="#popular">Popular</a>
        <a href="#sale">Sale</a>
      </nav>
      <button>Cart (2)</button>
    </header>

    <section class="hero">
      <div>
        <span class="eyebrow">Spring drop</span>
        <h1>New essentials for fast everyday living.</h1>
        <p>Minimal, durable, and ready for the next chapter of your routine.</p>
        <div class="actions">
          <button class="primary">Shop now</button>
          <button>Browse collection</button>
        </div>
      </div>
      <div class="product-shot">Featured Drop</div>
    </section>

    <section class="grid">
      <article><strong>Alto Chair</strong><span>$129</span></article>
      <article><strong>Wick Lamp</strong><span>$89</span></article>
      <article><strong>Haven Tote</strong><span>$64</span></article>
    </section>
  </div>
`;

const style = document.createElement('style');
style.textContent = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, Arial, sans-serif; background: #f8fafc; color: #0f172a; }
  .storefront { max-width: 1200px; margin: 0 auto; padding: 24px; }
  .nav { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 30px; }
  .brand { font-size: 1.2rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
  nav { display: flex; gap: 18px; }
  a { color: #334155; text-decoration: none; }
  .hero { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 30px; align-items: center; }
  h1 { font-size: clamp(2.5rem, 5vw, 4.3rem); line-height: 1.05; margin: 16px 0; }
  p { color: #475569; line-height: 1.8; }
  .eyebrow { color: #db2777; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
  .actions { display: flex; gap: 12px; margin-top: 24px; }
  button { padding: 12px 18px; background: transparent; border: 1px solid #cbd5e1; border-radius: 999px; cursor:pointer; }
  button.primary { background: #111827; color: white; border: none; }
  .product-shot { min-height: 340px; display: grid; place-items: center; border-radius: 24px; background: linear-gradient(135deg, #e2e8f0, #fef3c7); font-weight: 700; }
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-top: 30px; }
  .grid article { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 22px; }
  .grid strong { display: block; margin-bottom: 8px; font-size: 1.1rem; }
  .grid span { color: #475569; }
  @media (max-width: 760px) { .hero, .grid { grid-template-columns: 1fr; display: block; } nav { display:none; } }
`;
document.head.appendChild(style);
