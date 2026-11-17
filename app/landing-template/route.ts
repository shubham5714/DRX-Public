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
[data-framer-name="Section Features"] [data-framer-name="Header Left"] .framer-styles-preset-ywza5g,
[data-framer-name="Section Features"] [data-framer-name="Header Left"] a[data-framer-name=Primary],
[data-framer-name="Section Features"] [data-framer-name="Header Left"] a[data-framer-name="Primary"]{
  display:none!important;
}
[data-framer-name="Social Wrapper"] a,
[data-framer-name="Social Wrapper"] div[data-framer-name=Desktop]{pointer-events:none!important;cursor:default!important}
nav a[data-drx-nav-noop]{cursor:default!important}
/* Framer mobile variants were not exported; adapt desktop nav/footer ourselves. */
@media (max-width:1015.98px){
  nav.framer-LVVZm,
  nav[data-framer-name=Desktop],
  nav[data-framer-name="Desktop"]{
    width:100%!important;
    max-width:100%!important;
    box-sizing:border-box!important;
  }
  nav [data-framer-name="Nav Menu"],
  nav [data-framer-name="Button Wrapper"]{display:none!important}
  nav .drx-mobile-toggle{
    display:inline-flex!important;
    align-items:center;
    justify-content:center;
    width:40px;
    height:40px;
    margin-left:auto;
    border:1px solid rgba(255,255,255,.12);
    border-radius:4px;
    background:rgba(255,255,255,.04);
    color:#fff;
    cursor:pointer;
    flex:none;
  }
  nav .drx-mobile-toggle svg{display:block;width:18px;height:18px}
  .drx-mobile-panel{
    display:none;
    position:fixed;
    z-index:10050;
    top:72px;
    left:16px;
    right:16px;
    max-height:calc(100vh - 96px);
    overflow:auto;
    padding:16px;
    border:1px solid rgba(255,255,255,.1);
    border-radius:8px;
    background:rgba(14,15,19,.96);
    backdrop-filter:blur(16px);
    box-shadow:0 16px 40px rgba(0,0,0,.45);
  }
  .drx-mobile-panel.is-open{display:flex;flex-direction:column;gap:4px}
  .drx-mobile-panel a{
    display:block;
    padding:12px 14px;
    border-radius:6px;
    color:#fff!important;
    text-decoration:none!important;
    font:500 15px/1.3 Inter,system-ui,sans-serif;
  }
  .drx-mobile-panel a:hover,
  .drx-mobile-panel a:focus-visible{background:rgba(255,255,255,.06)}
  .drx-mobile-panel a[data-drx-nav-noop]{opacity:.7;cursor:default}
  .drx-mobile-panel a.drx-mobile-cta{
    margin-top:8px;
    text-align:center;
    background:rgb(122,95,255)!important;
    box-shadow:rgba(122,95,255,.15) 0 0 0 2px,rgba(122,95,255,.45) 0 1px 2px 1px;
  }
  .drx-mobile-panel a.drx-mobile-cta:hover,
  .drx-mobile-panel a.drx-mobile-cta:focus-visible{filter:brightness(1.06)}
  .drx-mobile-backdrop{
    display:none;
    position:fixed;
    inset:0;
    z-index:10040;
    background:rgba(0,0,0,.45);
  }
  .drx-mobile-backdrop.is-open{display:block}
}
@media (min-width:1016px){
  nav .drx-mobile-toggle,
  .drx-mobile-panel,
  .drx-mobile-backdrop{display:none!important}
}
@media (max-width:809.98px){
  footer.framer-BbRsn,
  footer[data-framer-name=Desktop],
  footer[data-framer-name="Desktop"]{
    padding:64px 20px 40px!important;
    overflow:visible!important;
  }
  [data-framer-name="Footer Top"]{
    flex-direction:column!important;
    align-items:stretch!important;
    justify-content:flex-start!important;
    gap:40px!important;
    width:100%!important;
  }
  [data-framer-name="Footer Left"],
  [data-framer-name="Logo Container"],
  [data-framer-name="Footer Left"] [data-framer-name=Description],
  [data-framer-name="Footer Left"] [data-framer-name="Description"],
  footer .framer-d18dyi,
  footer .framer-forvwt,
  footer .framer-pumzwt{
    width:100%!important;
    max-width:100%!important;
    flex:none!important;
  }
  [data-framer-name="Footer Links Wrapper"],
  footer .framer-sy0420{
    display:grid!important;
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
    grid-auto-rows:auto!important;
    width:100%!important;
    max-width:100%!important;
    gap:28px 24px!important;
    flex:none!important;
  }
  [data-framer-name="Footer Column"]{
    width:100%!important;
    max-width:100%!important;
  }
  /* Links (3rd column) sits under Sections */
  [data-framer-name="Footer Links Wrapper"]>[data-framer-name="Footer Column"]:nth-child(3){
    grid-column:1!important;
  }
  [data-framer-name="Social Wrapper"],
  footer [data-framer-name="Social Wrapper"]{
    display:flex!important;
    flex-direction:row!important;
    flex-wrap:nowrap!important;
    align-items:center!important;
    gap:12px!important;
  }
}
@media (min-width:810px) and (max-width:1015.98px){
  footer.framer-BbRsn,
  footer[data-framer-name=Desktop],
  footer[data-framer-name="Desktop"]{
    padding:80px 40px 48px!important;
  }
  [data-framer-name="Footer Top"]{
    flex-direction:column!important;
    align-items:stretch!important;
    gap:40px!important;
  }
  [data-framer-name="Footer Left"],
  [data-framer-name="Logo Container"],
  footer .framer-d18dyi,
  footer .framer-forvwt,
  footer .framer-pumzwt{
    width:100%!important;
    max-width:100%!important;
    flex:none!important;
  }
  [data-framer-name="Footer Links Wrapper"],
  footer .framer-sy0420{
    width:100%!important;
    max-width:100%!important;
    grid-template-columns:repeat(3,minmax(0,1fr))!important;
    gap:32px 24px!important;
    flex:none!important;
  }
}
</style>`

/** Products noop + mobile hamburger drawer (Framer mobile nav not exported). */
const NAV_SCRIPT = `<script id="drx-nav-script">
(function(){
  function armNoop(){
    var links=document.querySelectorAll("a[data-drx-nav-noop]");
    for(var i=0;i<links.length;i++){
      links[i].addEventListener("click", function(ev){
        ev.preventDefault();
        ev.stopPropagation();
      });
    }
  }
  function linkLabel(a){
    if(!a)return "";
    var p=a.querySelector("p");
    var raw=p?p.textContent:a.textContent;
    return (raw||"").replace(/\\s+/g," ").trim();
  }
  function uniqueLabels(anchors){
    var out=[], seen={};
    for(var i=0;i<anchors.length;i++){
      var a=anchors[i];
      var label=linkLabel(a);
      if(!label||seen[label])continue;
      seen[label]=1;
      out.push({href:a.getAttribute("href")||"#", label:label, noop:a.hasAttribute("data-drx-nav-noop")});
    }
    return out;
  }
  function armMobile(){
    var nav=document.querySelector("nav");
    if(!nav||nav.dataset.drxMobile==="1")return;
    nav.dataset.drxMobile="1";
    var menu=nav.querySelector('[data-framer-name="Nav Menu"]');
    var actions=nav.querySelector('[data-framer-name="Button Wrapper"]');
    var items=uniqueLabels(menu?menu.querySelectorAll("a"):[]);
    var cta=actions?actions.querySelector("a"):null;
    if(cta){
      items.push({
        href:cta.getAttribute("href")||"#",
        label:linkLabel(cta)||"Book a Demo",
        noop:false,
        cta:true
      });
    }
    var btn=document.createElement("button");
    btn.type="button";
    btn.className="drx-mobile-toggle";
    btn.setAttribute("aria-label","Open menu");
    btn.setAttribute("aria-expanded","false");
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    var container=nav.querySelector('[data-framer-name=Container]')||nav.querySelector(".framer-yg3pqa")||nav;
    if(actions&&actions.parentNode){
      actions.parentNode.insertBefore(btn, actions.nextSibling);
    }else{
      container.appendChild(btn);
    }
    var backdrop=document.createElement("div");
    backdrop.className="drx-mobile-backdrop";
    var panel=document.createElement("div");
    panel.className="drx-mobile-panel";
    panel.setAttribute("role","dialog");
    panel.setAttribute("aria-label","Menu");
    for(var i=0;i<items.length;i++){
      var item=items[i];
      var link=document.createElement("a");
      link.href=item.href;
      link.textContent=item.label;
      if(item.noop)link.setAttribute("data-drx-nav-noop","1");
      if(item.cta)link.className="drx-mobile-cta";
      panel.appendChild(link);
    }
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    function setOpen(open){
      panel.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open?"true":"false");
      btn.setAttribute("aria-label", open?"Close menu":"Open menu");
      document.documentElement.style.overflow=open?"hidden":"";
    }
    btn.addEventListener("click", function(ev){
      ev.preventDefault();
      setOpen(!panel.classList.contains("is-open"));
    });
    backdrop.addEventListener("click", function(){setOpen(false);});
    panel.addEventListener("click", function(ev){
      var t=ev.target;
      if(t&&t.tagName==="A"){
        if(t.hasAttribute("data-drx-nav-noop")){
          ev.preventDefault();
          return;
        }
        setOpen(false);
      }
    });
    window.addEventListener("keydown", function(ev){
      if(ev.key==="Escape")setOpen(false);
    });
  }
  function run(){
    armNoop();
    armMobile();
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",run);
  }else{
    run();
  }
})();
</script>`

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
/* Benefits tabs: centered title when idle; subtitle collapses then fades in when active */
[data-framer-name="Section Benefits"] [data-framer-name="Desktop - Tab Link Active"],
[data-framer-name="Section Benefits"] [data-framer-name="Desktop - Tab Link Inactive"]{
  cursor:pointer!important;
  height:auto!important;
  min-height:96px!important;
  overflow:visible!important;
  align-items:center!important;
}
[data-framer-name="Section Benefits"] [data-framer-name="Feature section"]{
  overflow:visible!important;
  min-width:0!important;
}
[data-framer-name="Section Benefits"] [data-framer-name="Feature title"],
[data-framer-name="Section Benefits"] [data-framer-name="Feature title"] h3{
  white-space:normal!important;
  overflow:visible!important;
  text-overflow:unset!important;
  line-height:1.25em!important;
}
[data-framer-name="Section Benefits"] [data-framer-name="Desktop - Tab Link Inactive"] [data-framer-name="Feature section"]{
  place-content:center!important;
  justify-content:center!important;
}
[data-framer-name="Section Benefits"] [data-framer-name="Desktop - Tab Link Active"] [data-framer-name="Feature section"]{
  place-content:flex-start center!important;
  justify-content:flex-start!important;
}
.drx-benefit-desc{
  width:100%!important;
  position:relative!important;
  top:auto!important;
  left:auto!important;
  transform:none!important;
  transition:opacity .4s ease,margin .35s ease!important;
}
.drx-benefit-desc.is-off{
  opacity:0!important;
  visibility:hidden!important;
  pointer-events:none!important;
  height:0!important;
  max-height:0!important;
  margin:0!important;
  padding:0!important;
  overflow:hidden!important;
}
.drx-benefit-desc.is-on{
  opacity:1!important;
  visibility:visible!important;
  height:auto!important;
  max-height:320px!important;
  overflow:visible!important;
}
.drx-benefit-desc.is-on [data-framer-name="Feature description"],
.drx-benefit-desc.is-on .framer-1hju62x{
  opacity:1!important;
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
    // Keep subtitle out of layout when idle so the title stays vertically centered
    desc.style.position="relative";
    desc.style.top="auto";
    desc.style.left="auto";
    desc.style.transform="none";
    desc.style.width="100%";
    var copy=desc.querySelector('[data-framer-name="Feature description"],.framer-1hju62x,p');
    if(on){
      desc.classList.remove("is-off");
      if(animate){
        desc.classList.remove("is-on");
        void desc.offsetWidth;
        desc.classList.add("is-on");
      }else{
        desc.classList.add("is-on");
      }
      desc.style.height="auto";
      desc.style.maxHeight="";
      desc.style.opacity="1";
      desc.style.visibility="visible";
      desc.style.overflow="visible";
      if(copy){
        copy.style.opacity="1";
        copy.style.transform="none";
        copy.style.visibility="visible";
      }
    }else{
      desc.classList.remove("is-on");
      desc.classList.add("is-off");
      desc.style.height="0px";
      desc.style.maxHeight="0px";
      desc.style.opacity="0";
      desc.style.visibility="hidden";
      desc.style.overflow="hidden";
      desc.style.margin="0px";
      desc.style.padding="0px";
      if(copy){
        copy.style.opacity="0";
      }
    }
  }
  function setTabState(tab, active, animate){
    if(!tab)return;
    tab.setAttribute("data-framer-name", active?ACTIVE_NAME:INACTIVE_NAME);
    tab.classList.remove(ACTIVE_VARIANT,INACTIVE_VARIANT);
    tab.classList.add(active?ACTIVE_VARIANT:INACTIVE_VARIANT);
    var desc=tab.querySelector('[data-framer-name=description]');
    if(!desc)desc=tab.querySelector(".framer-31togp");
    setDesc(desc, active, animate&&active);
  }
  function showVisual(index, animate){
    var panels=visuals();
    // More tabs than visual panels: reuse the last panel for extras
    var visualIndex=Math.min(index, Math.max(panels.length-1, 0));
    for(var i=0;i<panels.length;i++){
      if(!panels[i])continue;
      prepVisual(panels[i]);
      var on=i===visualIndex;
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

  const bootScripts = `${NAV_SCRIPT}${MARQUEE_SCRIPT}${APPEAR_SCRIPT}${BENEFITS_SCRIPT}${FAQ_SCRIPT}`
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
