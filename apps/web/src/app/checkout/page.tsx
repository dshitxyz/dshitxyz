'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Footer } from '@/components/Footer';
import styles from './checkout.module.css';

interface OrderFormData {
  recipientName: string;
  recipientEmail: string;
  recipientAddress: string;
  recipientCity: string;
  recipientZip: string;
  recipientCountry: string;
  anonymous: boolean;
}

interface Order {
  id: string;
  totalAmount: number;
  itemCount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped';
  createdAt: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'review' | 'confirmation'>('form');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    recipientName: '',
    recipientEmail: '',
    recipientAddress: '',
    recipientCity: '',
    recipientZip: '',
    recipientCountry: 'US',
    anonymous: true,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && step === 'form') {
      setTimeout(() => router.push('/products'), 1000);
    }
  }, [items.length, step, router]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.recipientName ||
      !formData.recipientAddress ||
      !formData.recipientCity ||
      !formData.recipientZip ||
      !formData.recipientCountry
    ) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.anonymous && !formData.recipientEmail) {
      setError('Please provide email for non-anonymous orders');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmitForm = () => {
    if (validateForm()) {
      setStep('review');
      setError(null);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call to create order
      const orderData = {
        userAddress: user?.address || 'unknown',
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
        shipping: {
          ...formData,
          email: formData.recipientEmail,
        },
      };

      // In production, this would be: POST /api/checkout/create
      // For MVP, we simulate success
      const mockOrder: Order = {
        id: `ORDER-${Date.now()}`,
        totalAmount: total,
        itemCount: items.length,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOrder(mockOrder);
      clearCart();
      setStep('confirmation');
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step === 'form') {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <h2>Your cart is empty</h2>
            <p>Redirecting to products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirmation' && order) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.confirmation}>
            <div className={styles.confirmHeader}>
              <div className={styles.checkmark}>✓</div>
              <h1>Order Confirmed!</h1>
              <p className={styles.orderId}>Order ID: {order.id}</p>
            </div>

            <div className={styles.confirmDetails}>
              <div className={styles.detailRow}>
                <span>Order Total:</span>
                <span className={styles.amount}>
                  {order.totalAmount.toLocaleString()} DSHIT
                </span>
              </div>
              <div className={styles.detailRow}>
                <span>Items:</span>
                <span>{order.itemCount} item(s)</span>
              </div>
              <div className={styles.detailRow}>
                <span>Status:</span>
                <span className={styles.status}>{order.status}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Created:</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className={styles.confirmMessage}>
              <h3>What's Next?</h3>
              <p>
                Your order has been received. We'll process it and send you
                tracking information soon. Please check your dashboard for order
                updates.
              </p>
            </div>

            <div className={styles.confirmActions}>
              <button
                onClick={() => router.push('/dashboard')}
                className={styles.primaryBtn}
              >
                View Dashboard
              </button>
              <button
                onClick={() => router.push('/products')}
                className={styles.secondaryBtn}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Progress Steps */}
          <div className={styles.progress}>
            <div
              className={`${styles.step} ${
                step === 'form' || step === 'review' || step === 'confirmation'
                  ? styles.active
                  : ''
              }`}
            >
              <div className={styles.stepNum}>1</div>
              <span>Shipping</span>
            </div>
            <div className={styles.progressLine} />
            <div
              className={`${styles.step} ${
                step === 'review' || step === 'confirmation' ? styles.active : ''
              }`}
            >
              <div className={styles.stepNum}>2</div>
              <span>Review</span>
            </div>
            <div className={styles.progressLine} />
            <div
              className={`${styles.step} ${
                step === 'confirmation' ? styles.active : ''
              }`}
            >
              <div className={styles.stepNum}>3</div>
              <span>Confirm</span>
            </div>
          </div>

          {/* Form Step */}
          {step === 'form' && (
            <div className={styles.form}>
              <h1 className={styles.title}>Checkout</h1>
              <p className={styles.subtitle}>
                Enter shipping details for your order
              </p>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.formSection}>
                <h3>Recipient Information</h3>

                <div className={styles.formGroup}>
                  <label>Full Name*</label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleFormChange}
                    placeholder="Who is receiving this?"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      name="recipientEmail"
                      value={formData.recipientEmail}
                      onChange={handleFormChange}
                      placeholder="email@example.com"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.checkbox}>
                  <input
                    type="checkbox"
                    id="anonymous"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleFormChange}
                  />
                  <label htmlFor="anonymous">
                    Send anonymously (no sender info on package)
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Shipping Address*</h3>

                <div className={styles.formGroup}>
                  <label>Street Address*</label>
                  <input
                    type="text"
                    name="recipientAddress"
                    value={formData.recipientAddress}
                    onChange={handleFormChange}
                    placeholder="123 Main St"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>City*</label>
                    <input
                      type="text"
                      name="recipientCity"
                      value={formData.recipientCity}
                      onChange={handleFormChange}
                      placeholder="New York"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>ZIP Code*</label>
                    <input
                      type="text"
                      name="recipientZip"
                      value={formData.recipientZip}
                      onChange={handleFormChange}
                      placeholder="10001"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Country*</label>
                  <select
                    name="recipientCountry"
                    value={formData.recipientCountry}
                    onChange={handleFormChange}
                    className={styles.input}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={() => router.push('/products')}
                  className={styles.secondaryBtn}
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleSubmitForm}
                  className={styles.primaryBtn}
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {step === 'review' && (
            <div className={styles.review}>
              <h1 className={styles.title}>Review Your Order</h1>

              <div className={styles.reviewSection}>
                <h3>Order Summary</h3>
                <div className={styles.items}>
                  {items.map((item) => (
                    <div key={item.id} className={styles.reviewItem}>
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        {(item.price * item.quantity).toLocaleString()} DSHIT
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.total}>
                  <span>Total:</span>
                  <span>{total.toLocaleString()} DSHIT</span>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h3>Shipping To</h3>
                <div className={styles.shipping}>
                  <p>{formData.recipientName}</p>
                  <p>{formData.recipientAddress}</p>
                  <p>
                    {formData.recipientCity}, {formData.recipientZip}
                  </p>
                  <p>{formData.recipientCountry}</p>
                  {!formData.anonymous && <p>Email: {formData.recipientEmail}</p>}
                  {formData.anonymous && <p className={styles.anon}>Anonymous</p>}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={() => setStep('form')}
                  className={styles.secondaryBtn}
                >
                  Back to Form
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className={styles.primaryBtn}
                >
                  {loading ? 'Processing...' : 'Confirm & Pay'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
