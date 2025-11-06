# Deployment Guide

This guide covers deploying your Fleet Management System to production.

## Pre-Deployment Checklist

### Security
- [ ] Change `NEXTAUTH_SECRET` to a secure random string
- [ ] Update all default passwords in seed script
- [ ] Review and update CORS settings if needed
- [ ] Enable HTTPS in production
- [ ] Set `NODE_ENV=production`

### Database
- [ ] Choose production database (PostgreSQL recommended)
- [ ] Set up database hosting (Railway, Supabase, etc.)
- [ ] Update `DATABASE_URL` in environment variables
- [ ] Run migrations on production database
- [ ] Set up automated backups

### Environment Variables
- [ ] Copy all variables from `.env.example`
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Generate new `NEXTAUTH_SECRET`
- [ ] Set production `DATABASE_URL`

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Pros:** Zero-config, automatic deployments, built for Next.js
**Time:** 5 minutes

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NODE_ENV=production`

5. Deploy!

**Database Options with Vercel:**
- Vercel Postgres (built-in)
- Railway
- Supabase
- PlanetScale

### Option 2: Railway

**Pros:** Includes database hosting, simple deployment
**Time:** 10 minutes

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Add Next.js service from GitHub
5. Set environment variables
6. Deploy

### Option 3: Render

**Pros:** Free tier available, includes database
**Time:** 15 minutes

1. Go to [render.com](https://render.com)
2. Create PostgreSQL database
3. Create Web Service from GitHub
4. Set build command: `npm install && npx prisma generate && npm run build`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

### Option 4: Self-Hosted (VPS)

**Requirements:**
- Ubuntu/Debian server
- Node.js 18+
- PostgreSQL
- Nginx (reverse proxy)
- PM2 (process manager)

**Steps:**

1. Set up server and install dependencies:
```bash
sudo apt update
sudo apt install nodejs npm postgresql nginx
npm install -g pm2
```

2. Set up PostgreSQL:
```bash
sudo -u postgres createdb fleet_management
```

3. Clone and set up application:
```bash
git clone YOUR_REPO
cd your-repo
npm install
npx prisma generate
npx prisma db push
```

4. Create `.env` file with production values

5. Build application:
```bash
npm run build
```

6. Start with PM2:
```bash
pm2 start npm --name "fleet-app" -- start
pm2 save
pm2 startup
```

7. Configure Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. Enable HTTPS with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Database Migration (SQLite to PostgreSQL)

If you developed with SQLite and need to migrate:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

3. Run migration:
```bash
npx prisma generate
npx prisma db push
```

4. Seed production database:
```bash
node scripts/seed.js
```

## Environment Variables for Production

Required variables:

```env
# Database - PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-super-secure-secret-here"

# NextAuth - Your production domain
NEXTAUTH_URL="https://your-domain.com"

# Node environment
NODE_ENV="production"
```

## Post-Deployment Steps

1. **Test the application:**
   - Login functionality
   - Create, read, update, delete operations
   - API endpoints
   - Mobile responsiveness

2. **Set up monitoring:**
   - Error tracking (Sentry, LogRocket)
   - Performance monitoring (Vercel Analytics)
   - Uptime monitoring (UptimeRobot)

3. **Configure backups:**
   - Automated database backups
   - Regular backup testing
   - Backup retention policy

4. **Security hardening:**
   - Enable rate limiting
   - Set up WAF if needed
   - Regular security updates
   - SSL/TLS configuration

5. **Create admin account:**
```bash
# Use the seed script or create via API
```

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check for TypeScript errors: `npm run type-check`

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database is accessible from deployment platform
- Ensure Prisma client is generated: `npx prisma generate`

### Authentication Not Working
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure cookies are allowed

### API Routes 404
- Verify build completed successfully
- Check Next.js configuration
- Review deployment logs

## Performance Optimization

### Before Production
1. Enable Next.js image optimization
2. Set up CDN for static assets
3. Configure caching headers
4. Optimize database queries
5. Add database indexes

### Monitoring
- Set up performance tracking
- Monitor database query performance
- Track API response times
- Monitor memory usage

## Scaling Considerations

### When to Scale
- Response times > 2 seconds
- Database connections maxed out
- High CPU/memory usage
- Traffic increases significantly

### Scaling Options
1. **Vertical scaling:** Upgrade server resources
2. **Horizontal scaling:** Add more instances
3. **Database scaling:** Read replicas, connection pooling
4. **Caching:** Redis for sessions and data
5. **CDN:** CloudFlare, AWS CloudFront

## Maintenance

### Regular Tasks
- [ ] Weekly: Check error logs
- [ ] Monthly: Review performance metrics
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Quarterly: Database optimization

### Updates
```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

## Rollback Plan

If deployment fails:

1. **Vercel/Railway:** Use platform's rollback feature
2. **Self-hosted:**
```bash
pm2 stop fleet-app
git checkout previous-commit
npm install
npm run build
pm2 restart fleet-app
```

3. **Database:** Restore from backup if schema changed

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Vercel Support: https://vercel.com/support
- Railway Docs: https://docs.railway.app

---

**Ready to deploy!** Choose your platform and follow the steps above.
