const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send subscription notification to admin
const sendSubscriptionNotification = async (subscriberEmail) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Newsletter Subscriber',
      html: `
        <h2>New Subscriber Alert</h2>
        <p>A new user has subscribed to your newsletter:</p>
        <p><strong>Email:</strong> ${subscriberEmail}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p>This is an automated notification from your Caelis e-commerce site.</p>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Subscription notification sent to admin:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending subscription notification:', error);
    throw error;
  }
};

// Send order confirmation to customer
const sendOrderConfirmation = async (orderDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: orderDetails.customerEmail,
      subject: `Order Confirmation #${orderDetails.orderId}`,
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your purchase!</p>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>Amount:</strong> $${orderDetails.amount}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <h3>Order Details:</h3>
        <ul>
          ${orderDetails.products.map(product => `
            <li>${product.name} x ${product.quantity} - $${(product.price * product.quantity).toFixed(2)}</li>
          `).join('')}
        </ul>
        <hr>
        <p>We'll notify you when your order ships.</p>
        <p>Thank you for shopping with Caelis!</p>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Order confirmation sent to customer:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw error;
  }
};

module.exports = {
  sendSubscriptionNotification,
  sendOrderConfirmation
};