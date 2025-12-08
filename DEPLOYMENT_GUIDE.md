# Complete Deployment Guide

## Overview

This guide will walk you through deploying the Caelis e-commerce site to production. The application consists of:

1. **Frontend**: Static HTML/CSS/JavaScript site
2. **Backend**: Node.js/Express API with MongoDB
3. **Database**: MongoDB Atlas
4. **Payments**: Razorpay integration

## Prerequisites

Before deploying, ensure you have:

1. A GitHub account with the repository pushed
2. A Render.com account for backend hosting
3. A Netlify account for frontend hosting
4. A MongoDB Atlas account with a cluster set up
5. A Razorpay account with API keys

## Step-by-Step Deployment

### 1. Database Setup (MongoDB Atlas)

1. Log in to MongoDB Atlas
2. Create a cluster if you haven't already
3. Create a database user:
   - Username: `sagardhapate16_db_user` (or your preferred username)
   - Password: Set a strong password
4. Whitelist IP addresses:
   - For testing: Add `0.0.0.0/0` (allows all IPs)
   - For production: Add specific IP addresses including your Render server IPs
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

### 2. Backend Deployment (Render.com)

Follow the instructions in `BACKEND_DEPLOYMENT_GUIDE.md`:

1. Sign up for Render.com
2. Connect your GitHub repository
3. Configure the service with the proper settings
4. Set all environment variables:
   - `MONGODB_URI`: Your MongoDB connection string (replace `<password>` with actual password)
   - `RAZORPAY_KEY_ID`: Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay secret key
   - `RAZORPAY_WEBHOOK_SECRET`: Your webhook secret
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://your-site.netlify.app`)
   - Other email configuration variables as needed

### 3. Frontend Deployment (Netlify)

Follow the instructions in `FRONTEND_DEPLOYMENT_GUIDE.md`:

1. Sign up for Netlify
2. Connect your GitHub repository
3. Configure deployment settings
4. Deploy the site

### 4. Connect Frontend to Backend

After deploying both services:

1. Get your backend URL from Render (e.g., `https://caelis-ecommerce-backend.onrender.com`)
2. Update the frontend to use this URL:
   - Open `script.js` in your repository
   - Find the `API_BASE_URL` variable
   - Update it to your backend URL
   - Commit and push the change
   - Netlify will automatically redeploy

### 5. Razorpay Configuration

1. Log in to your Razorpay dashboard
2. Go to Settings > Webhooks
3. Add a new webhook:
   - URL: `https://your-backend-url.onrender.com/api/webhook`
   - Events: Select `payment.captured`, `payment.failed`, and `order.paid`
   - Secret: Set a strong secret and save it (you'll use this as `RAZORPAY_WEBHOOK_SECRET`)
4. Get your API keys:
   - Go to Settings > API Keys
   - Copy your key ID and secret

### 6. Final Testing

1. Visit your deployed frontend
2. Test all functionality:
   - Browse products
   - Add items to cart
   - Proceed to checkout
   - Complete a test payment
3. Check your backend logs in Render for any errors
4. Verify orders are being saved to MongoDB

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in your backend environment variables matches your frontend URL
   - Restart your Render service after updating environment variables

2. **MongoDB Connection Errors**
   - Verify your MongoDB URI is correct
   - Check that your IP is whitelisted in MongoDB Atlas
   - Ensure your database user credentials are correct

3. **Payment Processing Issues**
   - Verify your Razorpay keys are correct
   - Check that your webhook is properly configured
   - Ensure your frontend is pointing to the correct backend URL

4. **Slow Loading Times**
   - Check your Render service logs for performance issues
   - Optimize images and assets
   - Consider upgrading from the free tier on Render for better performance

## Maintenance

1. **Regular Updates**
   - Keep dependencies updated by running `npm update` periodically
   - Monitor security advisories for your dependencies

2. **Monitoring**
   - Use Render's built-in monitoring
   - Set up alerts for downtime or performance issues
   - Monitor MongoDB Atlas for usage and performance

3. **Backups**
   - Regularly backup your MongoDB database
   - Keep copies of important environment variables and configurations

## Scaling Considerations

1. **Traffic Growth**
   - Upgrade from Render's free tier to a paid plan as traffic increases
   - Consider implementing caching mechanisms
   - Optimize database queries

2. **Database Scaling**
   - Monitor MongoDB Atlas usage
   - Consider upgrading your cluster tier as data grows
   - Implement database indexing for better query performance

3. **Advanced Features**
   - Consider implementing a CDN for static assets
   - Add Redis for session storage and caching
   - Implement load balancing for high traffic scenarios