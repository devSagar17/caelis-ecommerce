# Caelis - E-commerce Clothing Store

A fully responsive e-commerce website for a clothing brand with integrated payment processing via Razorpay, UPI, and credit/debit cards.

## Features

- Modern, responsive design with mobile-first approach
- Product browsing with filtering and search capabilities
- Shopping cart functionality
- Multi-step checkout process
- Multiple payment options:
  - Credit/Debit Cards
  - Razorpay (Indian payment gateway)
  - UPI Payments (Google Pay, PhonePe)
  - QR Code Payments
- User account system (login/register)
- Order management and tracking

## Technologies Used

### Frontend
- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (ES6+)
- Razorpay Checkout.js

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Razorpay API
- Security packages (Helmet, CORS, Rate Limiting)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Razorpay account for payment processing

### Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd SHOPPING-ECOMMERCE
```

2. Install frontend dependencies:
```bash
# No specific frontend dependencies needed
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Configure environment variables:
Create a `.env` file in the `backend` directory with the following variables:
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
MONGODB_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=production
FRONTEND_URL=http://localhost:8000
```

5. Start the backend server:
```bash
cd backend
npm run prod
```

6. Serve the frontend:
You can use any static file server. For development, you can use:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (install serve globally first)
npm install -g serve
serve -s . -p 8000
```

## Production Deployment

### Deploying to a Cloud Platform (Heroku Example)

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku:
```bash
heroku login
```

3. Create a new Heroku app:
```bash
heroku create your-app-name
```

4. Set environment variables:
```bash
heroku config:set RAZORPAY_KEY_ID=your_razorpay_key_id
heroku config:set RAZORPAY_KEY_SECRET=your_razorpay_key_secret
heroku config:set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-app-name.herokuapp.com
```

5. Deploy the application:
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### Deploying Frontend to Netlify/Vercel

1. Create an account on Netlify or Vercel
2. Connect your repository or upload the frontend files
3. Set the build settings:
   - Build command: (leave empty for static sites)
   - Publish directory: `/` (root directory)
4. Add environment variables if needed
5. Deploy the site

## Security Features

- Server-side order creation for Razorpay payments
- Signature verification for payment confirmation
- Webhook validation for payment status updates
- Input sanitization and validation
- Rate limiting to prevent abuse
- Security headers via Helmet.js
- Protection against HTTP Parameter Pollution (HPP)

## Payment Integration

### Razorpay Setup
1. Create a Razorpay account at https://razorpay.com
2. Obtain your API keys from the dashboard
3. Set up webhooks in the Razorpay dashboard:
   - URL: `https://your-backend-url/api/webhook`
   - Events: `payment.captured`, `payment.failed`, `order.paid`
4. Add your webhook secret to the `.env` file

### UPI Payments
The UPI payment system simulates sending a collect request to the user's UPI app. In a production environment, you would integrate with a UPI payment gateway.

## Customization

### Adding Products
To add new products, modify the `products` array in `script.js`. In a production environment, this data should come from a backend API connected to a database.

### Styling
All CSS is contained in `style.css`. Modify this file to change the appearance of the site.

### Modifying Categories
Update the category cards in `index.html` and the category filter dropdown to add or remove categories.

## Troubleshooting

### Common Issues

1. **Payment not processing**: Ensure your Razorpay keys are correct and your webhook is properly configured.

2. **Database connection errors**: Verify your MongoDB URI is correct and your database is accessible.

3. **CORS errors**: Check that your `FRONTEND_URL` environment variable matches your frontend's URL.

4. **Performance issues**: Ensure images are properly optimized and consider implementing lazy loading for product images.

### Browser Compatibility
The site is tested and works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Performance Optimizations

- CSS containment and will-change properties for smoother animations
- Efficient DOM manipulation
- Lazy loading of non-critical resources
- Minified CSS and JavaScript in production
- Optimized image sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository or contact the development team.