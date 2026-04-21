/**
 * Telegram Bot Alert Service
 * Manages user price alerts and notifications
 */

interface UserAlert {
  id: string;
  userId: number;
  targetPrice: number;
  createdAt: Date;
  triggered: boolean;
}

class AlertService {
  // Simulated storage (in production, use database)
  private alerts: Map<number, UserAlert[]> = new Map();
  private alertIdCounter: number = 1;

  /**
   * Create a new price alert for a user
   */
  createAlert(userId: number, targetPrice: number): UserAlert {
    if (targetPrice <= 0) {
      throw new Error('Alert price must be greater than 0');
    }

    const alert: UserAlert = {
      id: `alert_${this.alertIdCounter++}`,
      userId,
      targetPrice,
      createdAt: new Date(),
      triggered: false,
    };

    const userAlerts = this.alerts.get(userId) || [];
    userAlerts.push(alert);
    this.alerts.set(userId, userAlerts);

    return alert;
  }

  /**
   * Get all alerts for a user
   */
  getUserAlerts(userId: number): UserAlert[] {
    return this.alerts.get(userId) || [];
  }

  /**
   * Remove an alert by ID
   */
  removeAlert(userId: number, alertId: string): boolean {
    const userAlerts = this.alerts.get(userId);
    if (!userAlerts) return false;

    const index = userAlerts.findIndex((a) => a.id === alertId);
    if (index === -1) return false;

    userAlerts.splice(index, 1);
    if (userAlerts.length === 0) {
      this.alerts.delete(userId);
    } else {
      this.alerts.set(userId, userAlerts);
    }

    return true;
  }

  /**
   * Check if an alert should trigger based on current price
   */
  shouldTrigger(alert: UserAlert, currentPrice: number): boolean {
    if (alert.triggered) return false;
    return currentPrice >= alert.targetPrice;
  }

  /**
   * Mark alert as triggered
   */
  markTriggered(userId: number, alertId: string): void {
    const userAlerts = this.alerts.get(userId);
    if (!userAlerts) return;

    const alert = userAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.triggered = true;
    }
  }

  /**
   * Format alert for display
   */
  formatAlert(alert: UserAlert, index: number): string {
    const status = alert.triggered ? '🔔 Triggered' : '⏳ Active';
    const date = alert.createdAt.toLocaleDateString();
    return `${index}. Alert ${alert.id}\n   Price: $${alert.targetPrice}\n   Status: ${status}\n   Created: ${date}`;
  }

  /**
   * Clear all alerts for a user
   */
  clearUserAlerts(userId: number): number {
    const count = (this.alerts.get(userId) || []).length;
    this.alerts.delete(userId);
    return count;
  }

  /**
   * Get alert statistics
   */
  getStats(): { totalAlerts: number; totalUsers: number } {
    let totalAlerts = 0;
    this.alerts.forEach((alerts) => {
      totalAlerts += alerts.length;
    });

    return {
      totalAlerts,
      totalUsers: this.alerts.size,
    };
  }
}

// Export singleton instance
export const alertService = new AlertService();
export type { UserAlert };
