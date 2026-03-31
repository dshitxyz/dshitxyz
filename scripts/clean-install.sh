#!/bin/bash

# Clean Install Script - Detects package.json changes and performs clean install if needed
# Usage: ./scripts/clean-install.sh

set -e

echo "🔍 Checking for package.json changes..."

# Store hash of current package.json files
PACKAGE_HASH_FILE=".package-hash"
CURRENT_HASH=$(find . -name "package.json" -type f ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./dist/*" | sort | xargs cat | sha256sum | awk '{print $1}')

# Check if hash file exists and compare
if [ -f "$PACKAGE_HASH_FILE" ]; then
    STORED_HASH=$(cat "$PACKAGE_HASH_FILE")

    if [ "$CURRENT_HASH" = "$STORED_HASH" ]; then
        echo "✅ No changes detected in package.json files"
        echo "Using cached dependencies..."
        exit 0
    else
        echo "⚠️  Changes detected in package.json files"
        echo "Previous hash: $STORED_HASH"
        echo "Current hash:  $CURRENT_HASH"
    fi
else
    echo "📝 No previous hash found - first run or clean state"
fi

echo ""
echo "🧹 Performing clean installation..."

# Remove node_modules and lock files
echo "  • Removing node_modules..."
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

echo "  • Removing pnpm-lock.yaml..."
rm -f pnpm-lock.yaml

echo "  • Installing fresh dependencies..."
pnpm install --frozen-lockfile=false

# Store the new hash
echo "$CURRENT_HASH" > "$PACKAGE_HASH_FILE"

echo ""
echo "✅ Clean installation complete!"
echo "📦 Hash saved: $CURRENT_HASH"
