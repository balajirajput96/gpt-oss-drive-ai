from __future__ import annotations

from pathlib import Path
import hashlib
import json

ROOT = Path('/home/ubuntu/gpt-oss-drive-ai')
LOCAL = ROOT / 'reels' / 'output' / 'REEL-0020'
REMOTE = Path('/home/ubuntu/reel0020-drive-refetch-updated')


def load(path: Path):
    return json.loads(path.read_text(encoding='utf-8'))

local_manifest = load(LOCAL / 'REEL-0020_manifest.json')
remote_manifest = load(REMOTE / 'REEL-0020_manifest.json')
local_audio = load(LOCAL / 'REEL-0020_audio_provenance.json')
remote_audio = load(REMOTE / 'REEL-0020_audio_provenance.json')

if local_manifest != remote_manifest:
    raise SystemExit('Manifest semantic content mismatch after Drive re-fetch.')
if local_audio != remote_audio:
    raise SystemExit('Audio provenance semantic content mismatch after Drive re-fetch.')
if remote_manifest['canonicalFolderIdPlanned'] != '1RTlgGnMkFo26nJ6HMAwviBUC9Sdo7jqd':
    raise SystemExit('Re-fetched manifest points to the wrong canonical folder.')
if remote_manifest['videoSha256'] != hashlib.sha256((LOCAL / 'REEL-0020.mp4').read_bytes()).hexdigest():
    raise SystemExit('Re-fetched manifest video SHA-256 does not match local video.')
if remote_manifest['videoTechnical']['audioCodec'] != 'aac':
    raise SystemExit('Re-fetched manifest does not record AAC video audio.')
if remote_manifest['qc']['overall'] != 'PASS':
    raise SystemExit('Re-fetched manifest QC is not passing.')
print(json.dumps({
    'manifestSemanticMatch': True,
    'audioProvenanceSemanticMatch': True,
    'canonicalFolderId': remote_manifest['canonicalFolderIdPlanned'],
    'videoSha256': remote_manifest['videoSha256'],
    'videoAudioCodec': remote_manifest['videoTechnical']['audioCodec'],
    'qc': remote_manifest['qc']['overall'],
}, indent=2))
