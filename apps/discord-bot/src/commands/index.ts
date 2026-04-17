import price from './price';
import stats from './stats';
import leaderboard from './leaderboard';

const commands = [price, stats, leaderboard];

export async function registerCommands() {
  return commands.map(cmd => cmd.data);
}

export { price, stats, leaderboard };