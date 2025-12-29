#!/bin/bash

# Generate icon PNG files from SVG
# Requires ImageMagick to be installed: brew install imagemagick

if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed."
    echo "Install it with: brew install imagemagick"
    echo ""
    echo "Or use an online converter to create PNG files from icons/icon.svg"
    echo "Required sizes: 16x16, 48x48, 128x128"
    exit 1
fi

echo "Generating icon files..."

convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png

echo "✅ Icons generated successfully!"
echo "   - icons/icon16.png"
echo "   - icons/icon48.png"
echo "   - icons/icon128.png"
