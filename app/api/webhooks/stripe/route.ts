import { NextRequest, NextResponse } from 'next/server';
import { StripeWebhookService, getTierFromPriceId } from '@/lib/stripe';
import { db, createSupabaseServiceClient } from '@/lib/supabase-db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe signature');
      return new NextResponse('Missing signature', { status: 400 });
    }

    // Construct and verify the event
    const event = StripeWebhookService.constructEvent(body, signature);
    if (!event) {
      return new NextResponse('Invalid signature', { status: 400 });
    }

    console.log(`Received Stripe event: ${event.type}`);

    // Log billing event
    await db.billingEvents.create({
      user_id: '', // Will be updated based on customer
      event_type: event.type,
      stripe_event_id: event.id,
      amount: 0, // Will be updated based on event
      metadata: event.data as any
    });

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription, event.type);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleSuccessfulPayment(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleFailedPayment(invoice);
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleTrialEnding(subscription);
        break;
      }

      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        await handlePaymentMethodAttached(paymentMethod);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}

async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  eventType: string
) {
  try {
    const customerId = subscription.customer as string;
    
    // Find user by Stripe customer ID
    const supabase = createSupabaseServiceClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error || !user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    let subscriptionTier: 'TRIAL' | 'BASIC' | 'PRO' = 'TRIAL';
    let subscriptionStatus = subscription.status;

    if (subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id;
      subscriptionTier = getTierFromPriceId(priceId);
    }

    // Update user subscription
    await db.users.update(user.id, {
      subscription_tier: subscriptionTier,
      subscription_status: subscriptionStatus,
      subscription_ends_at: subscription.current_period_end 
        ? new Date((subscription.current_period_end as number) * 1000).toISOString()
        : null,
      stripe_subscription_id: subscription.id,
      updated_at: new Date().toISOString()
    });

    // Update billing event with user ID
    await db.billingEvents.update(subscription.id, {
      user_id: user.id,
      amount: subscription.items.data[0]?.price.unit_amount 
        ? subscription.items.data[0].price.unit_amount / 100
        : 0
    });

    console.log(`Updated subscription for user ${user.id}: ${subscriptionTier} (${subscriptionStatus})`);

  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}

async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    
    const supabase = createSupabaseServiceClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error || !user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // Update billing event
    await db.billingEvents.update(invoice.id || '', {
      user_id: user.id,
      amount: invoice.amount_paid ? invoice.amount_paid / 100 : 0,
      currency: invoice.currency?.toUpperCase() || 'EUR'
    });

    // If this was a trial conversion, update trial end date
    if (invoice.subscription) {
      await db.users.update(user.id, {
        trial_ends_at: null, // Clear trial end date
        last_active_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    console.log(`Payment succeeded for user ${user.id}: €${invoice.amount_paid / 100}`);

  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    
    const supabase = createSupabaseServiceClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error || !user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // Update billing event
    await db.billingEvents.update(invoice.id || '', {
      user_id: user.id,
      amount: invoice.amount_due ? invoice.amount_due / 100 : 0,
      currency: invoice.currency?.toUpperCase() || 'EUR',
      metadata: {
        failure_reason: invoice.last_finalization_error?.message || 'Payment failed',
        attempt_count: invoice.attempt_count
      }
    });

    // TODO: Send notification about failed payment
    // TODO: Implement grace period logic

    console.log(`Payment failed for user ${user.id}: €${invoice.amount_due / 100}`);

  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

async function handleTrialEnding(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    
    const supabase = createSupabaseServiceClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error || !user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // TODO: Send trial ending notification
    // TODO: Prompt user to add payment method

    console.log(`Trial ending soon for user ${user.id}`);

  } catch (error) {
    console.error('Error handling trial ending:', error);
  }
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  try {
    const customerId = paymentMethod.customer as string;
    
    if (!customerId) return;

    const supabase = createSupabaseServiceClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error || !user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // TODO: Update user preferences to reflect payment method added
    // TODO: Send confirmation notification

    console.log(`Payment method attached for user ${user.id}`);

  } catch (error) {
    console.error('Error handling payment method attachment:', error);
  }
}