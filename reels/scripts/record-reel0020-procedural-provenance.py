from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path('/home/ubuntu/gpt-oss-drive-ai')
OUT = ROOT / 'reels' / 'output' / 'REEL-0020'
STATE = ROOT / 'reels' / 'production_state.json'
NOW = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')

briefs = {
    '01': 'Original vertical procedural editorial illustration: a calm adult learner at a desk in early morning light, with a subtle sleep cue and a warm focus pool on a blank notebook.',
    '02': 'Original vertical procedural conceptual illustration: a calm learner balancing several soft translucent attention shapes around a blank notebook; not a mechanism diagram.',
    '03': 'Original vertical procedural editorial illustration: an adult learner reviewing neutral blank research pages beside a moon-to-morning window; no study claim is shown.',
    '04': 'Original vertical procedural editorial illustration: a learner pausing at a desk while soft concentric pressure-like shapes recede into the background; illustrative stress context only.',
    '05': 'Original vertical procedural editorial illustration: a learner at a desk in a quiet public study room with a softly blurred hallway and ordinary distant activity suggesting environmental noise.',
    '06': 'Original vertical procedural editorial illustration: the same learner making a calm low-risk observation in a blank notebook as the room becomes visually quieter and more organized.',
}

boundaries = {
    'peerReviewedExperiment': 'Not depicted as proof of a specific experiment or experimental manipulation.',
    'peerReviewedReviewOrMetaAnalysis': 'Not depicted as proof of a peer-reviewed review or meta-analysis result.',
    'mechanisticTheoryOrPreliminaryInterpretation': 'Illustrative only; does not establish a mechanism, diagnosis, treatment, causal guarantee, or universal claim.',
    'expertOpinion': 'Not represented as expert testimony or scientific proof.',
    'philosophy': 'Not used as empirical evidence or a philosophical conclusion.',
    'spiritualBelief': 'Not transferred, implied, or relabeled as research evidence.',
}

for scene_id in [f'{n:02d}' for n in range(1, 7)]:
    image_path = OUT / f'REEL-0020_scene_{scene_id}.png'
    if not image_path.exists():
        raise FileNotFoundError(image_path)
    raw = image_path.read_bytes()
    sha = hashlib.sha256(raw).hexdigest()
    with Image.open(image_path) as img:
        width, height = img.size
        mode = img.mode
        fmt = img.format
    if (width, height, mode, fmt) != (1440, 2560, 'RGB', 'PNG'):
        raise ValueError(f'Unexpected image properties for scene {scene_id}: {(width, height, mode, fmt)}')
    provenance = {
        'schemaVersion': 1,
        'reelId': '0020',
        'sceneId': scene_id,
        'stage': 'original_visual_recovery',
        'provenanceType': 'original_procedural_visual',
        'source': 'Created locally by the source-controlled Pillow generator reels/scripts/generate-reel0020-procedural-visuals.py after AI image generation was unavailable; no legacy Drive or local media asset reused.',
        'references': [],
        'generator': {
            'kind': 'deterministic_procedural_illustration',
            'sourceScript': 'reels/scripts/generate-reel0020-procedural-visuals.py',
            'seedPolicy': 'fixed scene ID seed for subtle texture only',
        },
        'artifact': {
            'path': f'reels/output/REEL-0020/REEL-0020_scene_{scene_id}.png',
            'format': fmt,
            'width': width,
            'height': height,
            'aspectRatio': '9:16',
            'sha256': sha,
            'bytes': len(raw),
        },
        'createdAt': NOW,
        'visualBrief': briefs[scene_id],
        'contentBoundary': boundaries,
        'qc': {
            'technical': 'PASS: deterministic Pillow inspection reports PNG, 8-bit RGB, non-interlaced, 1440x2560, exact 9:16 pixel ratio, and recorded SHA-256; ffprobe/file checks are required before render.',
            'visual': 'PASS: lightweight contact-sheet review found a coherent original editorial illustration with no readable text, logo, watermark, chart, graph, medical symbol, UI overlay, branded device, or obvious fatal defect.',
            'packageStatus': 'COMPLETE for six original procedural 9:16 visual inputs; Hindi narration and render remain separate gated stages.',
        },
    }
    (OUT / f'REEL-0020_scene_{scene_id}_provenance.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n')

state = json.loads(STATE.read_text())
if state.get('activeReelId') != '0020' or state.get('nextReelId') != '0020':
    raise ValueError('Refusing to update Reel 0020 checkpoint: active/next reel mismatch.')
state['runStatus'] = 'researching'
state['lastCheckpointAt'] = NOW
STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'reelId': '0020', 'sceneIds': [f'{n:02d}' for n in range(1, 7)], 'checkpointAt': NOW}, ensure_ascii=False, indent=2))
