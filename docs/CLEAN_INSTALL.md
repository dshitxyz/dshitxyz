# Clean Install Logic

## Overview

The clean install system automatically detects changes in `package.json` files across the monorepo and performs a fresh dependency installation when needed. This ensures consistency and prevents dependency issues in CI/CD pipelines.

## How It Works

### Hash-Based Detection

1. **Calculates SHA256 hash** of all `package.json` files in the monorepo
2. **Compares with stored hash** (`.package-hash` file)
3. **If different**: Performs clean install (removes node_modules, pnpm-lock.yaml, reinstalls)
4. **If same**: Uses cached dependencies (fast path)

### Files Involved

```
scripts/
├── clean-install.sh          # Bash version (for Unix/Linux/Mac)
└── clean-install.js          # Node.js version (cross-platform)

.package-hash                 # Stored hash (generated, not committed)
```

## Usage

### Automatic (Recommended)

The clean install runs automatically before builds:

```bash
# Automatically runs clean-install before build
pnpm run build

# Automatically runs clean-install before test
pnpm run test

# Manual pre-build step
pnpm run pre-build
```

### Manual Execution

```bash
# Using Node.js script (cross-platform)
node scripts/clean-install.js

# Using bash script (Unix/Linux/Mac only)
./scripts/clean-install.sh

# Full clean (removes hash tracking too)
pnpm run clean
```

## Build Pipeline Integration

### Local Development

```bash
# Development (no pre-build, uses cache)
pnpm run dev

# Production build (with clean install check)
pnpm run build
```

### Vercel Deployment

The `vercel.json` includes the pre-build step:

```json
{
  "buildCommand": "pnpm run pre-build && pnpm --filter @dshit/web build",
  "installCommand": "pnpm install"
}
```

### GitHub Actions (Example)

```yaml
- name: Install dependencies with clean check
  run: pnpm run pre-build

- name: Build
  run: pnpm run build
```

## What Gets Cleaned

When a package.json change is detected:

- ✅ `node_modules/` (root and all workspaces)
- ✅ `pnpm-lock.yaml`
- ✅ All workspace `node_modules/` directories
- ❌ Other build artifacts (preserved for incremental builds)

## When Clean Install Triggers

Changes that trigger a clean install:

- ✅ Adding new dependency
- ✅ Removing dependency
- ✅ Updating version constraint
- ✅ Changing script in package.json
- ✅ First time setup (no hash file)

Changes that DON'T trigger clean install:

- ❌ Code changes in source files
- ❌ Build output changes
- ❌ Configuration changes (non-package.json)

## Performance Impact

### First Run / On Change
```
Clean install: ~30-60 seconds (full dependency resolution)
├── Remove node_modules: ~5s
├── Remove lock file: <1s
├── pnpm install: ~25-55s
└── Update hash: <1s
```

### Subsequent Runs (No Change)
```
Cached dependencies: ~1-2 seconds
├── Hash calculation: ~1s
└── Comparison: <1s
```

## Troubleshooting

### Hash File Not Created

**Problem**: `.package-hash` file is not being created

**Solution**:
```bash
# Manually create hash
node scripts/clean-install.js

# Or clean and rebuild
pnpm run clean
pnpm run build
```

### Always Runs Clean Install

**Problem**: Clean install runs every time (hash mismatch)

**Causes**:
- package.json timestamp changed
- Whitespace/formatting changes
- Symlink issues in monorepo

**Solution**:
```bash
# Clear hash and recalculate
rm -f .package-hash
node scripts/clean-install.js
```

### Script Not Found in CI/CD

**Problem**: `scripts/clean-install.js` not found in pipeline

**Solution**:
- Ensure repository includes `scripts/` directory
- Check git doesn't have `.gitignore` entry for scripts/
- Verify file permissions in CI environment

## Configuration

### Exclude Additional Directories

Edit `scripts/clean-install.js` to modify the `exclude` array:

```javascript
const exclude = ['node_modules', '.next', 'dist', '.git', 'my-dir'];
```

### Change Hash Storage Location

Edit `scripts/clean-install.js` to change hash file location:

```javascript
const HASH_FILE = '.my-custom-hash-file';
```

### Disable Clean Install

To disable and use cached dependencies always:

```bash
# Remove pre-build from build command
pnpm --filter @dshit/web build

# Or remove from package.json scripts
```

## Environment Variables

No environment variables required. Script auto-detects monorepo structure.

## Git Handling

### `.gitignore` Entry

```
# Clean install tracking
.package-hash
```

The hash file is **not committed** because:
- Hash changes on every machine/environment
- Forces unnecessary conflicts in PR merges
- Generated fresh on each clone

## CI/CD Best Practices

### GitHub Actions

```yaml
- uses: pnpm/action-setup@v2
  with:
    version: 10.29.3

- uses: actions/setup-node@v3
  with:
    node-version: '22'
    cache: 'pnpm'

- run: pnpm run pre-build
- run: pnpm run build
- run: pnpm run test
```

### Vercel (Already Configured)

The `vercel.json` includes the clean install step. No additional configuration needed.

### Docker

```dockerfile
COPY . /app
WORKDIR /app

# Run clean install with hash check
RUN pnpm install
RUN node scripts/clean-install.js

# Build
RUN pnpm --filter @dshit/web build
```

## Monitoring

### Logs to Watch For

**Clean install triggered**:
```
⚠️  Changes detected in package.json files!
🧹 Performing clean installation...
✅ Clean installation complete!
```

**Using cached dependencies**:
```
✅ No changes detected in package.json files
   Using cached dependencies...
```

## Advanced Usage

### Check Hash Without Install

```bash
# Just calculate and display hash
node -e "
const fs = require('fs');
const crypto = require('crypto');
const files = ['package.json', 'apps/web/package.json', 'packages/contracts/package.json'];
const hash = crypto.createHash('sha256');
files.forEach(f => hash.update(fs.readFileSync(f)));
console.log(hash.digest('hex'));
"
```

### Force Clean Install

```bash
# Always do clean install (ignore hash)
rm -f .package-hash
pnpm run pre-build
```

### Benchmark Performance

```bash
# Time with cache (fast)
time pnpm run pre-build

# Time without cache (slow)
rm -f .package-hash
time pnpm run pre-build
```

## Support

For issues or questions about the clean install system:

1. Check this documentation
2. Review `scripts/clean-install.js` source code
3. Run with manual hash calculation for diagnostics
4. Check CI/CD logs for environment-specific issues

## Future Enhancements

Potential improvements:

- [ ] Track `pnpm-workspace.yaml` changes too
- [ ] Support for `.npmrc` changes
- [ ] Detailed diff output when packages change
- [ ] Parallel installation for faster builds
- [ ] Integration with dependency security scanning
