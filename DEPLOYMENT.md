# Deployment Guide for State Filing Requirements Tool

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial React app setup"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a React app
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Set project name
   - Confirm deployment

## Build Configuration

Vercel automatically detects the React app and sets:
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

## Environment Variables

No environment variables are required for this app.

## Custom Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Performance Optimization

The app is already optimized with:
- ✅ Code splitting
- ✅ Minified production build
- ✅ Optimized SVG loading
- ✅ Efficient React hooks usage
- ✅ Proper dependency management

## Monitoring

Vercel provides:
- Real-time performance metrics
- Error tracking
- Analytics (if enabled)
- Automatic deployments on git push

## Troubleshooting

### Build Failures
- Ensure all dependencies are in `package.json`
- Check for syntax errors in React components
- Verify SVG file is in `public/` directory

### Runtime Issues
- Check browser console for errors
- Verify SVG loading in network tab
- Ensure proper CORS headers (handled by Vercel)

### Performance Issues
- Monitor bundle size (currently ~50KB gzipped)
- Check for memory leaks in tooltips
- Optimize SVG rendering if needed

## Maintenance

### Updates
- Push changes to GitHub
- Vercel automatically redeploys
- Monitor deployment status

### Rollbacks
- Use Vercel dashboard to rollback to previous version
- All deployments are versioned automatically

## Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs in dashboard
3. Contact Vercel support if needed

For app functionality issues:
1. Check browser console
2. Review React component logic
3. Verify data integrity 