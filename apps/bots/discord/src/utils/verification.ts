/**
 * Token Holder Verification Utilities
 * Checks wallet holdings and assigns Discord roles
 */

export interface VerificationResult {
  verified: boolean;
  tier: "none" | "degen" | "whale" | "mega";
  balance: number;
  address: string;
}

export async function verifyTokenHolder(
  ethereumAddress: string
): Promise<VerificationResult> {
  try {
    // In production, this would check actual blockchain state
    // For now, we return a mock result
    const mockBalance = Math.floor(Math.random() * 2000000);

    let tier: "none" | "degen" | "whale" | "mega" = "none";
    if (mockBalance >= 1000000) {
      tier = "mega";
    } else if (mockBalance >= 100000) {
      tier = "whale";
    } else if (mockBalance >= 1000) {
      tier = "degen";
    }

    return {
      verified: tier !== "none",
      tier,
      balance: mockBalance,
      address: ethereumAddress,
    };
  } catch (error) {
    console.error("Verification error:", error);
    return {
      verified: false,
      tier: "none",
      balance: 0,
      address: ethereumAddress,
    };
  }
}

export function getTierRole(tier: string): string {
  const roleMap: Record<string, string> = {
    mega: "Mega Holder",
    whale: "Whale",
    degen: "Degen",
    none: "Hodler",
  };
  return roleMap[tier] || "Hodler";
}

export function getTierEmoji(tier: string): string {
  const emojiMap: Record<string, string> = {
    mega: "👑",
    whale: "🦁",
    degen: "🐻",
    none: "🤓",
  };
  return emojiMap[tier] || "🤓";
}
