import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <main style={{ padding: '2rem' }}>
        <h1>🚀 dshit.xyz</h1>
        <p>Decentralized meme platform powered by DSHIT token</p>

        <section style={{ marginTop: '2rem' }}>
          <h2>Coming Soon</h2>
          <p>Phase 1: Token contract deployed ✅</p>
          <p>Phase 2: Frontend under development 🚧</p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h3>Features</h3>
          <ul>
            <li>💰 DSHIT ERC-20 token on Base L2</li>
            <li>🎨 Meme creation and sharing</li>
            <li>🛍️ Prank product marketplace</li>
            <li>🤝 Community governance</li>
            <li>🔐 Anonymous identity system</li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
