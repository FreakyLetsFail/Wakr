import Stripe from 'stripe';
import { STRIPE_PRICE_IDS, SUBSCRIPTION_PRICES } from './constants';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Subscription management
export class StripeSubscriptionService {
  static async createCustomer(email: string, name: string, metadata?: Record<string, string>) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          source: 'wakr_app',
          ...metadata
        }
      });

      return { success: true, customer };
    } catch (error) {
      console.error('Failed to create Stripe customer:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async createSubscription(
    customerId: string,
    priceId: string,
    trialDays: number = 0
  ) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: trialDays,
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          source: 'wakr_app'
        }
      });

      return { success: true, subscription };
    } catch (error) {
      console.error('Failed to create subscription:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async updateSubscription(
    subscriptionId: string,
    newPriceId: string
  ) {
    try {
      // Get current subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Update subscription with new price
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations'
      });

      return { success: true, subscription: updatedSubscription };
    } catch (error) {
      console.error('Failed to update subscription:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async cancelSubscription(subscriptionId: string, immediately: boolean = false) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: !immediately,
        ...(immediately && { cancel_at: Math.floor(Date.now() / 1000) })
      });

      return { success: true, subscription };
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async reactivateSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      });

      return { success: true, subscription };
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Payment methods
export class StripePaymentService {
  static async createSetupIntent(customerId: string) {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card', 'sepa_debit'],
        usage: 'off_session'
      });

      return { success: true, setupIntent };
    } catch (error) {
      console.error('Failed to create setup intent:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async attachPaymentMethod(paymentMethodId: string, customerId: string) {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      return { success: true, paymentMethod };
    } catch (error) {
      console.error('Failed to attach payment method:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async setDefaultPaymentMethod(customerId: string, paymentMethodId: string) {
    try {
      const customer = await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      return { success: true, customer };
    } catch (error) {
      console.error('Failed to set default payment method:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Billing and invoices
export class StripeBillingService {
  static async getInvoices(customerId: string, limit: number = 10) {
    try {
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit,
        status: 'paid'
      });

      return { success: true, invoices: invoices.data };
    } catch (error) {
      console.error('Failed to get invoices:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async getUpcomingInvoice(customerId: string) {
    try {
      const invoice = await stripe.invoices.retrieveUpcoming({
        customer: customerId,
      });

      return { success: true, invoice };
    } catch (error) {
      console.error('Failed to get upcoming invoice:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async createInvoiceItem(
    customerId: string,
    amount: number,
    description: string,
    currency: string = 'eur'
  ) {
    try {
      const invoiceItem = await stripe.invoiceItems.create({
        customer: customerId,
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        description
      });

      return { success: true, invoiceItem };
    } catch (error) {
      console.error('Failed to create invoice item:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Webhook handling
export class StripeWebhookService {
  static constructEvent(payload: string, signature: string): Stripe.Event | null {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error('Missing Stripe webhook secret');
      }

      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      console.error('Failed to construct Stripe event:', error);
      return null;
    }
  }

  static async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    // This will be implemented in the webhook route
    return {
      customerId: subscription.customer as string,
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      priceId: subscription.items.data[0]?.price.id
    };
  }

  static async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    return {
      customerId: paymentIntent.customer as string,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paymentMethodId: paymentIntent.payment_method as string
    };
  }

  static async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    return {
      customerId: paymentIntent.customer as string,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      failureReason: paymentIntent.last_payment_error?.message
    };
  }
}

// Price helpers
export const SubscriptionPlans = {
  BASIC_MONTHLY: {
    priceId: STRIPE_PRICE_IDS.BASIC_MONTHLY,
    price: SUBSCRIPTION_PRICES.BASIC_MONTHLY,
    interval: 'month',
    tier: 'BASIC' as const,
    features: [
      'Up to 10 habits',
      'Basic wake-up calls',
      '5 custom calls per month',
      'Basic analytics',
      'Email support'
    ]
  },
  BASIC_ANNUAL: {
    priceId: STRIPE_PRICE_IDS.BASIC_ANNUAL,
    price: SUBSCRIPTION_PRICES.BASIC_ANNUAL,
    interval: 'year',
    tier: 'BASIC' as const,
    savings: '10% off',
    features: [
      'Up to 10 habits',
      'Basic wake-up calls',
      '5 custom calls per month',
      'Basic analytics',
      'Email support',
      '2 months free'
    ]
  },
  PRO_MONTHLY: {
    priceId: STRIPE_PRICE_IDS.PRO_MONTHLY,
    price: SUBSCRIPTION_PRICES.PRO_MONTHLY,
    interval: 'month',
    tier: 'PRO' as const,
    features: [
      'Unlimited habits',
      'Advanced wake-up challenges',
      '50 custom calls per month',
      'Advanced analytics & insights',
      'Voice challenges',
      'QR code & shake challenges',
      'Priority support',
      'Export data'
    ]
  },
  PRO_ANNUAL: {
    priceId: STRIPE_PRICE_IDS.PRO_ANNUAL,
    price: SUBSCRIPTION_PRICES.PRO_ANNUAL,
    interval: 'year',
    tier: 'PRO' as const,
    savings: '10% off',
    features: [
      'Unlimited habits',
      'Advanced wake-up challenges',
      '50 custom calls per month',
      'Advanced analytics & insights',
      'Voice challenges',
      'QR code & shake challenges',
      'Priority support',
      'Export data',
      '2 months free'
    ]
  }
} as const;

// Utility functions
export function getTierFromPriceId(priceId: string): 'TRIAL' | 'BASIC' | 'PRO' {
  if (priceId === STRIPE_PRICE_IDS.BASIC_MONTHLY || priceId === STRIPE_PRICE_IDS.BASIC_ANNUAL) {
    return 'BASIC';
  }
  if (priceId === STRIPE_PRICE_IDS.PRO_MONTHLY || priceId === STRIPE_PRICE_IDS.PRO_ANNUAL) {
    return 'PRO';
  }
  return 'TRIAL';
}

export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function calculateProrationCredits(
  oldPriceId: string,
  newPriceId: string,
  daysRemaining: number
): number {
  const oldPlan = Object.values(SubscriptionPlans).find(plan => plan.priceId === oldPriceId);
  const newPlan = Object.values(SubscriptionPlans).find(plan => plan.priceId === newPriceId);
  
  if (!oldPlan || !newPlan) return 0;
  
  const oldDailyRate = oldPlan.price / (oldPlan.interval === 'year' ? 365 : 30);
  const newDailyRate = newPlan.price / (newPlan.interval === 'year' ? 365 : 30);
  
  return (newDailyRate - oldDailyRate) * daysRemaining;
}