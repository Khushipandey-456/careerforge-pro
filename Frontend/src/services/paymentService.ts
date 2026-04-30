import { apiClient } from './apiClient';

interface CheckoutResponse {
  checkoutUrl: string;
}

export const paymentService = {
  // Expected endpoint: POST /api/payment/checkout
  async checkout(plan: 'pro' | 'free'): Promise<CheckoutResponse> {
    await apiClient('/payment/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan })
    });
    
    // Simulate returned stripe URL
    return {
      checkoutUrl: 'https://checkout.stripe.com/pay/cs_test_mock12345',
    };
  }
};
