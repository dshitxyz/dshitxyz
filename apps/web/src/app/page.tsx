export default function Home() {
  return (
    <main className="min-h-screen bg-bg-raw">
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-display text-6xl md:text-8xl mb-8 text-shit-yellow glitch-text" data-text="DSHIT">
          DSHIT
        </h1>
        <p className="font-body text-2xl text-text-dim mb-8">
          Decentralized Meme Warfare & Political Retribution Protocol
        </p>
        <p className="font-body text-lg text-text-dim mb-8 max-w-2xl">
          Brutalist design, token economics, and meme-driven commerce on Base.
        </p>
        <div className="flex gap-4">
          <button className="shit-button">Connect Wallet</button>
          <button className="shit-button bg-shit-brown text-text-shit">Explore Memes</button>
        </div>
      </div>
    </main>
  );
}
