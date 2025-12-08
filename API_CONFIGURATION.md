# API Configuration Guide

## Overview

This guide explains how to configure the API base URL for different deployment environments.

## Configuration

The frontend uses a configurable API base URL defined at the top of `script.js`:

```javascript
// API Base URL - Update this to your deployed backend URL for production
const API_BASE_URL = 'http://localhost:3000';
```

## Environment-Specific Configuration

### Development Environment
During development, the API base URL should point to your local backend server:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

### Production Environment
When deploying to production, update the API base URL to point to your deployed backend:

1. **For Render.com deployment:**
   ```javascript
   const API_BASE_URL = 'https://your-backend-service.onrender.com';
   ```

2. **For Heroku deployment:**
   ```javascript
   const API_BASE_URL = 'https://your-app-name.herokuapp.com';
   ```

3. **For other cloud providers:**
   ```javascript
   const API_BASE_URL = 'https://your-backend-domain.com';
   ```

## How to Update

1. Open `script.js` in a text editor
2. Locate the `API_BASE_URL` variable at the top of the file
3. Update the value to match your deployed backend URL
4. Save the file
5. Redeploy your frontend

## Important Notes

1. **HTTPS**: In production, always use HTTPS URLs for security
2. **No trailing slash**: Do not include a trailing slash in the API base URL
3. **CORS**: Ensure your backend is configured to accept requests from your frontend domain
4. **Environment variables**: For more advanced configurations, consider using environment variables or build-time configuration

## Testing

After updating the API base URL:

1. Deploy your frontend
2. Start your backend server
3. Visit your frontend in a browser
4. Try to create an order through the Razorpay payment flow
5. Check the browser's developer console for any errors
6. Verify that API calls are being made to the correct URL

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure your backend's `FRONTEND_URL` environment variable matches your frontend URL
2. **404 errors**: Verify that your backend URL is correct and the server is running
3. **Network errors**: Check that your frontend and backend are both accessible over the internet
4. **Mixed content warnings**: Ensure you're using HTTPS in production

### Debugging Steps

1. Open browser developer tools (F12)
2. Check the Console tab for JavaScript errors
3. Check the Network tab to see if API requests are being made
4. Verify request URLs are correct
5. Check response status codes and bodies