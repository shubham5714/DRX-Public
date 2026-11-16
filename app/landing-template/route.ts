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
[data-framer-name="CTA Wrapper"],
[data-framer-name="CTA Wrapper"] a[data-framer-name=Primary],
[data-framer-name="CTA Wrapper"] a[data-framer-name="Primary"],
[data-framer-name="CTA Wrapper"] a[data-framer-name=Secondary],
[data-framer-name="CTA Wrapper"] a[data-framer-name="Secondary"],
a[data-framer-name=Primary][hidden],
a[data-framer-name="Primary"][hidden],
button[hidden],
[data-framer-name="Social Wrapper"] a[href*="discord"],
[data-framer-name="Social Wrapper"] a[href*="github"],
[data-framer-name="Section Pricing"],
#pricing{display:none!important;visibility:hidden!important;pointer-events:none!important}
[data-framer-name="Footer Logo"]{
  width:119px!important;
  height:30px!important;
}
[data-framer-name="Footer Logo"] img{
  width:100%!important;
  height:100%!important;
  object-fit:contain!important;
  object-position:left center!important;
}
[data-framer-name="Section Integrations"] [data-framer-name="Intergration Icon"] img,
[data-framer-name="Section Integrations"] li img{
  object-fit:contain!important;
  object-position:center!important;
}
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

/**
 * Framer appear-on-scroll never runs (empty runtime scripts).
 * - Hero + key section titles: word-by-word text reveal
 * - Benefits tabs: fade subtext + right visual on click
 */
const APPEAR_STYLE = `<style id="drx-scroll-appear">
.drx-reveal-word{
  display:inline-block;
  opacity:0;
  filter:blur(10px);
  transform:translate3d(0,0.55em,0);
  transition:opacity .7s cubic-bezier(.22,1,.36,1),filter .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);
  will-change:opacity,filter,transform;
}
.drx-reveal-word.drx-reveal-word-in{
  opacity:1;
  filter:blur(0);
  transform:none;
}
.drx-reveal-line{
  opacity:0;
  filter:blur(8px);
  transform:translate3d(0,14px,0);
  transition:opacity .75s cubic-bezier(.22,1,.36,1),filter .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1);
}
.drx-reveal-line.drx-reveal-line-in{
  opacity:1;
  filter:blur(0);
  transform:none;
}
/* Benefits tabs: hide inactive copy; fade active copy/visuals */
.drx-benefit-desc{
  transition:opacity .45s ease!important;
  position:relative!important;
  top:auto!important;
  left:auto!important;
  width:100%!important;
  transform:none!important;
}
.drx-benefit-desc.is-off{
  opacity:0!important;
  visibility:hidden!important;
  pointer-events:none!important;
}
.drx-benefit-desc.is-on{
  opacity:1!important;
  visibility:visible!important;
}
[data-framer-name="Section Benefits"] [data-framer-name="Visual Wrapper"],
[data-framer-name="Section Benefits"] [data-framer-name="Benefit Tab Right"]{
  position:relative!important;
}
.drx-benefit-visual{
  transition:opacity .5s ease!important;
  position:absolute!important;
  inset:0!important;
  width:100%!important;
  height:100%!important;
}
.drx-benefit-visual.is-off{
  opacity:0!important;
  visibility:hidden!important;
  pointer-events:none!important;
  z-index:1!important;
}
.drx-benefit-visual.is-on{
  opacity:1!important;
  visibility:visible!important;
  pointer-events:auto!important;
  z-index:2!important;
}
[data-framer-name="Section Benefits"] [data-framer-name="Desktop - Tab Link Active"],
[data-framer-name="Section Benefits"] [data-framer-name="Desktop - Tab Link Inactive"]{cursor:pointer!important}
@media (prefers-reduced-motion:reduce){
  .drx-reveal-word,.drx-reveal-word.drx-reveal-word-in,
  .drx-reveal-line,.drx-reveal-line.drx-reveal-line-in,
  .drx-benefit-desc.is-on,.drx-benefit-visual.is-on{
    opacity:1!important;filter:none!important;transform:none!important;transition:none!important;visibility:visible!important
  }
  .drx-benefit-desc,.drx-benefit-visual{transition:none!important}
}
</style>`

