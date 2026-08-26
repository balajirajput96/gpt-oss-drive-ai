from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import hashlib
import json
import math
import random

ROOT = Path('/home/ubuntu/gpt-oss-drive-ai')
OUT = ROOT / 'reels' / 'output' / 'REEL-0020'
OUT.mkdir(parents=True, exist_ok=True)
W, H = 1440, 2560

SCENES = {
    '01': {
        'title': 'sleep_context',
        'palette': ((28, 43, 74), (96, 116, 146), (238, 205, 151)),
        'brief': 'A calm adult learner at a desk in early morning light, with a subtle sleep cue and a gentle warm focus pool on a notebook.',
    },
    '02': {
        'title': 'attention_not_single_dial',
        'palette': ((43, 55, 61), (126, 143, 144), (236, 194, 124)),
        'brief': 'A calm learner balancing several soft translucent attention shapes around a notebook; conceptual illustration, not a mechanism diagram.',
    },
    '03': {
        'title': 'sleep_research_boundary',
        'palette': ((34, 56, 79), (101, 130, 151), (222, 184, 126)),
        'brief': 'An adult learner reviewing a neutral stack of blank research pages beside a moon-to-morning window; no readable text or study claim shown.',
    },
    '04': {
        'title': 'acute_stress_context',
        'palette': ((75, 42, 50), (145, 103, 104), (232, 182, 118)),
        'brief': 'A learner pausing at a desk while soft concentric pressure-like shapes recede into the background; illustrative stress context only.',
    },
    '05': {
        'title': 'environment_noise_context',
        'palette': ((45, 60, 68), (128, 147, 150), (225, 190, 135)),
        'brief': 'A learner at a desk in a quiet public study room with a softly blurred hallway and ordinary distant activity suggesting environmental noise.',
    },
    '06': {
        'title': 'low_risk_observation',
        'palette': ((35, 68, 67), (129, 157, 145), (235, 208, 151)),
        'brief': 'The same learner making a calm low-risk observation in a blank notebook as the room becomes visually quieter and more organized.',
    },
}


def lerp(a, b, t):
    return int(round(a + (b - a) * t))


def gradient(base, high):
    img = Image.new('RGB', (W, H))
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        c = tuple(lerp(base[i], high[i], t) for i in range(3))
        for x in range(W):
            px[x, y] = c
    return img


def add_glow(base, center, radius, color, alpha):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = center
    steps = 24
    for i in range(steps, 0, -1):
        r = int(radius * i / steps)
        a = int(alpha * (1 - i / steps) ** 0.35)
        d.ellipse((cx-r, cy-r, cx+r, cy+r), fill=(*color, a))
    layer = layer.filter(ImageFilter.GaussianBlur(radius / 8))
    base.alpha_composite(layer)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_person(draw, x, y, scale=1.0, shirt=(77, 96, 104), skin=(196, 143, 113), hair=(47, 39, 42), tired=False):
    # Consistent simple editorial figure, intentionally non-photorealistic and without identity cues.
    head_r = int(104 * scale)
    draw.ellipse((x-head_r, y-head_r, x+head_r, y+head_r), fill=skin)
    draw.pieslice((x-head_r, y-head_r, x+head_r, y+head_r), 180, 355, fill=hair)
    eye_y = y - int(12 * scale)
    eye_dx = int(34 * scale)
    draw.ellipse((x-eye_dx-7, eye_y-4, x-eye_dx+7, eye_y+5), fill=(42, 42, 45))
    draw.ellipse((x+eye_dx-7, eye_y-4, x+eye_dx+7, eye_y+5), fill=(42, 42, 45))
    if tired:
        draw.arc((x-eye_dx-12, eye_y+7, x-eye_dx+12, eye_y+22), 15, 165, fill=(104, 76, 74), width=max(2, int(4*scale)))
        draw.arc((x+eye_dx-12, eye_y+7, x+eye_dx+12, eye_y+22), 15, 165, fill=(104, 76, 74), width=max(2, int(4*scale)))
    draw.arc((x-26*scale, y+16*scale, x+26*scale, y+52*scale), 10, 170, fill=(96, 62, 60), width=max(2, int(4*scale)))
    shoulder = int(190 * scale)
    top = y + int(115 * scale)
    rounded(draw, (x-shoulder, top, x+shoulder, top+int(370*scale)), int(95*scale), shirt)
    # arms toward desk
    draw.line((x-120*scale, top+180*scale, x-260*scale, top+300*scale), fill=skin, width=max(16, int(34*scale)))
    draw.line((x+120*scale, top+180*scale, x+260*scale, top+300*scale), fill=skin, width=max(16, int(34*scale)))


