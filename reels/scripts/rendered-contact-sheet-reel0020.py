from pathlib import Path
from PIL import Image, ImageDraw

root = Path('/home/ubuntu/reel0020-frames')
times = ['5', '15', '25', '35', '50', '60']
thumb_w, thumb_h = 270, 480
sheet = Image.new('RGB', (thumb_w * 3, (thumb_h + 42) * 2), (25, 28, 32))
draw = ImageDraw.Draw(sheet)
for index, sec in enumerate(times):
    img = Image.open(root / f'frame_{sec}.jpg').convert('RGB')
    img.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
    x = (index % 3) * thumb_w
    y = (index // 3) * (thumb_h + 42)
    sheet.paste(img, (x, y))
    draw.text((x + 12, y + thumb_h + 10), f'{sec}s', fill=(245, 240, 224))
out = root / 'REEL-0020_rendered_contact_sheet.jpg'
sheet.save(out, quality=92)
print(out)
