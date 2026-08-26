from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import json

root = Path('/home/ubuntu/gpt-oss-drive-ai')
path = root / 'reels' / 'production_state.json'
state = json.loads(path.read_text(encoding='utf-8'))
if state.get('activeReelId') != '0020' or state.get('nextReelId') != '0020':
    raise SystemExit('Refusing lifecycle preparation: active and next reel must both be 0020.')
if '0020' in state.get('completedReelIds', []):
    raise SystemExit('Refusing lifecycle preparation: Reel 0020 is already completed.')
state.setdefault('canonicalMappings', {})['0020'] = {
    'driveFolderId': '1RTlgGnMkFo26nJ6HMAwviBUC9Sdo7jqd',
    'topic': 'नींद, तनाव, या पर्यावरण की भूमिका क्या है?',
    'status': 'drive_upload_recheck_passed_pending_lifecycle_verification',
    'legacyNonCanonicalFolderIds': [
        '1sq84dgyHi91Shx9rlupJcNOyBL_5mmrE',
        '1JJh2gsSy_4CXKXUTLZUgcqPRV5p3ENpo',
    ],
}
state['runStatus'] = 'researching'
state['lastCheckpointAt'] = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
path.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'activeReelId': state['activeReelId'], 'nextReelId': state['nextReelId'], 'canonicalMapping': state['canonicalMappings']['0020'], 'runStatus': state['runStatus']}, ensure_ascii=False, indent=2))