const APPEAR_SCRIPT = `<script id="drx-scroll-appear-script">
(function(){
  var TITLE_SECTIONS=[
    "Section Features",
    "Section Use Cases",
    "Section Benefits",
    "Section Integrations",
    "Section Testimonials",
    "Section FAQ"
  ];

  function prepareWordSpans(root){
    if(!root)return [];
    var words=root.querySelectorAll(":scope > span, span");
    // Prefer direct spans under h1/h2 when present
    if(root.matches&&(root.matches("h1,h2,h3"))){
      words=root.querySelectorAll(":scope > span");
      if(!words.length)words=root.querySelectorAll("span");
    }else{
      var heading=root.querySelector("h1,h2,h3");
      if(heading){
        words=heading.querySelectorAll(":scope > span");
        if(!words.length)words=heading.querySelectorAll("span");
      }
    }
    var list=[];
    for(var i=0;i<words.length;i++){
      var span=words[i];
      if(span.dataset.drxWordReady==="1")continue;
      span.dataset.drxWordReady="1";
      span.setAttribute("style","display:inline-block;will-change:opacity,filter,transform");
      span.classList.add("drx-reveal-word");
      list.push(span);
    }
    return list;
  }

  function playWordReveal(words, startDelay){
    startDelay=startDelay||0;
    for(var i=0;i<words.length;i++){
      (function(span, index){
        window.setTimeout(function(){
          span.classList.add("drx-reveal-word-in");
        }, startDelay+index*85);
      })(words[i], i);
    }
    return startDelay+Math.max(words.length,1)*85;
  }

  function revealHeroText(){
    var title=document.querySelector('[data-framer-name="Hero title"] h1')||
      document.querySelector('[data-framer-name="Hero title"]');
    var words=prepareWordSpans(title);
    var doneAt=playWordReveal(words, 120);
    var desc=document.querySelector('[data-framer-name="Hero description"]');
    if(desc){
      desc.classList.add("drx-reveal-line");
      window.setTimeout(function(){desc.classList.add("drx-reveal-line-in");}, doneAt+100);
    }
    var badge=document.querySelector('[data-framer-name="Hero Top"]');
    if(badge){
      badge.classList.add("drx-reveal-line");
      window.setTimeout(function(){badge.classList.add("drx-reveal-line-in");}, 50);
    }
  }

  function collectSectionTitles(){
    var list=[];
    for(var s=0;s<TITLE_SECTIONS.length;s++){
      var section=document.querySelector('[data-framer-name="'+TITLE_SECTIONS[s]+'"]');
      if(!section)continue;
      var header=section.querySelector('[data-framer-name="Section Header"]')||section;
      var heading=header.querySelector("h2")||section.querySelector("h2");
      var tag=header.querySelector('[data-framer-name="Tag text"],[data-framer-name="Title Head"]');
      if(heading)list.push({section:TITLE_SECTIONS[s], heading:heading, tag:tag});
    }
    return list;
  }

  function armSectionTitleReveal(item){
    if(!item||!item.heading||item.heading.dataset.drxTitleArmed==="1")return;
    item.heading.dataset.drxTitleArmed="1";
    var words=prepareWordSpans(item.heading);
    if(item.tag){
      item.tag.classList.add("drx-reveal-line");
    }
    var played=false;
    function play(){
      if(played)return;
      played=true;
      if(item.tag)item.tag.classList.add("drx-reveal-line-in");
      playWordReveal(words, item.tag?90:0);
    }
    var io=new IntersectionObserver(function(entries){
      for(var i=0;i<entries.length;i++){
        if(!entries[i].isIntersecting)continue;
        play();
        io.disconnect();
        break;
      }
    },{threshold:0.25,rootMargin:"0px 0px -10% 0px"});
    io.observe(item.heading);
    // If already on screen
    var rect=item.heading.getBoundingClientRect();
    var vh=window.innerHeight||800;
    if(rect.top<vh*0.9&&rect.bottom>0){
      window.setTimeout(play, 40);
    }
  }

  function run(){
    revealHeroText();
    var titles=collectSectionTitles();
    for(var i=0;i<titles.length;i++)armSectionTitleReveal(titles[i]);
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",run);
  }else{
    run();
  }
})();
</script>`

