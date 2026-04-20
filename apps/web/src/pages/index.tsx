import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>dshit.xyz - Satirical Web3 Meme Commerce</title>
        <meta
          name="description"
          content="Decentralized meme commerce platform on Base"
        />
      </Head>
      <main className="min-h-screen bg-bg-raw text-dirty-white">
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-6xl font-display font-bold text-shit-yellow mb-4">
            💩 DSHIT
          </h1>
          <p className="text-xl font-body mb-8">Phase 0: Foundation Scaffold</p>
          <p className="text-lg font-body text-text-dim">
            Monorepo initialized. Ready for Phase 1: Token Development.
          </p>
        </div>
      </main>
    </>
  );
}
