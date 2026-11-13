"""Download portfolio images from the old Adobe Portfolio CDN and resize them.

Writes:
  assets/img/<name>.jpg        (max 1800px, for full view / lightbox)
  assets/img/thumb/<name>.jpg  (max 900px, for grids)
and assets/manifest.json with width/height of every image.
"""
import json, subprocess, sys, urllib.request
from pathlib import Path

root = Path(sys.argv[1])
src = json.loads((root / "tools/sources.json").read_text())
prefix = src["prefix"]
out = root / "assets/img"
thumbs = out / "thumb"
thumbs.mkdir(parents=True, exist_ok=True)

jobs = []
for k, v in src["covers"].items():
    jobs.append((f"cover-{k}", v))
for i, v in enumerate(src["inside"], 1):
    jobs.append((f"inside-{i:02d}", v))
for s, group in enumerate(src["photo"], 1):
    for i, v in enumerate(group, 1):
        jobs.append((f"photo-{s}-{i:02d}", v))

def run(*a):
    subprocess.run(a, check=True, capture_output=True)

def dims(p):
    r = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(p)],
                       capture_output=True, text=True, check=True).stdout
    w = int(r.split("pixelWidth:")[1].split()[0]); h = int(r.split("pixelHeight:")[1].split()[0])
    return w, h

manifest = {}
for name, path in jobs:
    full = out / f"{name}.jpg"
    if not full.exists():
        req = urllib.request.Request(prefix + path, headers={"User-Agent": "Mozilla/5.0"})
        full.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        run("sips", "-s", "format", "jpeg", "-s", "formatOptions", "82", "-Z", "1800", str(full), "--out", str(full))
    th = thumbs / f"{name}.jpg"
    if not th.exists():
        run("sips", "-s", "format", "jpeg", "-s", "formatOptions", "78", "-Z", "900", str(full), "--out", str(th))
    manifest[name] = dims(full)
    print(name, manifest[name], flush=True)

(root / "assets/manifest.json").write_text(json.dumps(manifest, indent=0))
print("done", len(manifest))
