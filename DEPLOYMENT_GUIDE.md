# Toolmatic - Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier)
- Toolmatic website code ready

## Step 1: Update Domain References

Before deploying, update all domain references from `toolmatic.com` to your actual domain:

**Files to update:**
1. `index.html` - Update canonical URL, Open Graph, Twitter cards
2. `pages/*.html` - Update all page meta tags
3. `pages/tools/*.html` - Update all tool page meta tags
4. `pages/blog/*.html` - Update all blog post meta tags
5. `sitemap.xml` - Update all URLs
6. `robots.txt` - Update sitemap URL

**Example:**
Replace `https://toolmatic.com/` with `https://yourdomain.com/`

## Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it: `toolmatic` (or your preferred name)
3. Make it public (recommended) or private
4. Don't initialize with README, .gitignore, or license

## Step 3: Push Code to GitHub

Open terminal in the Toolmatic directory:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Toolmatic website"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/toolmatic.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### Option A: Via Vercel Website

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: (leave empty for static site)
   - **Output Directory**: `./` (leave as default)
5. Click "Deploy"
6. Wait for deployment to complete (usually 1-2 minutes)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
# - Link to existing project? No
# - Project name: toolmatic
# - Link to directory: ./
# - Override settings? No
```

## Step 5: Configure Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `yourdomain.com`)
4. Vercel will provide DNS records to add to your domain registrar
5. Add the DNS records:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`

## Step 6: Verify Deployment

After deployment, verify:

1. **Homepage loads correctly**
   - Visit your Vercel URL
   - Check all sections display properly

2. **All tool pages work**
   - Test each tool functionality
   - Verify JavaScript loads correctly

3. **Navigation works**
   - Test all menu links
   - Check breadcrumb navigation

4. **SEO files accessible**
   - Visit `/sitemap.xml`
   - Visit `/robots.txt`

5. **Mobile responsive**
   - Test on mobile devices
   - Check hamburger menu works

## Step 7: Update Sitemap with Production URL

After deployment with custom domain:

1. Update `sitemap.xml` with your production URL
2. Update `robots.txt` sitemap reference
3. Commit and push changes
4. Vercel will auto-redeploy

## Post-Deployment Checklist

- [ ] Homepage displays correctly
- [ ] All tool pages load and function
- [ ] Category pages (SEO Tools, Calculators) display correctly
- [ ] Blog index and blog posts load
- [ ] Legal pages (About, Contact, Privacy, Terms, Disclaimer) load
- [ ] Navigation works on all pages
- [ ] Mobile responsive design works
- [ ] sitemap.xml is accessible at `/sitemap.xml`
- [ ] robots.txt is accessible at `/robots.txt`
- [ ] SSL/HTTPS is enabled (automatic with Vercel)
- [ ] Custom domain configured (if applicable)

## Performance Optimization (Optional)

1. **Enable Vercel Analytics**
   - Go to project settings
   - Enable Analytics
   - Add analytics script to pages

2. **Optimize Images**
   - Convert images to WebP format
   - Use Vercel Image Optimization

3. **Enable Caching**
   - Vercel automatically caches static assets
   - Cache headers are set automatically

## Troubleshooting

### Build Fails
- Check for syntax errors in HTML/CSS/JS
- Verify all file paths are correct
- Check Vercel deployment logs

### Pages Not Found (404)
- Verify file structure matches URLs
- Check case sensitivity in file names
- Ensure all files are committed to Git

### JavaScript Not Working
- Check browser console for errors
- Verify JavaScript file paths are correct
- Ensure no conflicting scripts

### Styling Issues
- Verify CSS files are linked correctly
- Check for CSS syntax errors
- Clear browser cache

## Production Tips

1. **Monitor Performance**
   - Use Vercel Analytics
   - Check Core Web Vitals
   - Monitor load times

2. **SEO Optimization**
   - Submit sitemap to Google Search Console
   - Submit to Bing Webmaster Tools
   - Monitor search rankings

3. **Security**
   - Enable Vercel's security headers
   - Keep dependencies updated
   - Monitor for vulnerabilities

4. **Backup**
   - Keep GitHub repository updated
   - Regular commits
   - Tag releases

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://vercel.com/community
- GitHub Support: https://github.com/contact

## Next Steps

After successful deployment:

1. **Apply for Google AdSense**
   - Ensure website has sufficient content
   - Verify all pages are accessible
   - Check AdSense requirements
   - Submit application

2. **Set up Analytics**
   - Google Analytics 4
   - Track user behavior
   - Monitor traffic sources

3. **Social Media**
   - Share on social platforms
   - Create social media accounts
   - Engage with users

4. **Content Strategy**
   - Regular blog posts
   - Tool improvements
   - User feedback collection
