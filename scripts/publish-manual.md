# Manual Publishing Guide

Karena npm butuh 2FA, publish manual satu-satu:

## 1. Setup 2FA dulu
```bash
npm login
npm profile enable-2fa auth-and-writes
```

## 2. Publish Core Package
```bash
cd packages/core
npm publish --access public
# Masukkan 2FA code ketika diminta
```

## 3. Publish CLI Package  
```bash
cd packages/cli
npm publish --access public
# Masukkan 2FA code ketika diminta
```

## 4. Publish Create-Flush Package
```bash
cd packages/create-flush  
npm publish --access public
# Masukkan 2FA code ketika diminta
```

## 5. Verify
```bash
# Test install
bunx create-flush test-app
cd test-app
bun install
bun run dev
```

## Alternative: Use NPM Automation Token

Buat automation token di npm dashboard:
1. Go to https://www.npmjs.com/settings/tokens
2. Create "Automation" token 
3. Set environment variable:
   ```bash
   export NPM_TOKEN=your_automation_token
   ```
4. Then run automated script