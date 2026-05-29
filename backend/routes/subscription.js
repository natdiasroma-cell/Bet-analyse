const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/database');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

const PLANS = {
  monthly: { name: 'Premium Monthly', price: 799, interval: 'month' },
  quarterly: { name: 'Premium 3 Months', price: 1999, interval: 'quarter' },
  annual: { name: 'Premium Annual', price: 15000, interval: 'year' }
};

// Create payment intent
router.post('/create-payment', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ error: 'Invalid plan' });

    const planData = PLANS[plan];
    const intent = await stripe.paymentIntents.create({
      amount: planData.price,
      currency: 'eur',
      metadata: { plan, userId: req.user.id }
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (error) {
    logger.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

// Verify payment and create subscription
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { intentId, plan } = req.body;

    const intent = await stripe.paymentIntents.retrieve(intentId);
    if (intent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const planData = PLANS[plan];
    const expiresAt = new Date();
    if (plan === 'monthly') expiresAt.setMonth(expiresAt.getMonth() + 1);
    else if (plan === 'quarterly') expiresAt.setMonth(expiresAt.getMonth() + 3);
    else if (plan === 'annual') expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await db.query(
      'UPDATE users SET subscription_plan = $1, subscription_expires = $2 WHERE id = $3',
      [plan, expiresAt, req.user.id]
    );

    res.json({ success: true, plan, expiresAt });
  } catch (error) {
    logger.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get subscription status
router.get('/status', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT subscription_plan, subscription_expires FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];
    const isActive = user.subscription_expires && new Date(user.subscription_expires) > new Date();

    res.json({
      plan: user.subscription_plan,
      expiresAt: user.subscription_expires,
      isActive
    });
  } catch (error) {
    logger.error('Status error:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

module.exports = router;
