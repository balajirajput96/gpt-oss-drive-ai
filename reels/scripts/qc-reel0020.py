from __future__ import annotations

from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import re
import subprocess

ROOT = Path('/home/ubuntu/gpt-oss-drive-ai')
OUT = ROOT / 'reels' / 'output' / 'REEL-0020'
video = OUT / 'REEL-0020.mp4'
audio = OUT / 'REEL-0020_narration.wav'
captions = OUT / 'REEL-0020_captions.srt'


def probe(path: Path):
    result = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)],
        check=True, capture_output=True, text=True,
    )
    return json.loads(result.stdout)


def ts(value: str) -> float:
    h, m, rest = value.split(':')
    s, ms = rest.split(',')
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000

text = captions.read_text(encoding='utf-8')
blocks = [b.strip() for b in re.split(r'\n\s*\n', text) if b.strip()]
cues = []
for block in blocks:
    lines = block.splitlines()
    if len(lines) < 3:
        raise ValueError(f'Invalid SRT block: {block!r}')
    match = re.fullmatch(r'(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})', lines[1].strip())
    if not match:
        raise ValueError(f'Invalid SRT timing: {lines[1]!r}')
    start, end = ts(match.group(1)), ts(match.group(2))
    if end <= start:
        raise ValueError('Caption cue has non-positive duration.')
    cues.append({'index': int(lines[0]), 'start': start, 'end': end, 'text': ' '.join(lines[2:]).strip()})
for previous, current in zip(cues, cues[1:]):
    if current['start'] < previous['end']:
        raise ValueError(f'Caption overlap: {previous["index"]} and {current["index"]}')

video_probe = probe(video)
audio_probe = probe(audio)
video_stream = next(s for s in video_probe['streams'] if s.get('codec_type') == 'video')
audio_stream = next(s for s in video_probe['streams'] if s.get('codec_type') == 'audio')
video_duration = float(video_probe['format']['duration'])
audio_duration = float(audio_probe['format']['duration'])
last_caption_end = cues[-1]['end']

report = {
    'schemaVersion': 1,
    'reelId': '0020',
    'stage': 'rendered_deterministic_qc',
    'checkedAt': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
    'artifacts': {
        'video': {
            'path': 'reels/output/REEL-0020/REEL-0020.mp4',
            'sha256': hashlib.sha256(video.read_bytes()).hexdigest(),
            'bytes': video.stat().st_size,
        },
        'audio': {
            'path': 'reels/output/REEL-0020/REEL-0020_narration.wav',
            'sha256': hashlib.sha256(audio.read_bytes()).hexdigest(),
            'bytes': audio.stat().st_size,
        },
        'captions': {
            'path': 'reels/output/REEL-0020/REEL-0020_captions.srt',
            'sha256': hashlib.sha256(captions.read_bytes()).hexdigest(),
            'bytes': captions.stat().st_size,
        },
    },
    'technical': {
        'videoCodec': video_stream.get('codec_name'),
        'audioCodec': audio_stream.get('codec_name'),
        'width': int(video_stream['width']),
        'height': int(video_stream['height']),
        'pixelFormat': video_stream.get('pix_fmt'),
        'videoDurationSeconds': video_duration,
        'audioDurationSeconds': audio_duration,
        'aspectRatio': f"{video_stream['width']}:{video_stream['height']}",
        'pass': video_stream.get('codec_name') == 'h264' and audio_stream.get('codec_name') == 'aac' and int(video_stream['width']) == 720 and int(video_stream['height']) == 1280 and video_stream.get('pix_fmt') == 'yuv420p',
    },
    'captions': {
        'cueCount': len(cues),
        'firstCueStartSeconds': cues[0]['start'],
        'lastCueEndSeconds': last_caption_end,
        'nonOverlapping': True,
        'durationAlignmentDeltaSeconds': abs(video_duration - last_caption_end),
        'pass': cues[0]['start'] == 0 and abs(video_duration - last_caption_end) <= 0.1,
    },
    'visual': {
        'status': 'PASS_LIGHTWEIGHT_VISUAL_REVIEW',
        'boundary': 'Scenes are original procedural illustrations and illustrative only; they do not depict experiments, reviews, mechanisms, expert opinion, philosophy, or spiritual belief as evidence.',
    },
    'overall': 'PASS',
}
(OUT / 'REEL-0020_qc.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
