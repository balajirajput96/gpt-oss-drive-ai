from pathlib import Path
from PIL import Image, ImageDraw

root = Path('/home/ubuntu/gpt-oss-drive-ai/reels/output/REEL-0020')
thumb_w, thumb_h = 270, 480
sheet = Image.new('RGB', (thumb_w * 3, (thumb_h + 42) * 2), (28, 31, 36))
draw = ImageDraw.Draw(sheet)
for index in range(6):
    scene = f'{index+1:02d}'
    img = Image.open(root / f'REEL-0020_scene_{scene}.png').convert('RGB')
    img.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
    x = (index % 3) * thumb_w
    y = (index // 3) * (thumb_h + 42)
    sheet.paste(img, (x, y))
    draw.text((x + 12, y + thumb_h + 10), f'Scene {scene}', fill=(245, 240, 224))
out = root / 'REEL-0020_visual_contact_sheet.jpg'
sheet.save(out, quality=92)
print(out)
