from pathlib import Path
import re

html = Path(__file__).with_name("template.html").read_text(encoding="utf-8", errors="ignore")

# CTA Wrapper block
i = html.find('data-framer-name="CTA Wrapper"')
print("CTA Wrapper at", i)
# extract ~2500 chars and list names + button labels
snip = html[i : i + 5000]
names = [(m.group(2) or m.group(3)) for m in re.finditer(r'data-framer-name=("([^"]+)"|([^\s>]+))', snip)]
print("names:", names[:30])
texts = re.findall(r"<p class=\"framer-text[^\"]*\"[^>]*>([^<]{2,60})</p>", snip)
print("texts:", texts[:15])

# Logos Wrapper / Trusted relationship
for name in ["CTA Wrapper", "Logos Wrapper", "Trusted by text", "Hero Bottom", "Content Wrapper"]:
    print(name, html.count(f'data-framer-name="{name}"'), html.count(f"data-framer-name={name}"))

# Find opening tag style of CTA Wrapper
start = html.rfind("<", 0, i)
j = i
in_q = None
while j < len(html):
    ch = html[j]
    if in_q:
        if ch == in_q: in_q = None
    else:
        if ch in "\"'": in_q = ch
        elif ch == ">": break
    j += 1
print("CTA tag:", html[start:j+1][:300])

# Secondary / Primary inside CTA
for m in re.finditer(r'data-framer-name=("Primary"|Primary|"Secondary"|Secondary|"Book a Demo link")', snip):
    pos = m.start()
    chunk = snip[pos:pos+600]
    labels = re.findall(r">([^<]{3,40})<", chunk)
    href = re.search(r'\bhref=([^\s>]+)', snip[max(0,pos-200):pos+100])
    print(m.group(0), "labels", [x for x in labels if x.strip()][:4], "href", href.group(1) if href else None)

# Where is CTA relative to Trusted
t = html.find("Trusted by Security Operations Teams")
print("CTA before Trusted?", i < t, "delta", t - i)
