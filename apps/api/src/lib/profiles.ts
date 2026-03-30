// Generate random anonymous profiles

const PSEUDONYMS = [
  'ChaosCretin', 'MemeWizard', 'ShitPostKing', 'GlitchGremlin', 'VoidVandal',
  'PixelPunk', 'NoiseNinja', 'ByteBastard', 'GodGoblin', 'SyntaxSinner',
  'CodeCriminal', 'LoopLunatic', 'ReactRebel', 'ConsoleClown', 'DebugDemon',
  'ErrorEldrich', 'StackStorm', 'QueueQuester', 'TreeTraitor', 'GraphGhost',
  'BlockBuilder', 'ChainChampion', 'HashHunter', 'NonceNimble', 'GasGoblin',
  'FunctionFiend', 'VariableVampire', 'StringSlayer', 'ObjectOverseer', 'ArrayArcane',
];

const COLORS = [
  '#F4D03F', // shit-yellow
  '#8B4513', // shit-brown
  '#FF0000', // glitch-red
  '#39FF14', // toxic-green
  '#BF00FF', // cyber-purple
  '#FF6600', // industrial-orange
];

export function generateAnonymousProfile() {
  const pseudonym = PSEUDONYMS[Math.floor(Math.random() * PSEUDONYMS.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const number = Math.floor(Math.random() * 10000);

  // Generate a blocky avatar using initials + color
  const initials = pseudonym.substring(0, 2).toUpperCase();
  const avatar = generateBlockyAvatar(initials, color);

  return {
    pseudonym: `${pseudonym}#${number}`,
    avatar,
  };
}

function generateBlockyAvatar(initials: string, color: string): string {
  // Generate a simple SVG avatar with initials
  const svg = `
    <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .avatar-bg { fill: ${color}; }
          .avatar-text { fill: white; font-family: Bebas Neue, sans-serif; font-size: 48px; font-weight: bold; text-anchor: middle; }
        </style>
      </defs>
      <rect class="avatar-bg" width="128" height="128" x="0" y="0" />
      <text class="avatar-text" x="64" y="80">${initials}</text>
    </svg>
  `;

  // Return as data URI
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
