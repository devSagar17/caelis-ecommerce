# Shopping E-Commerce Backend with Razorpay Integration

This backend implements secure Razorpay payment processing with all the recommended security practices.

## Features Implemented

1. **Server-Side Order Creation** - Orders are created on the server using Razorpay API
2. **Signature Verification** - Payment signatures are verified on the server for security
3. **Webhook Handling** - Webhooks for real-time payment status updates
4. **Secure Key Storage** - Secrets are stored in environment variables
5. **Rate Limiting** - Protection against abuse and DDoS attacks
6. **Security Headers** - Protection against common web vulnerabilities
7. **Input Sanitization** - Protection against XSS and injection attacks

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A Razorpay account with API keys

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

### Configuration

1. Update the `.env` file with your configuration:
   - `RAZORPAY_KEY_ID` - Your Razorpay live key ID (not test keys for production)
   - `RAZORPAY_KEY_SECRET` - Your Razorpay live secret (kept secure on server)
   - `RAZORPAY_WEBHOOK_SECRET` - Your webhook secret for payment notifications
   - `PORT` - Server port (default: 3000)
   - `NODE_ENV` - Set to "production" for production deployments
   - `FRONTEND_URL` - Your production frontend URL

2. For webhook configuration:
   - Configure the webhook URL in your Razorpay dashboard:
     `https://your-domain.com/api/webhook`
   - Set the webhook secret in your Razorpay dashboard and match it in your `.env` file

### Running the Server

1. Development mode:
```bash
npm run dev
```

2. Production mode:
```bash
npm run prod
```

3. Standard mode:
```bash
npm start
```

## API Endpoints

### Create Order
- **URL**: `/api/create-order`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "amount": 100,
    "currency": "INR",
    "receipt": "order_receipt"
  }
  ```
- **Response**: Razorpay order object

### Verify Payment
- **URL**: `/api/verify-payment`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "signature_xxx"
  }
  ```
- **Response**: Verification result

### Webhook
- **URL**: `/api/webhook`
- **Method**: `POST`
- **Description**: Receives real-time payment events from Razorpay

### Product Management
- **GET /api/products** - Get all products
- **POST /api/products** - Add a new product
- **PUT /api/products/:id** - Update a product
- **DELETE /api/products/:id** - Delete a product

### Health Check
- **URL**: `/api/health`
- **Method**: `GET`
- **Description**: Server health and status information

## Security Best Practices Implemented

1. **Secret Key Protection**: The secret key is stored securely in environment variables and never exposed to the frontend
2. **Server-Side Order Creation**: Orders are created on the server to prevent tampering
3. **Signature Verification**: All payments are verified using HMAC SHA256 signatures
4. **Webhook Validation**: Webhook payloads are validated using secrets
5. **Rate Limiting**: API rate limiting prevents abuse
6. **Security Headers**: Helmet.js sets various HTTP headers for security
7. **Input Sanitization**: Protection against XSS and HTTP parameter pollution
8. **CORS Protection**: Restricted cross-origin requests
9. **Error Handling**: Production-safe error messages that don't expose internals

## Testing

Use these test card details for Razorpay testing:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: 123
- Name: Any name
- Email: Any email

## Production Deployment

### 1. Update Credentials
Replace test credentials in `.env` with your live Razorpay credentials:
```
RAZORPAY_KEY_ID=your_live_key_id
RAZORPAY_KEY_SECRET=your_live_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### 2. Set Up SSL
Deploy with HTTPS using:
- Let's Encrypt (free SSL certificates)
- Cloudflare SSL
- Your hosting provider's SSL service

### 3. Database Integration
This backend already includes MongoDB/Mongoose integration for order management:

```javascript
// Database connection is already configured in config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
```

The Order model is defined in `models/Order.js` and includes fields for order tracking, customer information, and payment status.

### 4. Webhook Configuration
Configure webhooks in your Razorpay Dashboard:
1. Go to Settings > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: payment.captured, payment.failed, order.paid
4. Set secret and update `.env` accordingly

### 5. Monitoring and Logging
Implement proper logging:
```javascript
// Example with Winston logger
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 6. Performance Optimization
- Use a reverse proxy like Nginx
- Enable gzip compression
- Implement caching strategies
- Use CDN for static assets

### 7. Environment-Specific Configurations
Create separate environment files:
- `.env.development`
- `.env.staging`
- `.env.production`

### 8. Backup and Recovery
- Regular database backups
- Automated deployment scripts
- Rollback procedures

## Scaling Considerations

1. **Load Balancing**: Use services like AWS ELB, NGINX Load Balancer
2. **Database Scaling**: Consider database clustering or sharding
3. **Caching**: Implement Redis for session storage and caching
4. **Microservices**: Split functionality into separate services if needed
5. **Containerization**: Use Docker for consistent deployments

## Troubleshooting

### Common Issues

1. **Webhook Validation Failures**
   - Check that webhook secret matches in code and Razorpay dashboard
   - Ensure webhook URL is publicly accessible

2. **Payment Verification Failures**
   - Verify that `RAZORPAY_KEY_SECRET` is correct
   - Check that order IDs match between frontend and backend

3. **CORS Issues**
   - Verify `FRONTEND_URL` in `.env` matches your frontend domain
   - Check CORS configuration in server.js

### Logs and Debugging

Check server logs for detailed error information:
```bash
# View recent logs
tail -f /var/log/nodejs/app.log

# Check for specific errors
grep "ERROR" /var/log/nodejs/app.log
```

## Support

For any issues or questions about the implementation, please refer to the Razorpay documentation or contact their support team.

## Product Management

### For Buyers/Non-Technical Users

This e-commerce platform includes a simple admin panel for managing products without requiring technical knowledge:

1. Open `admin.html` in your web browser
2. Use the "Add New Product" form to add products:
   - Enter product name, price, category, and image URL
   - Optionally add a product description
3. View and manage existing products in the "Manage Products" section
4. Edit or delete products as needed

### For Technical Users

You can also manage products directly through the API endpoints:

#### Add a Product (POST /api/products)
```json
{
  "name": "Product Name",
  "price": 99.99,
  "category": "clothing",
  "image": "images/products/product-image.jpg",
  "description": "Product description"
}
```

#### Update a Product (PUT /api/products/:id)
```json
{
  "name": "Updated Product Name",
  "price": 129.99
}
```

#### Delete a Product (DELETE /api/products/:id)
No body required, just send a DELETE request to the product ID endpoint.

### Product Categories
Available categories:
- clothing
- accessories
- footwear

### Image Management
When adding products, ensure image URLs are accessible. For best results:
1. Upload images to your server in the `images/products/` directory
2. Organize images by category (e.g., `images/products/clothing/tshirt.jpg`)
3. Use relative URLs in the product image field

## Database Setup

This application uses MongoDB for storing products, orders, and subscriptions. You have two options:

### Option 1: Local MongoDB Installation
1. Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - On Windows: `net start MongoDB`
   - On macOS/Linux: `sudo systemctl start mongod`
3. The application will automatically connect to the local database at `mongodb://localhost:27017/ecommerce`

### Option 2: Cloud MongoDB (Recommended for Production)
1. Sign up for a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster and database
3. Update the `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   ```

### Troubleshooting Database Issues
If you see connection errors:
1. Ensure MongoDB is running
2. Check that the `MONGODB_URI` in your `.env` file is correct
3. Verify network connectivity if using a remote database
4. Check firewall settings if using a local database
