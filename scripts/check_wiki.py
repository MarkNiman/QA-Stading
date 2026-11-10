"""Validate Obsidian note targets and headings without community plugins."""
from pathlib import Path
from collections import defaultdict
import re

root = Path(__file__).resolve().parents[1]
notes = defaultdict(list)
for path in root.rglob('*.md'):
    if '.git' not in path.parts:
        notes[path.stem].append(path)
errors = []
links = anchors = 0
for group in notes.values():
    for path in group:
        for raw in re.findall(r'\[\[([^\]]+)\]\]', path.read_text()):
            target = raw.split('|')[0]
            parts = target.split('#', 1)
            name = parts[0]
            links += 1
            destinations = notes.get(name, []) if name else [path]
            if len(destinations) != 1:
                errors.append((str(path.relative_to(root)), target, 'missing or ambiguous note'))
                continue
            if len(parts) > 1:
                anchors += 1
                headings = re.findall(r'^#+\s+(.+)$', destinations[0].read_text(), re.M)
                if parts[1] not in [h.strip() for h in headings]:
                    errors.append((str(path.relative_to(root)), target, 'missing heading'))
print(f'{links} wiki links; {anchors} heading links; {len(errors)} errors')
for error in errors:
    print(error)
raise SystemExit(bool(errors))
