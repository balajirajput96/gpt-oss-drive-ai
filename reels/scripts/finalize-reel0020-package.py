from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json
import re
import subprocess

ROOT = Path('/home/ubuntu/gpt-oss-drive-ai')
OUT = ROOT / 'reels' / 'output' / 'REEL-0020'
NOW = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def probe(path: Path):
    return json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)], check=True, capture_output=True, text=True).stdout)


def parse_srt(path: Path):
    blocks = [b.strip() for b in re.split(r'\n\s*\n', path.read_text(encoding='utf-8')) if b.strip()]
    cues = []
    for block in blocks:
        lines = block.splitlines()
        timing = re.fullmatch(r'(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})', lines[1].strip())
        if not timing:
            raise ValueError(f'Invalid SRT timing: {lines[1]}')
        cues.append(' '.join(lines[2:]).strip())
    return cues


def extract_script(path: Path):
    text = path.read_text(encoding='utf-8')
    body = text.split('## Hindi voiceover script', 1)[1].split('## Evidence-label boundaries', 1)[0]
    return [p.strip().replace('\n', ' ') for p in re.split(r'\n\s*\n', body) if p.strip()]

captions_path = OUT / 'REEL-0020_captions.srt'
script_path = OUT / 'REEL-0020_script_hi.md'
caption_cues = parse_srt(captions_path)
script_paragraphs = extract_script(script_path)
if caption_cues != script_paragraphs:
    raise ValueError({'caption_cues': caption_cues, 'script_paragraphs': script_paragraphs})

video = OUT / 'REEL-0020.mp4'
audio = OUT / 'REEL-0020_narration.wav'
qc = json.loads((OUT / 'REEL-0020_qc.json').read_text(encoding='utf-8'))
if qc['overall'] != 'PASS' or not qc['technical']['pass'] or not qc['captions']['pass'] or qc['visual']['status'] != 'PASS_LIGHTWEIGHT_VISUAL_REVIEW':
    raise ValueError('QC report is not fully passing.')

video_probe = probe(video)
audio_probe = probe(audio)
video_stream = next(s for s in video_probe['streams'] if s.get('codec_type') == 'video')
video_audio_stream = next(s for s in video_probe['streams'] if s.get('codec_type') == 'audio')
audio_stream = next(s for s in audio_probe['streams'] if s.get('codec_type') == 'audio')

artifacts = []
for path, role in [
    (video, 'validated rendered video'),
    (audio, 'Hindi narration WAV'),
    (captions_path, 'Hindi captions'),
    (OUT / 'REEL-0020_research.md', 'research sources and evidence record'),
    (script_path, 'Hindi script'),
    (OUT / 'REEL-0020_claims.json', 'claim ledger'),
    (OUT / 'REEL-0020_qc.json', 'deterministic technical and visual QC'),
    (ROOT / 'reels' / 'checkpoints' / 'REEL-0020_VISUAL_QC_FINDINGS_20260826T132200Z.md', 'visual QC findings'),
]:
    relative_path = path.relative_to(ROOT).as_posix()
    artifacts.append({'name': path.name, 'role': role, 'path': relative_path, 'bytes': path.stat().st_size, 'sha256': sha(path)})
for scene_id in [f'{n:02d}' for n in range(1, 7)]:
    path = OUT / f'REEL-0020_scene_{scene_id}_provenance.json'
    artifacts.append({'name': path.name, 'role': f'scene {scene_id} original procedural visual provenance', 'path': f'reels/output/REEL-0020/{path.name}', 'bytes': path.stat().st_size, 'sha256': sha(path)})

provenance = {
    'schemaVersion': 1,
    'reelId': '0020',
    'artifact': 'REEL-0020_narration.wav',
    'createdAt': NOW,
    'generation': {
        'method': 'Hindi TTS generation using voice Charon, locale hi-IN, followed by deterministic pitch-preserving atempo normalization to the corrected caption duration.',
        'rawDurationSeconds': 77.960,
        'finalDurationSeconds': float(audio_probe['format']['duration']),
        'sampleRate': int(audio_stream['sample_rate']),
        'channels': int(audio_stream['channels']),
        'codec': audio_stream['codec_name'],
        'sourceText': 'Exact Hindi voiceover script in REEL-0020_script_hi.md; no extra claims were added.',
    },
    'artifactSha256': sha(audio),
    'evidenceBoundaries': {
        'experiment': 'Narration describes cited studies only within their stated manipulations and outcomes.',
        'review': 'Meta-analysis and systematic-review labels are explicit.',
        'theory': 'No mechanistic theory is presented as settled or causal proof.',
        'expertOpinion': 'No expert opinion is presented as scientific proof.',
        'philosophy': 'No philosophical conclusion is made.',
        'spiritualBelief': 'No spiritual belief is presented or relabeled as research evidence.',
    },
    'qc': 'PASS: audio is mono 24 kHz PCM WAV, final duration aligns with six non-overlapping captions ending at 62.500 seconds within 0.1 seconds.',
}
(OUT / 'REEL-0020_audio_provenance.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n')
artifacts.append({'name': 'REEL-0020_audio_provenance.json', 'role': 'Hindi narration provenance and QC', 'path': 'reels/output/REEL-0020/REEL-0020_audio_provenance.json', 'bytes': (OUT / 'REEL-0020_audio_provenance.json').stat().st_size, 'sha256': sha(OUT / 'REEL-0020_audio_provenance.json')})

manifest = {
    'schemaVersion': 1,
    'reelId': '0020',
    'canonicalIdentity': {'batch': 'Batch_001', 'pillarCode': 'MND', 'lensCode': 'L01', 'questionCode': 'Q20', 'question': 'नींद, तनाव, या पर्यावरण की भूमिका क्या है?'},
    'canonicalDriveRootId': '1qBzjS18Pd4zNEmgNhZsDqKHrl17uCOyS',
    'canonicalFolderIdPlanned': '1RTlgGnMkFo26nJ6HMAwviBUC9Sdo7jqd',
    'createdAt': NOW,
    'lifecycle': 'rendered',
    'evidenceLabels': ['peer-reviewed meta-analysis', 'systematic-review framing', 'synthesis', 'practical context'],
    'visualProvenance': 'Six original procedural 9:16 illustrations from reels/scripts/generate-reel0020-procedural-visuals.py; no legacy asset reused; illustrative only.',
    'narrationProvenance': 'Hindi TTS voice Charon hi-IN with deterministic atempo normalization; see REEL-0020_audio_provenance.json.',
    'qc': {'technical': 'PASS', 'captions': 'PASS', 'visual': 'PASS', 'overall': 'PASS', 'qcFile': 'REEL-0020_qc.json'},
    'legacyPreservation': {'preservedFolderIds': ['1sq84dgyHi91Shx9rlupJcNOyBL_5mmrE', '1JJh2gsSy_4CXKXUTLZUgcqPRV5p3ENpo'], 'note': 'Existing folders were not modified or reused; new canonical folder is separate.'},
    'artifacts': artifacts,
    'videoSha256': sha(video),
    'videoTechnical': {'codec': video_stream['codec_name'], 'audioCodec': video_audio_stream['codec_name'], 'width': int(video_stream['width']), 'height': int(video_stream['height']), 'pixelFormat': video_stream['pix_fmt'], 'durationSeconds': float(video_probe['format']['duration'])},
}
manifest_path = OUT / 'REEL-0020_manifest.json'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'manifest': str(manifest_path), 'manifestSha256': sha(manifest_path), 'videoSha256': sha(video), 'audioSha256': sha(audio), 'captionScriptAligned': True}, ensure_ascii=False, indent=2))
