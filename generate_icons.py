import os
from PIL import Image, ImageDraw, ImageFont

"""
Automated Icon Generator for Adwoa's Beauty
Requirements:
- Sizes: 72, 96, 128, 144, 152, 192, 384, 512
- Gradient: #ec4899 (Pink) to #f59e0b (Amber)
- Logo: White Serif "A"
- Placement: Center 80% (Safe zone for maskable icons)
"""

OUTPUT_DIR = "public/icons"
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
COLOR_PINK = (236, 72, 153)  # #ec4899
COLOR_AMBER = (245, 158, 11)  # #f59e0b

def create_diagonal_gradient(size, start_color, end_color):
    """Creates a diagonal linear gradient."""
    base = Image.new('RGB', (size, size), start_color)
    top = Image.new('RGB', (size, size), end_color)
    mask = Image.new('L', (size, size))
    mask_data = []
    for y in range(size):
        for x in range(size):
            # Diagonal ratio (top-left to bottom-right)
            ratio = (x + y) / (2 * size)
            mask_data.append(int(255 * ratio))
    mask.putdata(mask_data)
    return Image.composite(top, base, mask).convert("RGBA")

def generate_icons():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created directory: {OUTPUT_DIR}")

    for size in SIZES:
        # 1. Background with Gradient
        img = create_diagonal_gradient(size, COLOR_PINK, COLOR_AMBER)
        
        # 2. Apply Circular/Rounded Mask
        # While PWA icons are square, we define the background shape here.
        # For maskable icons, keeping the logo centered is more important than the shape itself.
        mask = Image.new("L", (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, size, size), fill=255)
        
        final_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        final_img.paste(img, (0, 0), mask)
        
        # 3. Draw White "A" (Serif)
        draw = ImageDraw.Draw(final_img)
        
        # Scale font to 50% of size to ensure it stays in the 80% safe zone
        font_size = int(size * 0.5)
        
        # Try common serif fonts
        font = None
        for font_path in ["georgia.ttf", "times.ttf", "serif"]:
            try:
                font = ImageFont.truetype(font_path, font_size)
                break
            except:
                continue
        
        if not font:
            font = ImageFont.load_default()

        # Center the text
        letter = "A"
        bbox = draw.textbbox((0, 0), letter, font=font)
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
        x = (size - w) / 2 - bbox[0]
        y = (size - h) / 2 - bbox[1]
        
        draw.text((x, y), letter, fill="white", font=font)
        
        # 4. Save
        filename = f"icon-{size}x{size}.png"
        final_img.save(os.path.join(OUTPUT_DIR, filename), "PNG")
        print(f"✅ Generated {filename}")

if __name__ == "__main__":
    generate_icons()
