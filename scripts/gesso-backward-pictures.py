"""Makes the pictures and data for the Gesso post "One painting, erased backward" (part 11, gesso-backward).

    python3 scripts/gesso-backward-pictures.py <path to the Gesso repo>

It reads one POC v3 lesson folder and one POC v2 lesson folder of the same photo from the Gesso repo's output/, and
writes public/img/gesso/backward/, src/data/gesso/backward.json and public/img/og/gesso-backward.jpg here.
Needs Python with numpy, opencv-python and Pillow, and the Inter fonts.

Made for the sleeping cat. To use it for another lesson, change the names under "This lesson" below, and read
the notes there first: a few things are picked by hand.
"""
import json, sys
from pathlib import Path
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

# ---- This lesson. Everything picked by hand is here.
V3_LESSON = "sleeping-cat_skill_20261118-080533"   # the POC v3 lesson folder, under the Gesso repo's output/
V2_LESSON = "sleeping-cat_skill_20261116-191623"   # the POC v2 lesson of the same photo, for the compare slider
V2_STEP, V3_STEP = "10_blanket-light.png", "12_light-blanket.png"   # the same moment in each lesson
GUARD_UNIT = 9                                     # the erase the guard panels show (the cat's first coat)
TRIES = {2: 3, 10: 2}                              # erases that took more than one try (chain/tries.json)
OG_CARDS = ["chain/P01.png", "chain/P06.png", "chain/P07.png", "99_finish.png"]   # back to front on the link preview

if len(sys.argv) != 2: sys.exit(__doc__)
R = Path(sys.argv[1]).resolve(); L = R / "output" / V3_LESSON; V2 = R / "output" / V2_LESSON
B = Path(__file__).resolve().parent.parent; OUT = B / "public/img/gesso/backward"; WEB = "/img/gesso/backward/"
OUT.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(R / "spike")); import erase3
chain = json.loads((L / "chain/chain.json").read_text()); US = chain["units"]; NU = len(US)
plan = json.loads((L / "plan.json").read_text()); text = json.loads((L / "text.json").read_text()); build = json.loads((L / "v3/build.json").read_text()); mixes = json.loads((L / "mixes.json").read_text())
STEPS = [s for st in plan["stages"] for s in st["steps"]]
def save(a, name, w=900, q=82):
    a = a if isinstance(a, Image.Image) else Image.fromarray(a)
    a = a.convert("RGB"); a = a.resize((w, round(w * a.height / a.width)), Image.LANCZOS); a.save(OUT / name, "WEBP", quality=q, method=6); return WEB + name
def low(s): return s[0].lower() + s[1:] if s.startswith("The ") else s
back = [{"src": save(Image.open(L / "99_finish.png"), "chain-00.webp"), "label": "The finished painting", "tip": "Rendered once. Every step ends on this picture."}]
for k, u in enumerate(range(NU - 1, 0, -1), 1):
    r = next(x for x in chain["rows"] if x["unit"] == u); n = TRIES.get(u, 1)
    tip = f"The picture changed over {r['erased_share'] * 100:.0f}% of the canvas." + (f" It took {n} tries." if n > 1 else "")
    back.append({"src": save(Image.open(L / f"chain/P{u - 1:02d}.png"), f"chain-{k:02d}.webp"), "label": "Erased: " + low(US[u]["name"]), "tip": tip})
bare = Image.new("RGB", (1536, 1024), (250, 249, 245))
back.append({"src": save(bare, "chain-14.webp"), "label": "Erased: the sky. Bare canvas.", "tip": "The sky is the first thing painted, so it's the last to go."})
fwd = [{"src": WEB + "chain-14.webp", "label": "Bare canvas"}]
for j, f in enumerate(build["steps"]):
    sp = STEPS[j]
    fwd.append({"src": save(Image.open(L / f), f"step-{j + 1:02d}.webp"), "label": sp["name"], "tip": text["steps"][j]["summary"],
                "colors": [{"name": p, "hex": mixes[p]["mixed_hex"], "recipe": mixes[p]["text"]} for p in sp["paints"]]})
data = {"width": 900, "height": 600, "back": back, "fwd": fwd,
        "v2": save(Image.open(V2 / V2_STEP), "cmp-v2.webp"), "v3": save(Image.open(L / V3_STEP), "cmp-v3.webp")}
