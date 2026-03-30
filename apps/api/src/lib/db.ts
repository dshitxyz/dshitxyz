// In-memory database for now
// In production, use proper DB with PostgreSQL + Drizzle ORM

interface User {
  id: string;
  address: string;
  pseudonym: string;
  bio?: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
}

const users: Map<string, User> = new Map();

export async function getUserByAddress(address: string): Promise<User | null> {
  return users.get(address.toLowerCase()) || null;
}

export async function createOrUpdateUser(
  address: string,
  profile: { pseudonym: string; avatar: string }
): Promise<User> {
  const key = address.toLowerCase();
  const now = new Date();

  let user = users.get(key);
  if (user) {
    user.updated_at = now;
    return user;
  }

  user = {
    id: generateId(),
    address: address.toLowerCase(),
    pseudonym: profile.pseudonym,
    avatar: profile.avatar,
    created_at: now,
    updated_at: now,
  };

  users.set(key, user);
  return user;
}

export async function updateUserProfile(
  address: string,
  updates: { pseudonym?: string; bio?: string }
): Promise<User | null> {
  const key = address.toLowerCase();
  const user = users.get(key);

  if (!user) return null;

  if (updates.pseudonym) user.pseudonym = updates.pseudonym;
  if (updates.bio) user.bio = updates.bio;
  user.updated_at = new Date();

  users.set(key, user);
  return user;
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
