import { readFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

/** Hide leftover Framer marketplace chrome + non-header Start for free CTAs. */
const PRODUCTION_HIDE_STYLE = `<style id="drx-production-hide">
#__framer-badge-container,
.framer-x1unk3-container,
.framer-16pq425-container,
[data-framer-name="Footer Bottom"],
[data-framer-name="Bottom CTA Card"],
[data-framer-name="Bottom Lines"],
[data-framer-name="Big Logo"],
[data-framer-name="Dropdown Wrap"],
[data-framer-name="Right Icon Wrap"],
[data-framer-name="CTA Wrapper"] a[data-framer-name=Primary],
[data-framer-name="CTA Wrapper"] a[data-framer-name="Primary"],
a[data-framer-name=Primary][hidden],
a[data-framer-name="Primary"][hidden],
button[hidden],
[data-framer-name="Social Wrapper"] a[href*="discord"],
[data-framer-name="Social Wrapper"] a[href*="github"]{display:none!important;visibility:hidden!important;pointer-events:none!important}
[data-framer-name="Footer Logo"] img{object-position:left center!important}
[data-framer-name="Social Wrapper"] a,
[data-framer-name="Social Wrapper"] div[data-framer-name=Desktop]{pointer-events:none!important;cursor:default!important}
</style>`

/**
 * Framer export ships ticker tracks at translateX(0) with empty runtime scripts,
 * so company + integration logo rows never animate. Drive them with CSS instead.
 */
const MARQUEE_STYLE = `<style id="drx-logo-marquee">
@keyframes drx-marquee-rtl{
  from{transform:translateX(0)}
  to{transform:translateX(-50%)}
}
section[style*="mask-image"]>ul.drx-marquee-track{
  width:max-content!important;
  max-width:none!important;
  will-change:transform;
  animation:drx-marquee-rtl 65s linear infinite;
}
section[style*="mask-image"]>ul.drx-marquee-track[data-drx-gap="tight"]{
  animation-duration:55s;
}
@media (prefers-reduced-motion:reduce){
  section[style*="mask-image"]>ul.drx-marquee-track{animation:none!important;transform:none!important}
}
</style>`

const MARQUEE_SCRIPT = `<script id="drx-logo-marquee-script">
(function(){
  function armMarquee(ul){
    if(!ul||ul.dataset.drxMarquee==="1")return;
    ul.dataset.drxMarquee="1";
    var kids=Array.prototype.slice.call(ul.children);
    if(!kids.length)return;
    for(var i=0;i<kids.length;i++){
      ul.appendChild(kids[i].cloneNode(true));
    }
    if((ul.getAttribute("style")||"").indexOf("gap:20px")!==-1){
      ul.setAttribute("data-drx-gap","tight");
    }
    ul.classList.add("drx-marquee-track");
  }
  function run(){
    var sections=document.querySelectorAll('section[style*="mask-image"]');
    for(var s=0;s<sections.length;s++){
      var ul=sections[s].querySelector(":scope > ul");
      if(ul)armMarquee(ul);
    }
    // Fallback: any ticker ul frozen at translateX(0px)
    var uls=document.querySelectorAll('ul[style*="translateX(0px)"]');
    for(var u=0;u<uls.length;u++)armMarquee(uls[u]);
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",run);
  }else{
    run();
  }
})();
</script>`

export async function GET() {
  const raw = await readFile(
    path.join(process.cwd(), "references", "template.html"),
    "utf8"
  )
  let html = raw.includes("</head>")
    ? raw.replace("</head>", `${PRODUCTION_HIDE_STYLE}${MARQUEE_STYLE}</head>`)
    : `${PRODUCTION_HIDE_STYLE}${MARQUEE_STYLE}${raw}`

  if (html.includes("</body>")) {
    html = html.replace("</body>", `${MARQUEE_SCRIPT}</body>`)
  } else if (html.includes("</html>")) {
    html = html.replace("</html>", `${MARQUEE_SCRIPT}</html>`)
  } else {
    html = `${html}${MARQUEE_SCRIPT}`
  }

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}
