# Deploy to Render - Instructions

## Prerequisites
1. GitHub account with your code pushed
2. Render account (free at render.com)
3. MongoDB Atlas account for database (free tier available)

## Step 1: Prepare Your Repository
1. Push your code to GitHub if not already done
2. Ensure all files are committed including the `render.yaml`

## Step 2: Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Set up database user and password
4. Whitelist all IPs (0.0.0.0/0) for Render access
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

## Step 3: Deploy to Render

### Option A: Using render.yaml (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file
5. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `CORS_ORIGIN`: Will be set after frontend deploys
   - `VITE_API_URL`: Will be set after backend deploys

### Option B: Manual Setup

#### Deploy Backend First:
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: markdown-editor-api
   - **Root Directory**: exportable-markdown-node
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Add Environment Variables:
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `MONGODB_URI`: Your MongoDB connection string
   - `CORS_ORIGIN`: (leave empty for now)
6. Click "Create Web Service"
7. Copy the service URL (e.g., https://markdown-editor-api.onrender.com)

#### Deploy Frontend:
1. Click "New +" → "Static Site"
2. Connect same repository
3. Configure:
   - **Name**: markdown-editor-frontend
   - **Root Directory**: exportable-markdown-main
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: dist
4. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL from step 7
5. Click "Create Static Site"
6. Copy the site URL

#### Update Backend CORS:
1. Go back to your backend service settings
2. Update `CORS_ORIGIN` with your frontend URL
3. Redeploy the backend

## Step 4: Test Your Deployment
1. Visit your frontend URL
2. Test creating, editing, and exporting documents
3. Check browser console for any CORS errors

## Troubleshooting

### CORS Issues
- Ensure `CORS_ORIGIN` in backend matches your frontend URL exactly
- Include protocol (https://) but no trailing slash

### MongoDB Connection Issues
- Verify IP whitelist includes 0.0.0.0/0
- Check username/password in connection string
- Ensure database name is correct

### Build Failures
- Check Render logs for specific errors
- Verify all dependencies are in package.json
- Ensure build commands are correct

### Puppeteer Issues (PDF Export)
If PDF export fails:
1. Add buildpack to backend service:
   - Go to Settings → Environment
   - Add `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
2. Consider using alternative PDF libraries or external services

## Environment Variables Summary

### Backend (.env)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=https://your-frontend.onrender.com
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.onrender.com
```

## Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after idle will be slow (cold start)
- Limited build minutes per month
- Consider upgrading for production use

## Next Steps
- Set up custom domain (optional)
- Configure auto-deploy from GitHub
- Set up monitoring and alerts
- Consider CDN for static assets