# Deploying to Render

This guide will walk you through deploying both the backend (Node.js/Express) and frontend (React/Vite) to Render.

## Prerequisites

1. A [Render account](https://render.com/) (free tier is sufficient)
2. A GitHub account
3. Your code pushed to a GitHub repository

## Step 1: Push Your Code to GitHub

First, commit and push your code to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Deploy Using render.yaml (Recommended - Blueprint)

### Option A: Deploy as a Blueprint (Both Services at Once)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file
5. Click "Apply" to create both services

### Configure Environment Variables

After deployment, you'll need to set these environment variables in the Render dashboard:

#### For Backend Service (exportable-markdown-api):
1. Go to your backend service in Render
2. Navigate to "Environment" tab
3. Add these variables:
   - `MONGODB_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas)
   - `CORS_ORIGIN`: Your frontend URL (will be `https://your-frontend.onrender.com`)
   - `NODE_ENV`: Set to `production`

#### For Frontend Service (exportable-markdown-frontend):
1. Go to your frontend service in Render
2. Navigate to "Environment" tab
3. Add:
   - `VITE_API_URL`: Your backend URL (will be `https://your-backend-api.onrender.com`)

## Step 3: Alternative - Deploy Services Individually

If you prefer to deploy services separately:

### Deploy Backend:

1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name**: exportable-markdown-api
   - **Root Directory**: exportable-markdown-node
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables (as listed above)
5. Click "Create Web Service"

### Deploy Frontend:

1. Click "New +" → "Static Site"
2. Connect your GitHub repo
3. Configure:
   - **Name**: exportable-markdown-frontend
   - **Root Directory**: exportable-markdown-main
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL
5. Click "Create Static Site"

## Step 4: MongoDB Setup

You'll need a MongoDB database. Options:

### MongoDB Atlas (Recommended - Free Tier):
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add your Render service IP to whitelist (or allow from anywhere for testing)
4. Get your connection string
5. Add it as `MONGODB_URI` in your backend environment variables

### Local Testing Connection String:
```
mongodb://localhost:27017/exportable-markdown
```

### Atlas Connection String Format:
```
mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/exportable-markdown?retryWrites=true&w=majority
```

## Step 5: Update CORS Settings

After both services are deployed:

1. Get your frontend URL (e.g., `https://your-frontend.onrender.com`)
2. Go to backend service → Environment
3. Update `CORS_ORIGIN` to include your frontend URL
4. The backend will automatically restart

## Step 6: Verify Deployment

1. Visit your frontend URL
2. Check if it loads properly
3. Test the connection to backend by using any feature that requires the API
4. Check Render logs if there are issues:
   - Backend logs: Service → Logs tab
   - Frontend build logs: Static Site → Events tab

## Troubleshooting

### Backend Issues:
- Check MongoDB connection string is correct
- Verify CORS_ORIGIN matches your frontend URL exactly
- Look at logs for specific error messages

### Frontend Issues:
- Ensure VITE_API_URL points to your backend
- Check build logs for compilation errors
- Verify the dist folder is being created

### Common Issues:
1. **CORS errors**: Make sure CORS_ORIGIN in backend matches frontend URL
2. **MongoDB connection fails**: Check connection string and IP whitelist
3. **Build fails**: Check Node version compatibility
4. **502 errors**: Service might be starting, wait a few minutes

## Environment Variables Summary

### Backend (.env):
```
PORT=3001
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=https://your-frontend.onrender.com
```

### Frontend (.env):
```
VITE_API_URL=https://your-backend-api.onrender.com
```

## Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-50 seconds
- Limited to 750 hours/month of runtime
- Consider upgrading for production use

## Next Steps

1. Set up continuous deployment (automatic on git push)
2. Configure custom domain (if needed)
3. Set up monitoring and alerts
4. Consider upgrading to paid tier for better performance

## Support

- [Render Documentation](https://docs.render.com/)
- [Render Community](https://community.render.com/)
- Check service logs in Render dashboard for debugging