#!/usr/bin/env python3
"""
Generate icon PNG files for the Chrome extension.
Requires: pip install pillow
"""

try:
    from PIL import Image, ImageDraw
    import math
except ImportError:
    print("Error: Pillow library not found.")
    print("Install it with: pip3 install pillow")
    print("\nAlternatively, open create-icons.html in your browser to generate icons.")
    exit(1)

def draw_icon(size):
    """Draw the extension icon at the specified size."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    radius = int(size * 0.45)
    
    # Draw gradient circle background (simplified - using solid color)
    draw.ellipse(
        [center - radius, center - radius, center + radius, center + radius],
        fill=(102, 126, 234, 255)  # #667eea
    )
    
    # Draw white clock face
    clock_radius = int(radius * 0.75)
    draw.ellipse(
        [center - clock_radius, center - clock_radius, 
         center + clock_radius, center + clock_radius],
        fill=(255, 255, 255, 230)
    )
    
    # Draw clock hands
    hand_width = max(1, int(size * 0.03))
    
    # Hour hand (pointing up)
    hour_length = int(radius * 0.4)
    draw.line(
        [(center, center), (center, center - hour_length)],
        fill=(102, 126, 234, 255),
        width=hand_width
    )
    
    # Minute hand (pointing right)
    minute_width = max(1, int(size * 0.02))
    minute_length = int(radius * 0.5)
    draw.line(
        [(center, center), (center + minute_length, center)],
        fill=(102, 126, 234, 255),
        width=minute_width
    )
    
    # Draw shield
    shield_width = int(radius * 0.45)
    shield_height = int(radius * 0.7)
    shield_top = center - int(radius * 0.55)
    shield_left = center - shield_width // 2
    shield_right = center + shield_width // 2
    
    # Simplified shield shape
    shield_points = [
        (center, shield_top),
        (shield_left, shield_top + int(shield_height * 0.15)),
        (shield_left, shield_top + int(shield_height * 0.65)),
        (center, shield_top + int(shield_height * 1.0)),
        (shield_right, shield_top + int(shield_height * 0.65)),
        (shield_right, shield_top + int(shield_height * 0.15)),
    ]
    
    draw.polygon(shield_points, fill=(118, 75, 162, 204))  # #764ba2 with alpha
    
    # Draw center dot
    dot_radius = max(1, int(size * 0.03))
    draw.ellipse(
        [center - dot_radius, center - dot_radius,
         center + dot_radius, center + dot_radius],
        fill=(102, 126, 234, 255)
    )
    
    return img

def main():
    """Generate all icon sizes."""
    sizes = [16, 48, 128]
    
    print("Generating icon files...")
    
    for size in sizes:
        filename = f"icons/icon{size}.png"
        img = draw_icon(size)
        img.save(filename, 'PNG')
        print(f"✅ Created {filename}")
    
    print("\n🎉 All icons generated successfully!")

if __name__ == '__main__':
    main()
