# Troubleshooting

Common issues and solutions when working with Flush Framework.

## Installation Issues

### Bun Not Found

**Problem:** `bun: command not found`

**Solution:**
```bash
# Add Bun to your PATH
export PATH="$HOME/.bun/bin:$PATH"

# Or reinstall Bun
curl -fsSL https://bun.sh/install | bash
```

### Permission Denied

**Problem:** Permission denied when running Bun

**Solution:**
```bash
# Fix permissions
chmod +x ~/.bun/bin/bun

# Or run with sudo (not recommended)
sudo bun install
```

## Development Issues

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Use different port
flush serve --port 8000

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Install missing types
bun add -d @types/bun

# Check tsconfig.json configuration
# Ensure proper module resolution
```

### Module Not Found

**Problem:** Cannot find module 'flush-core'

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules bun.lockb
bun install

# Check package.json dependencies
```

## Runtime Issues

### Database Connection

**Problem:** Database connection errors

**Solution:**
```bash
# Check DATABASE_URL environment variable
echo $DATABASE_URL

# Verify database is running
# Check connection string format
```

### Memory Issues

**Problem:** Out of memory errors

**Solution:**
```bash
# Increase memory limit
bun --max-old-space-size=4096 run dev

# Check for memory leaks in your code
```

## Build Issues

### Build Failures

**Problem:** Build process fails

**Solution:**
```bash
# Clear build cache
rm -rf dist

# Check for syntax errors
bun run build --verbose

# Verify all imports are correct
```

## Getting Help

If you're still having issues:

1. Check [GitHub Issues](https://github.com/flush-framework/flush/issues)
2. Join our [Discord community](https://discord.gg/flush-framework)
3. Search the [documentation](/guide/getting-started)
4. Create a minimal reproduction case