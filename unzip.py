import zipfile
import os

os.makedirs('/workspace/agent-files', exist_ok=True)
with zipfile.ZipFile('/workspace/agent-files-a.zip', 'r') as z:\n    z.extractall('/workspace/agent-files')\n    names = z.namelist()\n    print(f'Extracted {len(names)} files')\n    for f in names[:40]:
        print(f'  {f}')
    if len(names) > 40:
        print(f'  ... and {len(names)-40} more')
