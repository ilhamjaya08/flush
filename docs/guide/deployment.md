# Deployment

Learn how to deploy your Flush applications to production environments.

## Build for Production

### 1. Build Your Application

```bash
# Build the application
bun run build

# This creates a dist/ directory with compiled code
```

### 2. Environment Configuration

Create production environment file:

```bash
# .env.production
NODE_ENV=production
PORT=8080
HOST=0.0.0.0
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-production-secret
```

## Deployment Platforms

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

3. Deploy:
```bash
vercel --prod
```

### Railway

1. Create `railway.toml`:
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "bun run start"
```

2. Deploy:
```bash
railway login
railway link
railway up
```

### Docker

1. Create `Dockerfile`:
```dockerfile
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Build application
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

# Production image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist .
COPY --from=prerelease /usr/src/app/package.json .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "index.js"]
```

2. Build and run:
```bash
docker build -t my-flush-app .
docker run -p 3000:3000 my-flush-app
```

### VPS/Server

1. Install Bun on server:
```bash
curl -fsSL https://bun.sh/install | bash
```

2. Clone and setup:
```bash
git clone https://github.com/yourusername/your-app.git
cd your-app
bun install
bun run build
```

3. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start dist/index.js --name "flush-app"
pm2 startup
pm2 save
```

## Environment Variables

Set these in production:

```bash
NODE_ENV=production
PORT=8080
HOST=0.0.0.0
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://yourdomain.com
```

## Performance Optimization

### 1. Enable Compression

```typescript
// Add compression middleware
app.use(compressionMiddleware);
```

### 2. Static File Serving

```typescript
// Serve static files efficiently
app.use('/static', staticFileMiddleware);
```

### 3. Database Connection Pooling

```typescript
// Configure connection pool
const dbConfig = {
  pool: {
    min: 2,
    max: 10,
    idle: 10000
  }
};
```

## Monitoring

### Health Checks

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### Logging

```typescript
// Use structured logging in production
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Security

### 1. HTTPS

Always use HTTPS in production:

```typescript
// Use secure headers
app.use(securityHeadersMiddleware);
```

### 2. Rate Limiting

```typescript
app.use(Middleware.rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

### 3. CORS Configuration

```typescript
app.use(Middleware.cors({
  origin: process.env.CORS_ORIGIN?.split(',') || false,
  credentials: true
}));
```

## Database Migration

Run migrations in production:

```bash
# Run migrations
flush db:migrate

# Or using environment
NODE_ENV=production flush db:migrate
```

## Troubleshooting

### Common Issues

1. **Port binding**: Ensure your app binds to `0.0.0.0` not `localhost`
2. **Environment variables**: Double-check all required env vars are set
3. **Database connections**: Verify database URL and credentials
4. **File permissions**: Ensure proper file permissions on server

### Logs

Check application logs:

```bash
# PM2 logs
pm2 logs

# Docker logs
docker logs container-name

# System logs
journalctl -u your-service
```