import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
export const createPaymentIntent = async (amount, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: ['card'],
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    throw error;
  }
};

// Confirm payment
export const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Stripe payment confirmation error:', error);
    throw error;
  }
};

// Refund payment
export const refundPayment = async (paymentIntentId, amount = null) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return refund;
  } catch (error) {
    console.error('Stripe refund error:', error);
    throw error;
  }
};

// PayPal integration (placeholder - would need paypal-rest-sdk or similar)
export const createPayPalPayment = async (amount, currency = 'USD') => {
  // Placeholder for PayPal integration
  // In a real implementation, you would use PayPal SDK
  console.log(`Creating PayPal payment for ${amount} ${currency}`);

  return {
    approvalUrl: 'https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout',
    paymentId: 'paypal_' + Date.now(),
  };
};

// Webhook verification
export const verifyStripeWebhook = (signature, body, secret) => {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error('Webhook verification failed:', error);
    throw error;
  }
};