#!/bin/bash

echo "Starting optimization..."

# Optimize Photos HEIC -> JPG (max width 1200 or just jpeg conversion)
mkdir -p Fotos/optimized
for img in Fotos/*.HEIC; do
  if [ -f "$img" ]; then
    filename=$(basename "$img" .HEIC)
    # Convert and resize max height/width 1500 to save space
    sips -Z 1500 -s format jpeg "$img" --out "Fotos/optimized/$filename.jpg"
  fi
done

# And for diseños - some are PNG / JPG, just resize them to save space if needed
mkdir -p diseños/optimized
for img in diseños/*.{PNG,JPG,jpg,png}; do
  if [ -f "$img" ]; then
    filename=$(basename "$img")
    name="${filename%.*}"
    # Convert all to jpg for consistency and save space
    sips -Z 1500 -s format jpeg "$img" --out "diseños/optimized/$name.jpg"
  fi
done

# Optimize Videos MOV -> M4V 720p
mkdir -p videos/optimized
for vid in videos/*.{MOV,mov}; do
  if [ -f "$vid" ]; then
    filename=$(basename "$vid")
    name="${filename%.*}"
    # avconvert to AppleM4V720pHD
    avconvert --source "$vid" --preset PresetAppleM4V720pHD --output "videos/optimized/$name.m4v" --replace
  fi
done

echo "Optimization complete."
