import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const TOKEN_EXPIRY = '30d';

export interface User {
  id: string;
  address: string;
  pseudonym: string;
  avatar?: string;
}

/**
 * Generate JWT token for a user
 */
export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      address: user.address,
      pseudonym: user.pseudonym,
    },
    JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRY,
    }
  );
}

/**
 * Verify and decode JWT token
 */
export async function verifyToken(
  token: string
): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      address: string;
      pseudonym: string;
    };

    return {
      id: decoded.id,
      address: decoded.address,
      pseudonym: decoded.pseudonym,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Decode token without verification (unsafe, use only when needed)
 */
export function decodeToken(token: string) {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}