def draw_room(draw, accent, noisy=False, window=True):
    # desk and room geometry
    if window:
        rounded(draw, (120, 240, 1320, 930), 44, (185, 205, 207), outline=(236, 238, 228), width=10)
        draw.line((720, 250, 720, 920), fill=(153, 170, 171), width=10)
        draw.line((130, 585, 1310, 585), fill=(153, 170, 171), width=10)
        draw.rectangle((160, 280, 690, 560), fill=accent)
        draw.rectangle((750, 280, 1280, 560), fill=tuple(min(255, c+22) for c in accent))
        draw.ellipse((260, 320, 400, 460), fill=(244, 213, 156))
    draw.rectangle((0, 1010, W, 2560), fill=(50, 57, 63))
    draw.rectangle((0, 1050, W, 1190), fill=(88, 76, 69))
    draw.line((0, 1200, W, 1200), fill=(38, 40, 46), width=18)
    rounded(draw, (190, 1270, 1250, 1570), 34, (173, 139, 105))
    draw.rectangle((240, 1550, 310, 2450), fill=(100, 79, 68))
    draw.rectangle((1130, 1550, 1200, 2450), fill=(100, 79, 68))
    # blank notebook and cup
    rounded(draw, (610, 1350, 920, 1510), 18, (242, 235, 214))
    draw.line((660, 1390, 870, 1390), fill=(215, 202, 180), width=8)
    draw.line((660, 1430, 850, 1430), fill=(215, 202, 180), width=8)
    rounded(draw, (980, 1320, 1080, 1470), 24, (76, 89, 89))
    draw.arc((1060, 1350, 1125, 1440), 280, 80, fill=(76, 89, 89), width=16)
    if noisy:
        for i in range(7):
            yy = 360 + i * 105
            draw.arc((250 + i*30, yy, 530 + i*30, yy+170), 205, 335, fill=(248, 226, 181), width=13)
        for i in range(4):
            draw.ellipse((1050+i*55, 790+i*15, 1080+i*55, 820+i*15), fill=(218, 177, 131))


def make_scene(scene_id, spec):
    base, mid, accent = spec['palette']
    img = gradient(base, mid).convert('RGBA')
    add_glow(img, (W//2, 1350), 630, accent, 130)
    draw = ImageDraw.Draw(img)
    draw_room(draw, accent, noisy=scene_id == '05', window=scene_id != '04')
    if scene_id == '01':
        draw.ellipse((1120, 850, 1320, 1050), fill=(32, 45, 68))
        draw.arc((1140, 880, 1280, 1020), 30, 300, fill=(244, 218, 163), width=18)
        draw_person(draw, 720, 980, 1.15, shirt=(70, 89, 104), tired=True)
        add_glow(img, (780, 1400), 360, (253, 207, 134), 95)
    elif scene_id == '02':
        draw_person(draw, 720, 980, 1.15, shirt=(74, 91, 95))
        for angle in range(0, 360, 60):
            cx = 720 + int(390 * math.cos(math.radians(angle)))
            cy = 1180 + int(300 * math.sin(math.radians(angle)))
            r = 76
            draw.ellipse((cx-r, cy-r, cx+r, cy+r), fill=(*accent, 115), outline=(241, 220, 177), width=8)
        draw.ellipse((610, 1230, 830, 1450), outline=(241, 220, 177), width=12)
    elif scene_id == '03':
        draw_person(draw, 720, 980, 1.15, shirt=(70, 92, 108))
        for i in range(4):
            rounded(draw, (330+i*22, 1320-i*13, 640+i*22, 1540-i*13), 14, (239, 232, 213), outline=(212, 195, 165), width=6)
        draw.ellipse((260, 330, 400, 470), fill=(225, 233, 229))
        draw.arc((258, 328, 402, 472), 45, 315, fill=(75, 96, 119), width=10)
    elif scene_id == '04':
        draw.rectangle((0, 0, W, 1010), fill=(67, 38, 48))
        for r in [220, 340, 460, 580]:
            draw.arc((720-r, 580-r, 720+r, 580+r), 200, 340, fill=(219, 137, 124), width=16)
        draw_person(draw, 720, 980, 1.15, shirt=(89, 77, 84), tired=True)
        draw.ellipse((600, 1240, 840, 1480), outline=(244, 205, 153), width=11)
    elif scene_id == '05':
        draw_person(draw, 720, 980, 1.15, shirt=(76, 96, 101))
        for x in [250, 1080]:
            rounded(draw, (x, 740, x+110, 1120), 24, (66, 79, 80))
            draw.ellipse((x+25, 700, x+85, 760), fill=(189, 145, 110))
        for x in [330, 1050]:
            draw.line((x, 1120, x+70, 1280), fill=(66, 79, 80), width=18)
        add_glow(img, (720, 1270), 340, (247, 215, 168), 75)
    elif scene_id == '06':
        draw_person(draw, 720, 980, 1.15, shirt=(68, 101, 94))
        draw.line((660, 1410, 850, 1410), fill=(111, 148, 130), width=10)
        draw.line((660, 1450, 820, 1450), fill=(111, 148, 130), width=10)
        draw.line((660, 1490, 790, 1490), fill=(111, 148, 130), width=10)
        for x in [220, 1220]:
            draw.line((x, 420, x, 1030), fill=(224, 216, 181), width=10)
            draw.ellipse((x-52, 350, x+52, 454), fill=(227, 210, 158))
        add_glow(img, (720, 1320), 430, (231, 226, 181), 90)
    # soft grain-like dots for editorial texture, deterministic and subtle
    rng = random.Random(int(scene_id))
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for _ in range(900):
        x, y = rng.randrange(W), rng.randrange(H)
        alpha = rng.randrange(4, 13)
        od.point((x, y), fill=(255, 245, 220, alpha))
    img = Image.alpha_composite(img, overlay).convert('RGB')
    path = OUT / f'REEL-0020_scene_{scene_id}.png'
    img.save(path, format='PNG', optimize=True)
    sha = hashlib.sha256(path.read_bytes()).hexdigest()
    return path, sha, path.stat().st_size

results = []
for scene_id, spec in SCENES.items():
    path, sha, size = make_scene(scene_id, spec)
    results.append({'sceneId': scene_id, 'path': str(path), 'sha256': sha, 'bytes': size})
print(json.dumps(results, indent=2))
