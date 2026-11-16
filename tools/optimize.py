"""Prépare les images du site.

1. Télécharge les aperçus des vidéos Adobe et des posts Instagram listés dans content.js
   (assets/img/video-<id>.jpg et assets/img/insta-<id>.jpg) s'ils manquent.
2. Crée les miniatures manquantes (assets/img/thumb/, 900 px).
3. Crée (avec ffmpeg) une version AVIF (plus légère) de chaque image et miniature.
4. Régénère assets/manifest.js (dimensions de chaque image).

Usage : python3 tools/optimize.py   (depuis le dossier du site)
"""
import html, json, re, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
IMG = ROOT / "assets/img"
THUMB = IMG / "thumb"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"}
AVIF_CRF = "34"  # qualité AVIF (plus bas = meilleur, plus lourd)


def get(url):
    try:
        return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
    except Exception as e:  # noqa: BLE001
        print("!! échec", url[:90], e)
        return b""


def sips(*args):
    subprocess.run(["sips", *map(str, args)], check=True, capture_output=True)


def dims(p):
    r = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(p)], capture_output=True, text=True, check=True).stdout
    return int(r.split("pixelWidth:")[1].split()[0]), int(r.split("pixelHeight:")[1].split()[0])


def save_jpeg(data, dest):
    dest.write_bytes(data)
    sips("-s", "format", "jpeg", "-s", "formatOptions", "82", "-Z", "1800", dest, "--out", dest)


content = re.sub(r"/\*.*?\*/", "", (ROOT / "content.js").read_text(), flags=re.S)  # sans les commentaires

# 1a. Aperçus des vidéos Adobe
for vid in re.findall(r'id: "([^"]+)", ratio: "\d', content):
    dest = IMG / f"video-{vid}.jpg"
    if dest.exists():
        continue
    page = get(f"https://www-ccv.adobe.io/v1/player/ccv/{vid}/embed?bgcolor=%23121212&lazyLoading=true&api_key=BehancePro2View").decode()
    m = re.search(r'data-poster="([^"]+)"', page)
    data = get(html.unescape(m.group(1))) if m else b""
    if data:
        save_jpeg(data, dest)
        print("poster", vid)
    else:
        print("!! pas d'aperçu pour", vid)

# 1b. Aperçus Instagram
for kind, code in re.findall(r'instagram\.com/(reel|p)/([\w-]+)/', content):
    dest = IMG / f"insta-{code}.jpg"
    if dest.exists():
        continue
    page = get(f"https://www.instagram.com/{kind}/{code}/embed/captioned/").decode()
    m = re.search(r'class="EmbeddedMediaImage"[^>]*src="([^"]+)"', page) or re.search(r'<img[^>]+src="([^"]+)"[^>]*class="EmbeddedMediaImage"', page)
    data = get(html.unescape(m.group(1))) if m else b""
    if data:
        save_jpeg(data, dest)
        print("insta", code)
    else:
        print("!! pas d'aperçu pour", code)

# 2-3. Miniatures et AVIF
THUMB.mkdir(parents=True, exist_ok=True)
manifest = {}
for full in sorted(IMG.glob("*.jpg")):
    thumb = THUMB / full.name
    if not thumb.exists():
        sips("-s", "format", "jpeg", "-s", "formatOptions", "78", "-Z", "900", full, "--out", thumb)
    for src in (full, thumb):
        avif = src.with_suffix(".avif")
        if not avif.exists() or avif.stat().st_mtime < src.stat().st_mtime:
            # ffmpeg (SVT-AV1) produit une image AVIF simple, lisible par tous les navigateurs
            # (l'AVIF de macOS/sips est découpé en tuiles, mal géré par certains).
            subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(src),
                            "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p",
                            "-c:v", "libsvtav1", "-crf", AVIF_CRF, "-preset", "6",
                            "-svtav1-params", "still-picture=1:log-level=0", "-frames:v", "1", str(avif)],
                           check=True, capture_output=True)
    manifest[full.stem] = dims(full)

(ROOT / "assets/manifest.js").write_text("window.MANIFEST = " + json.dumps(manifest, separators=(",", ":")) + ";\n")
print("ok", len(manifest), "images")
