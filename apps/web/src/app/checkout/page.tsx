'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

type CheckoutStep = 'shipping' | 'review' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [shipping, setShipping] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  // Redirect if not authenticated or cart is empty
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (cart.items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gray-900 border-4 border-shit-yellow p-8 rounded text-center">
            <p className="text-gray-400 mb-6">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-shit-yellow text-gray-950 font-bold border-2 border-shit-brown hover:bg-shit-yellow-dark transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!shipping.street || !shipping.city || !shipping.state || !shipping.zip || !shipping.country) {
      setError('Please fill in all shipping fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: shipping,
          address: user.address || 'anonymous',
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      setOrderId(data.order.id);
      clearCart();
      setStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Progress Indicator */}
        <div className="flex gap-4 mb-8">
          <div
            className={`flex-1 h-1 rounded ${
              step === 'shipping' ? 'bg-shit-yellow' : 'bg-gray-700'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded ${
              step === 'review' || step === 'confirmation' ? 'bg-shit-yellow' : 'bg-gray-700'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded ${
              step === 'confirmation' ? 'bg-shit-yellow' : 'bg-gray-700'
            }`}
          />
        </div>

        {/* Step 1: Shipping Address */}
        {step === 'shipping' && (
          <div className="bg-gray-900 border-4 border-shit-yellow p-6 rounded space-y-6">
            <h2 className="text-2xl font-bold text-shit-yellow font-display">SHIPPING ADDRESS</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Street Address"
                value={shipping.street}
                onChange={(e) => handleShippingChange('street', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded text-white font-mono placeholder-gray-500 focus:outline-none focus:border-shit-yellow"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => handleShippingChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded text-white font-mono placeholder-gray-500 focus:outline-none focus:border-shit-yellow"
                />
                <input
                  type="text"
                  placeholder="State/Province"
                  value={shipping.state}
                  onChange={(e) => handleShippingChange('state', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded text-white font-mono placeholder-gray-500 focus:outline-none focus:border-shit-yellow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="ZIP/Postal Code"
                  value={shipping.zip}
                  onChange={(e) => handleShippingChange('zip', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded text-white font-mono placeholder-gray-500 focus:outline-none focus:border-shit-yellow"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={shipping.country}
                  onChange={(e) => handleShippingChange('country', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded text-white font-mono placeholder-gray-500 focus:outline-none focus:border-shit-yellow"
                />
              </div>
            </div>

            {error && <div className="bg-glitch-red bg-opacity-20 border-l-4 border-glitch-red p-4 rounded text-glitch-red">{error}</div>}

            <button
              onClick={() => setStep('review')}
              className="w-full px-6 py-3 bg-shit-yellow text-gray-950 font-bold border-2 border-shit-brown hover:bg-shit-yellow-dark transition-colors rounded"
            >
              REVIEW ORDER
            </button>
          </div>
        )}

        {/* Step 2: Review Order */}
        {step === 'review' && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-900 border-4 border-shit-yellow p-6 rounded space-y-4">
              <h2 className="text-2xl font-bold text-shit-yellow font-display">ORDER SUMMARY</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between pb-2 border-b border-gray-700">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-shit-yellow font-bold">
                      {(item.price * item.quantity).toLocaleString()} DSHIT
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-700 pt-4 flex justify-between text-xl">
                <span className="font-bold">Total:</span>
                <span className="text-shit-yellow font-bold">
                  {cart.total.toLocaleString()} DSHIT
                </span>
              </div>
            </div>

            {/* Shipping Summary */}
            <div className="bg-gray-900 border-4 border-shit-brown p-6 rounded">
              <h3 className="text-xl font-bold text-shit-brown font-display mb-4">SHIPPING TO</h3>
              <p className="text-gray-300 space-y-1">
                <div>{shipping.street}</div>
                <div>
                  {shipping.city}, {shipping.state} {shipping.zip}
                </div>
                <div>{shipping.country}</div>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep('shipping')}
                className="flex-1 px-6 py-3 bg-gray-700 text-white font-bold border-2 border-gray-600 hover:bg-gray-600 transition-colors rounded"
              >
                BACK
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-shit-yellow text-gray-950 font-bold border-2 border-shit-brown hover:bg-shit-yellow-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
              >
                {isSubmitting ? 'PROCESSING...' : 'CONFIRM PURCHASE'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Confirmation */}
        {step === 'confirmation' && orderId && (
          <div className="bg-gray-900 border-4 border-toxic-green p-8 rounded text-center space-y-6">
            <h2 className="text-3xl font-bold text-toxic-green font-display">ORDER CONFIRMED!</h2>
            <p className="text-gray-400">
              Your order has been successfully placed. You will receive your package soon.
            </p>

            <div className="bg-gray-800 border-2 border-gray-700 p-6 rounded">
              <p className="text-gray-400 text-sm mb-2">Order ID</p>
              <p className="text-xl font-mono text-shit-yellow break-all">{orderId}</p>
            </div>

            <p className="text-gray-400">
              Thank you for your purchase! Your order will be shipped to the address provided.
            </p>

            <Link
              href="/gallery"
              className="inline-block px-6 py-3 bg-shit-yellow text-gray-950 font-bold border-2 border-shit-brown hover:bg-shit-yellow-dark transition-colors rounded"
            >
              CONTINUE BROWSING
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
