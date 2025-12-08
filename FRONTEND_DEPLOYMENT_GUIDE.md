# Frontend Deployment Guide

## Deploying to Netlify

1. **Sign up for Netlify**
   - Go to [netlify.com](https://netlify.com) and create an account

2. **Deploy your site**
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Configure the deployment settings:
     - Branch to deploy: main (or master)
     - Build command: (leave empty for static sites)
     - Publish directory: / (root directory)

3. **Set Environment Variables (if needed)**
   - For this static site, most configuration is done in the JavaScript files
   - If you need to set environment variables, you can do so in the Netlify dashboard

4. **Custom Domain (Optional)**
   - In your site settings, go to "Domain Management"
   - Add your custom domain
   - Follow Netlify's instructions for DNS configuration

## Manual Deployment

If you prefer to deploy manually:

1. **Build the site**
   - No build process is needed for this static site

2. **Deploy to any static hosting service**
   - Upload all files to your hosting service
   - Ensure all files are accessible via HTTP

## Configuration After Deployment

After deploying both frontend and backend, you'll need to update the frontend to point to your deployed backend:

1. Open `script.js`
2. Find the line that sets the `API_BASE_URL` variable
3. Update it to point to your deployed backend URL:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.onrender.com';
   ```

## Testing Your Deployment

1. Visit your frontend URL
2. Test all functionality:
   - Product browsing
   - Cart functionality
   - Checkout process
   - Payment processing
3. Check the browser console for any errors
4. Verify that API calls are reaching your backend

## Continuous Deployment

Netlify will automatically rebuild and deploy your site whenever you push changes to your GitHub repository.