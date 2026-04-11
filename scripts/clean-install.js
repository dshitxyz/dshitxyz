#!/usr/bin/env node

/**
 * Clean Install Script
 * Detects changes in package.json files and performs clean install if needed
 * Works cross-platform (Windows, Mac, Linux)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const HASH_FILE = '.package-hash';
const ROOT_DIR = __dirname.replace('/scripts', '');

console.log('🔍 Checking for package.json changes...\n');

// Get all package.json files (excluding node_modules and build dirs)
function getPackageJsonFiles() {
  const exclude = ['node_modules', '.next', 'dist', '.git'];
  const files = [];

  function walkDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (exclude.some((e) => fullPath.includes(e))) continue;

        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.name === 'package.json') {
          files.push(fullPath);
        }
      }
    } catch (err) {
      // Silently skip directories we can't read
    }
  }

  walkDir(ROOT_DIR);
  return files.sort();
}

// Calculate hash of all package.json contents
function calculateHash() {
  const files = getPackageJsonFiles();

  if (files.length === 0) {
    console.warn('⚠️  No package.json files found!');
    return null;
  }

  console.log(`📦 Found ${files.length} package.json file(s):`);
  files.forEach((f) => console.log(`   • ${path.relative(ROOT_DIR, f)}`));

  const hash = crypto.createHash('sha256');

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    hash.update(content);
  }

  console.log();
  return hash.digest('hex');
}

// Compare hashes and decide if clean install is needed
function shouldCleanInstall() {
  const currentHash = calculateHash();

  if (!currentHash) return true;

  if (!fs.existsSync(HASH_FILE)) {
    console.log('📝 No previous hash found - first run or clean state');
    return true;
  }

  const storedHash = fs.readFileSync(HASH_FILE, 'utf8').trim();

  if (currentHash === storedHash) {
    console.log('✅ No changes detected in package.json files');
    console.log('   Using cached dependencies...\n');
    return false;
  }

  console.log('⚠️  Changes detected in package.json files!');
  console.log(`   Previous: ${storedHash.substring(0, 12)}...`);
  console.log(`   Current:  ${currentHash.substring(0, 12)}...`);
  console.log();

  return true;
}

// Perform clean installation
function cleanInstall() {
  try {
    console.log('🧹 Performing clean installation...\n');

    console.log('  • Removing node_modules...');
    const dirsToClean = [
      path.join(ROOT_DIR, 'node_modules'),
      path.join(ROOT_DIR, 'apps/web/node_modules'),
      path.join(ROOT_DIR, 'apps/api/node_modules'),
      path.join(ROOT_DIR, 'packages/contracts/node_modules'),
      path.join(ROOT_DIR, 'packages/ui/node_modules'),
      path.join(ROOT_DIR, 'packages/config/node_modules'),
    ];

    for (const dir of dirsToClean) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }

    console.log('  • Removing pnpm-lock.yaml...');
    const lockFile = path.join(ROOT_DIR, 'pnpm-lock.yaml');
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }

    console.log('  • Installing fresh dependencies...');
    execSync('pnpm install', {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });

    // Store new hash
    const newHash = calculateHash();
    if (newHash) {
      fs.writeFileSync(HASH_FILE, newHash);
      console.log('\n✅ Clean installation complete!');
      console.log(`📦 New hash saved: ${newHash.substring(0, 12)}...\n`);
    }
  } catch (error) {
    console.error('\n❌ Clean installation failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Main execution
try {
  process.chdir(ROOT_DIR);

  if (shouldCleanInstall()) {
    cleanInstall();
  }

  console.log('✨ Build environment ready!\n');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
