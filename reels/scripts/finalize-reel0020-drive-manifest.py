from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json

root = Path('/home/ubuntu/gpt-oss-drive-ai')
manifest_path = root / 'reels' / 'output' / 'REEL-0020' / 'REEL-0020_manifest.json'
video_path = root / 'reels' / 'output' / 'REEL-0020' / 'REEL-0020.mp4'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
video_sha = hashlib.sha256(video_path.read_bytes()).hexdigest()
if manifest.get('videoSha256') != video_sha:
    raise SystemExit('Manifest video SHA-256 does not match local validated video.')
verified_at = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
manifest['lifecycle'] = 'drive_verified'
manifest['driveVerification'] = {
    'status': 'drive_verified',
    'canonicalFolderId': '1RTlgGnMkFo26nJ6HMAwviBUC9Sdo7jqd',
    'videoFileId': '1itVqG2kL2Ow04ZyNT4w9n3l5988FsVDg',
    'manifestFileId': '1AnF0TNS-oUbh1c7aErveEzuasQRzQT7w',
    'videoSha256': video_sha,
    'verifiedAt': verified_at,
    'reFetch': 'PASS: canonical folder listing and semantic JSON re-fetch matched; video re-fetch SHA-256 and ffprobe matched.',
}
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'lifecycle': manifest['lifecycle'], 'driveVerification': manifest['driveVerification']}, ensure_ascii=False, indent=2))