/** Benefits feature tabs: Framer runtime is empty, so wire clicks + faded panel swaps. */
const BENEFITS_SCRIPT = `<script id="drx-benefits-tabs-script">
(function(){
  var ACTIVE_NAME="Desktop - Tab Link Active";
  var INACTIVE_NAME="Desktop - Tab Link Inactive";
  var ACTIVE_VARIANT="framer-v-xtjs40";
  var INACTIVE_VARIANT="framer-v-1ckrodh";
  var VISUALS=["Real Time Discussion","Flexible Views","Shared Docs","Integrated Workflows"];
  var current=-1;

  function tabs(){
    var root=benefitsRoot();
    var left=root.querySelector('[data-framer-name="Benefit Tab Left"]')||root;
    return Array.prototype.slice.call(
      left.querySelectorAll('[data-framer-name="Desktop - Tab Link Active"],[data-framer-name="Desktop - Tab Link Inactive"]')
    );
  }
  function benefitsRoot(){
    return document.querySelector('[data-framer-name="Section Benefits"]')||
      document.querySelector("#benefits")||document;
  }
  function visuals(){
    var root=benefitsRoot();
    var wrap=root.querySelector('[data-framer-name="Benefit Tab Right"] [data-framer-name="Visual Wrapper"]')||
      root.querySelector('[data-framer-name="Visual Wrapper"]');
    if(!wrap)return [];
    return VISUALS.map(function(name){
      // Only direct/top panels under this wrapper (avoid nested same-named nodes)
      var nodes=wrap.querySelectorAll(':scope > [data-framer-name="'+name+'"]');
      if(nodes.length)return nodes[0];
      return wrap.querySelector('[data-framer-name="'+name+'"]');
    });
  }
  function prepDesc(desc){
    if(!desc)return;
    desc.classList.add("drx-benefit-desc");
  }
  function prepVisual(panel){
    if(!panel)return;
    panel.classList.add("drx-benefit-visual");
  }
  function setDesc(desc, on, animate){
    if(!desc)return;
    prepDesc(desc);
    if(on){
      desc.style.transform="none";
      desc.style.position="relative";
      desc.style.top="auto";
      desc.classList.remove("is-off");
      if(animate){
        desc.classList.remove("is-on");
        // force reflow then fade in
        void desc.offsetWidth;
        desc.classList.add("is-on");
      }else{
        desc.classList.add("is-on");
      }
    }else{
      desc.classList.remove("is-on");
      desc.classList.add("is-off");
    }
  }
  function setTabState(tab, active, animate){
    if(!tab)return;
    tab.setAttribute("data-framer-name", active?ACTIVE_NAME:INACTIVE_NAME);
    tab.classList.remove(ACTIVE_VARIANT,INACTIVE_VARIANT);
    tab.classList.add(active?ACTIVE_VARIANT:INACTIVE_VARIANT);
    var desc=tab.querySelector('[data-framer-name=description],.framer-31togp');
    setDesc(desc, active, animate&&active);
  }
  function showVisual(index, animate){
    var panels=visuals();
    for(var i=0;i<panels.length;i++){
      if(!panels[i])continue;
      prepVisual(panels[i]);
      var on=i===index;
      panels[i].style.zIndex=on?"2":"1";
      panels[i].style.pointerEvents=on?"auto":"none";
      panels[i].style.opacity=on?"1":"0";
      if(on){
        panels[i].classList.remove("is-off");
        if(animate){
          panels[i].classList.remove("is-on");
          void panels[i].offsetWidth;
          panels[i].classList.add("is-on");
        }else{
          panels[i].classList.add("is-on");
        }
      }else{
        panels[i].classList.remove("is-on");
        panels[i].classList.add("is-off");
      }
    }
  }
  function activate(index, animate){
    if(index===current&&animate)return;
    var list=tabs();
    for(var i=0;i<list.length;i++)setTabState(list[i], i===index, animate);
    showVisual(index, animate);
    current=index;
  }
  function run(){
    var list=tabs();
    if(list.length<2)return;
    // Prep nodes once
    for(var i=0;i<list.length;i++){
      prepDesc(list[i].querySelector('[data-framer-name=description],.framer-31togp'));
    }
    visuals().forEach(prepVisual);
    activate(0, false);
    for(var t=0;t<list.length;t++){
      (function(tab, index){
        tab.addEventListener("click", function(ev){
          ev.preventDefault();
          ev.stopPropagation();
          activate(index, true);
        });
        tab.setAttribute("role","button");
        tab.setAttribute("tabindex","0");
        tab.addEventListener("keydown", function(ev){
          if(ev.key==="Enter"||ev.key===" "){
            ev.preventDefault();
            activate(index, true);
          }
        });
      })(list[t], t);
    }
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",run);
  }else{
    run();
  }
})();
</script>`

