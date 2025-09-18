# 🚀 Deployment Guide - Railway

## Quick Deploy to Railway (Recommended)

### **Step 1: Deploy Backend to Railway**

1. **Go to Railway**: https://railway.app
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**: `mrsyedhasan/weather-app`
6. **Select "Backend"** as the service
7. **Railway will auto-detect** it's a Node.js app

### **Step 2: Configure Environment Variables**

In Railway dashboard:
1. **Go to your backend service**
2. **Click "Variables" tab**
3. **Add these variables**:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   PORT=3001
   NODE_ENV=production
   ```

### **Step 3: Deploy Frontend to Railway**

1. **Add another service** in the same project
2. **Select "Deploy from GitHub repo"**
3. **Choose your repository** again
4. **Select "Frontend"** as the service
5. **Add environment variable**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

### **Step 4: Get Your URLs**

Railway will give you:
- **Backend URL**: `https://your-backend.railway.app`
- **Frontend URL**: `https://your-frontend.railway.app`

## Alternative: Vercel + Railway

### **Backend on Railway**
- Deploy backend to Railway (as above)
- Get backend URL

### **Frontend on Vercel**
1. **Go to Vercel**: https://vercel.com
2. **Import your GitHub repo**
3. **Set build settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
4. **Add environment variable**:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

## Alternative: Render

### **Step 1: Deploy Backend**
1. **Go to Render**: https://render.com
2. **Sign up** with GitHub
3. **New Web Service**
4. **Connect your repo**
5. **Settings**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
6. **Add environment variables**:
   ```
   OPENWEATHER_API_KEY=your_api_key
   NODE_ENV=production
   ```

### **Step 2: Deploy Frontend**
1. **New Static Site**
2. **Connect your repo**
3. **Settings**:
   - Build Command: `cd frontend && npm run build`
   - Publish Directory: `frontend/dist`
4. **Add environment variable**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

## 🎯 **Recommended Setup**

**Railway (Full Stack)**:
- ✅ Easiest setup
- ✅ Both frontend and backend
- ✅ $5 free credit per month
- ✅ Auto-deploy from GitHub

## 📋 **Pre-Deployment Checklist**

- [ ] Get OpenWeatherMap API key
- [ ] Test app locally
- [ ] Push latest code to GitHub
- [ ] Choose hosting platform
- [ ] Set up environment variables
- [ ] Test deployed app

## 🔧 **Environment Variables Needed**

### Backend:
```
OPENWEATHER_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=production
```

### Frontend:
```
VITE_API_URL=https://your-backend-url.com
```

## 🚨 **Important Notes**

1. **API Key**: Never commit your API key to GitHub
2. **CORS**: Backend is configured for CORS
3. **Rate Limiting**: Your app has built-in protection
4. **Caching**: 5-minute cache reduces API calls

## 🎉 **After Deployment**

Your weather app will be live at:
- **Frontend**: Your hosting platform URL
- **Backend**: Your backend service URL
- **API Usage**: `/api-usage` endpoint for monitoring

## 📞 **Need Help?**

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
