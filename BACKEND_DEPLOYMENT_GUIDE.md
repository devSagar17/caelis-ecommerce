# Backend Deployment Guide

## Deploying to Render.com

1. **Sign up for Render**
   - Go to [render.com](https://render.com) and create an account

2. **Connect your GitHub repository**
   - In Render dashboard, click "New Web Service"
   - Connect your GitHub account
   - Select your forked repository

3. **Configure the service**
   - Name: caelis-ecommerce-backend
   - Region: Choose the closest region to your users
   - Branch: main (or master)
   - Root Directory: backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set Environment Variables**
   Add the following environment variables in the Render dashboard:
   ```
   NODE_ENV=production
   PORT=3000
   RAZORPAY_KEY_ID=your_actual_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_actual_razorpay_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=https://your-frontend-url.com
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ADMIN_EMAIL=your_admin_email@gmail.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

6. **MongoDB Atlas Configuration**
   - Ensure your MongoDB Atlas cluster has your Render server IPs whitelisted
   - You can either:
     a) Add the specific Render IP addresses to your whitelist
     b) Temporarily add `0.0.0.0/0` to allow all IPs (less secure)
     c) Use Render's static outbound IPs (recommended)

## Health Check

Once deployed, you can check if your backend is running by visiting:
`https://your-render-app-url.onrender.com/api/health`

You should see a JSON response indicating the server is running.