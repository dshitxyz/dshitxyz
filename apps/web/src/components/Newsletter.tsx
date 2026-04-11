'use client';

import { useState } from 'react';
import { Button } from '@dshit/ui';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="mb-12">
      <div className="brutalist-border p-8 md:p-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <h2 className="text-2xl md:text-3xl font-display text-shit-yellow mb-4 font-bold">
          SLIDE INTO THE BOWL
        </h2>

        <p className="text-gray-300 text-lg mb-8 font-body">
          Get exclusive drops, protocol updates, and meme warfare alerts delivered straight to your
          inbox. No spam. Just pure degen energy.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 border-2 border-shit-yellow bg-gray-900 text-white font-body focus:outline-none focus:ring-2 focus:ring-shit-yellow"
          />
          <Button variant="main" type="submit">
            FLUSH IT
          </Button>
        </form>

        {submitted && (
          <div className="text-toxic-green text-lg font-body mb-8">
            ✓ Thanks for joining the chaos! Check your email.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-body text-gray-300">
          <div className="flex items-start gap-3">
            <span className="text-shit-yellow text-xl">✨</span>
            <div>
              <p className="font-bold text-white mb-1">Weekly Drops</p>
              <p>New protocols, memes, and chaos every week</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-shit-yellow text-xl">⚡</span>
            <div>
              <p className="font-bold text-white mb-1">Flash Alerts</p>
              <p>Break news about the protocol and ecosystem</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-shit-yellow text-xl">🔥</span>
            <div>
              <p className="font-bold text-white mb-1">Meme Warriors</p>
              <p>Contest winners and viral content highlights</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
