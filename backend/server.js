const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const validator = require('validator');
const connectDB = require('./config/db');
const Order = require('./models/Order');
const Subscription = require('./models/Subscription');
const { sendSubscriptionNotification, sendOrderConfirmation } = require('./services/emailService');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet()); // Set security headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Prevent HTTP Parameter Pollution
app.use(hpp());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Initialize Razorpay instance with your keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Sanitize input helper function
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  // Trim and escape HTML entities
  return validator.escape(validator.trim(input));
}

// Route to create an order
app.post('/api/create-order', async (req, res) => {
  try {
    let { amount, currency = 'INR', receipt, customerData, products } = req.body;
    
    // Validate and sanitize inputs
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    
    // Validate currency
    const validCurrencies = ['INR', 'USD', 'EUR', 'GBP'];
    if (!validCurrencies.includes(currency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid currency'
      });
    }
    
    // Sanitize receipt
    const sanitizedReceipt = receipt ? sanitizeInput(receipt).substring(0, 40) : `receipt_${Date.now()}`;
    
    // Validate customer data
    if (!customerData || !customerData.email || !customerData.name) {
      return res.status(400).json({
        success: false,
        message: 'Customer data is required'
      });
    }
    
    // Validate products array
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products data is required'
      });
    }
    
    // Sanitize customer data
    const sanitizedCustomerData = {
      email: sanitizeInput(customerData.email),
      name: sanitizeInput(customerData.name),
      address: customerData.address ? sanitizeInput(customerData.address) : null,
      city: customerData.city ? sanitizeInput(customerData.city) : null,
      state: customerData.state ? sanitizeInput(customerData.state) : null,
      zipCode: customerData.zipCode ? sanitizeInput(customerData.zipCode) : null,
      country: customerData.country ? sanitizeInput(customerData.country) : null
    };
    
    // Sanitize products data
    const sanitizedProducts = products.map(product => ({
      productId: sanitizeInput(product.productId),
      name: sanitizeInput(product.name),
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity)
    }));
    
    // Create order options
    const options = {
      amount: Math.round(amount * 100), // Convert to paise and round
      currency,
      receipt: sanitizedReceipt,
    };
    
    // Create order using Razorpay API
    const order = await razorpay.orders.create(options);
    
    // Save order to database
    const newOrder = new Order({
      orderId: order.id,
      amount: order.amount / 100, // Convert back to rupees
      currency: order.currency,
      status: 'created',
      customerEmail: sanitizedCustomerData.email,
      customerName: sanitizedCustomerData.name,
      shippingAddress: {
        street: sanitizedCustomerData.address,
        city: sanitizedCustomerData.city,
        state: sanitizedCustomerData.state,
        zipCode: sanitizedCustomerData.zipCode,
        country: sanitizedCustomerData.country
      },
      products: sanitizedProducts
    });
    
    await newOrder.save();
    
    // Log successful order creation
    console.log(`Order created: ${order.id} for amount ${order.amount}`);
    
    // Send order confirmation email
    try {
      await sendOrderConfirmation({
        orderId: order.id,
        amount: order.amount / 100,
        customerEmail: sanitizedCustomerData.email,
        products: sanitizedProducts
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation:', emailError);
      // Don't fail the order if email fails
    }
    
    // Return order details to frontend
    res.json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// Route to verify payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields'
      });
    }
    
    // Validate field formats
    if (typeof razorpay_order_id !== 'string' || 
        typeof razorpay_payment_id !== 'string' || 
        typeof razorpay_signature !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment verification data format'
      });
    }
    
    // Sanitize inputs
    const sanitizedOrderId = sanitizeInput(razorpay_order_id);
    const sanitizedPaymentId = sanitizeInput(razorpay_payment_id);
    const sanitizedSignature = sanitizeInput(razorpay_signature);
    
    // Create expected signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${sanitizedOrderId}|${sanitizedPaymentId}`);
    const digest = shasum.digest('hex');
    
    // Compare signatures
    if (digest === sanitizedSignature) {
      // Payment is valid, update order status
      const order = await Order.findOne({ orderId: sanitizedOrderId });
      if (order) {
        order.status = 'paid';
        order.paymentId = sanitizedPaymentId;
        await order.save();
        console.log(`Order ${sanitizedOrderId} marked as paid`);
      }
      
      console.log(`Payment verified successfully for order: ${sanitizedOrderId}`);
      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // Invalid payment, update order status
      const order = await Order.findOne({ orderId: sanitizedOrderId });
      if (order) {
        order.status = 'failed';
        await order.save();
        console.log(`Order ${sanitizedOrderId} marked as failed`);
      }
      
      console.warn(`Invalid payment signature for order: ${sanitizedOrderId}`);
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// Webhook endpoint for payment status updates
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    // Get the webhook secret (should be set in environment variables)
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Check if webhook secret is configured
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    
    // Get the signature from headers
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(req.body);
    const digest = shasum.digest('hex');
    
    if (digest === signature) {
      // Valid webhook
      const event = JSON.parse(req.body);
      
      // Log the event
      console.log(`Webhook received: ${event.event}`);
      
      // Handle different events
      switch (event.event) {
        case 'payment.captured':
          console.log('Payment captured:', event.payload.payment.entity);
          // Update order status in database
          const paymentEntity = event.payload.payment.entity;
          const order = await Order.findOne({ orderId: paymentEntity.order_id });
          if (order) {
            order.status = 'paid';
            order.paymentId = paymentEntity.id;
            await order.save();
            console.log(`Order ${paymentEntity.order_id} marked as paid in webhook`);
          }
          break;
          
        case 'payment.failed':
          console.log('Payment failed:', event.payload.payment.entity);
          // Update order status in database
          const failedPaymentEntity = event.payload.payment.entity;
          const failedOrder = await Order.findOne({ orderId: failedPaymentEntity.order_id });
          if (failedOrder) {
            failedOrder.status = 'failed';
            await failedOrder.save();
            console.log(`Order ${failedPaymentEntity.order_id} marked as failed in webhook`);
          }
          break;
          
        case 'order.paid':
          console.log('Order paid:', event.payload.order.entity);
          // Handle order completion
          break;
          
        default:
          console.log('Unhandled event:', event.event);
      }
      
      res.json({ status: 'ok' });
    } else {
      // Invalid webhook signature
      console.warn('Invalid webhook signature');
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get order by ID
app.get('/api/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const sanitizedOrderId = sanitizeInput(orderId);
    
    const order = await Order.findOne({ orderId: sanitizedOrderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// Subscribe to newsletter
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }
    
    // Sanitize email
    const sanitizedEmail = validator.normalizeEmail(email);
    
    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({ email: sanitizedEmail });
    
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed'
      });
    }
    
    // Create new subscription
    const subscription = new Subscription({
      email: sanitizedEmail
    });
    
    await subscription.save();
    
    // Send notification to admin
    try {
      await sendSubscriptionNotification(sanitizedEmail);
    } catch (emailError) {
      console.error('Failed to send subscription notification:', emailError);
      // Don't fail the subscription if email fails
    }
    
    console.log(`New subscription: ${sanitizedEmail}`);
    
    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
    
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server with production optimizations
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Razorpay integration initialized with key: ${process.env.RAZORPAY_KEY_ID}`);
  
  // Log startup time for performance monitoring
  console.log(`Server startup completed at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;