# the guard, on the picture that removes the cat's first coat
u = GUARD_UNIT; im = lambda p: np.array(Image.open(p).convert("RGB")); src = im(L / f"chain/P{u:02d}.png"); raw = im(L / f"chain/U{u:02d}_raw.png"); out = im(L / f"chain/P{u - 1:02d}.png")
def lab(a): return cv2.cvtColor(cv2.GaussianBlur(a, (0, 0), erase3.BLUR).astype(np.float32) / 255, cv2.COLOR_RGB2LAB)
de = np.sqrt(((lab(src) - lab(raw)) ** 2).sum(2)); heat = cv2.cvtColor(cv2.applyColorMap((np.clip(de / 40, 0, 1) * 255).astype(np.uint8), cv2.COLORMAP_INFERNO), cv2.COLOR_BGR2RGB)
m = erase3.changed(src, raw); thr = np.full(src.shape, 236, np.uint8); thr[de >= erase3.WEAK] = (255, 196, 110); thr[de >= erase3.STRONG] = (196, 52, 30)
weak = (de >= erase3.WEAK).astype(np.uint8); n, labs = cv2.connectedComponents(weak, connectivity=8); keep = np.zeros(n, bool); keep[np.unique(labs[de >= erase3.STRONG])] = True; keep[0] = False
thr[(weak > 0) & ~keep[labs]] = (150, 158, 172)
kept = (src * .28 + 255 * .72).astype(np.uint8); kept[m] = raw[m]; cs, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE); cv2.drawContours(kept, cs, -1, (30, 140, 90), 7)
assert not ((out != src).any(2) & ~np.array(Image.open(L / f"chain/D{u:02d}.png")).astype(bool)).any()
data["guard"] = [
    {"src": save(src, "guard-1.webp", 640), "caption": "<b>1. The picture given.</b> The cat is one flat gray coat."},
    {"src": save(raw, "guard-2.webp", 640), "caption": "<b>2. The model's answer.</b> A whole new picture."},
    {"src": save(heat, "guard-3.webp", 640), "caption": "<b>3. How far each pixel moved</b> in color. Brighter is farther."},
    {"src": save(thr, "guard-4.webp", 640), "caption": f"<b>4. Two thresholds.</b> Red moved {erase3.STRONG:.0f} or more. Orange moved {erase3.WEAK:.0f} or more and touches red."},
    {"src": save(kept, "guard-5.webp", 640), "caption": f"<b>5. What's kept.</b> {m.mean() * 100:.0f}% of the canvas, taken from the answer."},
    {"src": save(out, "guard-6.webp", 640), "caption": "<b>6. The result.</b> Every other pixel is copied from picture 1."}]
# the paints, as one picture on the site's dark card
def F(size, w="SemiBold"): return ImageFont.truetype(f"/usr/share/fonts/opentype/inter/Inter-{w}.otf", size)
TUBE = {"Titanium white": (245, 243, 235), "Cadmium yellow medium (hue)": (252, 200, 22), "Cadmium red medium (hue)": (214, 44, 38), "Ultramarine blue": (40, 52, 150), "Burnt sienna": (124, 62, 36)}
names = [p["name"] for p in plan["paints"]]; W = 1800; cols = 2; cw = (W - 120 - 60) // cols; rh = 150; rows = -(-len(names) // cols); H = 130 + rows * rh
BG = (255, 255, 255); INK = (22, 26, 38); MUTE = (98, 106, 124); EDGE = (190, 196, 208)
c = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(c); x = 60
for tn, tc in TUBE.items():
    d.rounded_rectangle((x, 44, x + 50, 88), 8, fill=tc, outline=EDGE, width=2); lab_ = tn.replace(" medium (hue)", "").replace("Cadmium", "Cad."); d.text((x + 64, 50), lab_, font=F(28), fill=INK); x += 64 + d.textlength(lab_, font=F(28)) + 46
for i, nm in enumerate(names):
    x = 60 + (i % cols) * (cw + 60); y = 130 + (i // cols) * rh; mx = mixes[nm]; col = tuple(int(mx["mixed_hex"][k:k + 2], 16) for k in (1, 3, 5))
    d.rounded_rectangle((x, y, x + 116, y + 116), 12, fill=col, outline=EDGE, width=2); d.text((x + 140, y - 4), nm, font=F(34, "Bold"), fill=INK); tot = sum(mx["parts"].values()); bx = x + 140; bw = cw - 140
    for tn, pv in sorted(mx["parts"].items(), key=lambda kv: -kv[1]):
        w_ = bw * pv / tot; d.rectangle((bx, y + 46, bx + w_ - 3, y + 78), fill=TUBE[tn]); bx += w_
    t = mx["text"]
    while d.textlength(t, font=F(24, "Regular")) > bw - 20: t = t[:-1]
    d.text((x + 140, y + 88), t.rstrip(" ,") + ("" if t == mx["text"] else "..."), font=F(24, "Regular"), fill=MUTE)
data["paints"] = save(c, "paints.webp", 1800, 88); data["paintsSize"] = [W, H]
(B / "src/data/gesso/backward.json").write_text(json.dumps(data, indent=1) + "\n")
# the link preview, in the series' look
W, H = 1200, 630; c = Image.new("RGB", (W, H), (22, 27, 42)); yy, xx = np.mgrid[0:H, 0:W]
g = np.array(c).astype(np.float32) + (np.exp(-(((xx - 880) / 520) ** 2 + ((yy - 300) / 380) ** 2))[..., None] * np.array((10, 14, 24)))
c = Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)).convert("RGBA")
for k, (p, dx, dy) in enumerate([(L / p_, 50 * (len(OG_CARDS) - 1 - k_), int(-37.4 * (len(OG_CARDS) - 1 - k_))) for k_, p_ in enumerate(OG_CARDS)]):
    a = Image.open(p).convert("RGBA").resize((450, 300), Image.LANCZOS); card = Image.new("RGBA", (462, 312), (250, 249, 245, 255)); card.paste(a, (6, 6))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle((600 + dx + 10, 250 + dy + 14, 600 + dx + 472, 250 + dy + 326), fill=(0, 0, 0, 90)); c.alpha_composite(sh); c.alpha_composite(card, (600 + dx, 250 + dy))
d = ImageDraw.Draw(c); d.text((66, 196), "One painting,", font=F(64, "Bold"), fill=(246, 244, 238)); d.text((66, 274), "erased", font=F(64, "Bold"), fill=(94, 220, 196)); d.text((66, 352), "backward", font=F(64, "Bold"), fill=(94, 220, 196))
d.text((66, 540), "Gesso, part 11 · deanphillips.dev", font=F(24, "Regular"), fill=(150, 158, 176))
c.convert("RGB").save(B / "public/img/og/gesso-backward.jpg", quality=90)
print(len(back), len(fwd), sum(f.stat().st_size for f in OUT.iterdir()) // 1024, "KB")