/** FAQ accordion: Framer runtime is empty, so toggle answer height + icon rotate. */
const FAQ_STYLE = `<style id="drx-faq-accordion">
[data-framer-name="Section FAQ"] [data-drx-faq-item] [data-drx-faq-panel]{
  overflow:hidden;
  transition:height .32s ease;
}
[data-framer-name="Section FAQ"] [data-drx-faq-item] [data-drx-faq-icon]{
  transition:transform .28s ease;
  transform-origin:center center;
}
[data-framer-name="Section FAQ"] [data-drx-faq-item].is-open [data-drx-faq-icon]{
  transform:rotate(45deg)!important;
}
@media (prefers-reduced-motion:reduce){
  [data-framer-name="Section FAQ"] [data-drx-faq-item] [data-drx-faq-panel],
  [data-framer-name="Section FAQ"] [data-drx-faq-item] [data-drx-faq-icon]{transition:none!important}
}
</style>`

const FAQ_SCRIPT = `<script id="drx-faq-accordion-script">
(function(){
  function items(){
    var root=document.querySelector('[data-framer-name="Section FAQ"]');
    if(!root)return [];
    return Array.prototype.slice.call(
      root.querySelectorAll('[class*="force-styles"][class*="-item-"]')
    );
  }
  function panelOf(item){
    return item.querySelector('[style*="will-change:height"],[style*="will-change: height"]')||
      item.querySelector('div[style*="overflow:hidden"]');
  }
  function headerOf(item){
    return item.querySelector('[style*="cursor:pointer"]')||item.firstElementChild;
  }
  function iconOf(header){
    return header?header.querySelector("img"):null;
  }
  function setOpen(item, open, animate){
    var panel=panelOf(item);
    var header=headerOf(item);
    var icon=iconOf(header);
    if(!panel)return;
    item.classList.toggle("is-open", open);
    item.setAttribute("data-drx-faq-item","1");
    panel.setAttribute("data-drx-faq-panel","1");
    if(icon)icon.setAttribute("data-drx-faq-icon","1");
    if(header){
      header.setAttribute("role","button");
      header.setAttribute("tabindex","0");
      header.setAttribute("aria-expanded", open?"true":"false");
    }
    if(!animate){
      panel.style.height=open?"auto":"0px";
      return;
    }
    if(open){
      panel.style.height=panel.scrollHeight+"px";
      var onEnd=function(ev){
        if(ev.propertyName!=="height")return;
        panel.removeEventListener("transitionend",onEnd);
        if(item.classList.contains("is-open"))panel.style.height="auto";
      };
      panel.addEventListener("transitionend",onEnd);
    }else{
      panel.style.height=panel.scrollHeight+"px";
      void panel.offsetHeight;
      panel.style.height="0px";
    }
  }
  function run(){
    var list=items();
    if(!list.length)return;
    for(var i=0;i<list.length;i++){
      (function(item){
        setOpen(item, false, false);
        var header=headerOf(item);
        if(!header||header.dataset.drxFaqBound==="1")return;
        header.dataset.drxFaqBound="1";
        header.addEventListener("click", function(ev){
          ev.preventDefault();
          ev.stopPropagation();
          var open=!item.classList.contains("is-open");
          // Accordion: close others
          for(var j=0;j<list.length;j++){
            if(list[j]!==item)setOpen(list[j], false, true);
          }
          setOpen(item, open, true);
        });
        header.addEventListener("keydown", function(ev){
          if(ev.key==="Enter"||ev.key===" "){
            ev.preventDefault();
            header.click();
          }
        });
      })(list[i]);
    }
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
    ? raw.replace(
        "</head>",
        `${PRODUCTION_HIDE_STYLE}${MARQUEE_STYLE}${APPEAR_STYLE}${FAQ_STYLE}</head>`
      )
    : `${PRODUCTION_HIDE_STYLE}${MARQUEE_STYLE}${APPEAR_STYLE}${FAQ_STYLE}${raw}`

  const bootScripts = `${MARQUEE_SCRIPT}${APPEAR_SCRIPT}${BENEFITS_SCRIPT}${FAQ_SCRIPT}`
  if (html.includes("</body>")) {
    html = html.replace("</body>", `${bootScripts}</body>`)
  } else if (html.includes("</html>")) {
    html = html.replace("</html>", `${bootScripts}</html>`)
  } else {
    html = `${html}${bootScripts}`
  }

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}
