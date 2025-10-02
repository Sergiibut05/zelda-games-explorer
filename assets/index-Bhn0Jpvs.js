(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))b(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const v of s.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&b(v)}).observe(document,{childList:!0,subtree:!0});function c(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function b(e){if(e.ep)return;e.ep=!0;const s=c(e);fetch(e.href,s)}})();function A(i){return fetch(`https://api.rawg.io/api/games/${i}?key=be73fa1f33d94ca8969118d69c3c1ad5`).then(c=>c.ok?c.json():Promise.reject("No se pudo cargar detalles"))}let h=[],_=[],d=1;const j=12;let w=[],L="desc";function B(i,n=1){if(d=n,i.innerHTML='<div class="flex justify-center items-center min-h-[40vh]"><span class="text-white text-lg animate-pulse">Cargando juegos de Zelda...</span></div>',h.length>0){g();return}let c=[],b=1;const e=40,s=13;async function v(){for(;b<=s;){const l=await(await fetch(`https://api.rawg.io/api/games?key=be73fa1f33d94ca8969118d69c3c1ad5&search=zelda&page_size=${e}&page=${b}&platforms=7,10,11,105,83,79,49,8,9,24,43,26,87`)).json();if(l.results&&l.results.length>0){if(c=c.concat(l.results),!l.next)break}else break;b++}h=c.filter(t=>{const l=(t.name||"").toLowerCase(),x=(t.platforms||[]).map(m=>(m.platform.name||"").toLowerCase());return l.includes("zelda")&&!x.some(m=>m==="pc"||m==="web")}),_=Array.from(new Set(h.flatMap(t=>(t.platforms||[]).map(l=>l.platform.name)))).sort(),g()}v();function g(){let t=h;w.length>0&&(t=t.filter(p=>p.platforms&&p.platforms.some(o=>w.includes(o.platform.name)))),t=t.slice().sort((p,o)=>{const y=p.released?new Date(p.released).getTime():0,f=o.released?new Date(o.released).getTime():0;return L==="asc"?y-f:f-y});const l=Math.ceil(t.length/j)||1,x=(d-1)*j,m=x+j;z(t.slice(x,m),l,t.length)}function z(t,l,x){i.innerHTML=`
          <section class="w-full max-w-7xl mx-auto">
            <div class="pt-8"></div>
            <form id="filters-form" class="flex flex-wrap gap-6 mb-8 justify-center items-center bg-gradient-to-r from-emerald-950/80 via-stone-900/80 to-amber-900/60 p-4 rounded-2xl border-2 border-amber-400/30 shadow-lg">
              <div class="flex flex-col items-center">
                <label class="text-amber-200 font-bold mb-1">Ordenar por fecha</label>
                <select id="sort-order" class="rounded-lg px-3 py-2 bg-stone-800 text-emerald-200 border border-amber-400/40 focus:ring-2 focus:ring-emerald-400 outline-none">
                  <option value="desc">Más nuevos primero</option>
                  <option value="asc">Más antiguos primero</option>
                </select>
              </div>
              <div class="flex flex-col items-center">
                <label class="text-amber-200 font-bold mb-1">Consolas</label>
                <div id="platform-checkboxes" class="flex flex-wrap gap-2 max-w-xs justify-center">
                  ${_.map(r=>`
                    <label class="flex items-center gap-1 bg-stone-800/80 px-2 py-1 rounded-lg border border-amber-400/20 cursor-pointer hover:bg-emerald-900/40 transition">
                      <input type="checkbox" value="${r}" class="platform-checkbox accent-emerald-400">
                      <span class="text-xs text-emerald-100">${r}</span>
                    </label>
                  `).join("")}
                </div>
              </div>
            </form>
            <h1 class="zelda-title text-3xl md:text-4xl mb-8 text-center text-emerald-400 drop-shadow-lg">Juegos de The Legend of Zelda</h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
              ${t.map((r,u)=>`
                <button class="card-zelda bg-gradient-to-br from-emerald-900/90 via-amber-200/60 to-yellow-600/80 p-4 flex flex-col items-center rounded-2xl shadow-xl border border-amber-400/40 hover:scale-105 transition-transform duration-200 focus:outline-none" data-idx="${u}">
                  <img src="${r.background_image||"https://static.wikia.nocookie.net/zelda_gamepedia_en/images/9/9a/Triforce_Artwork.png"}" alt="${r.name}" class="rounded-xl mb-3 w-full h-48 object-cover bg-stone-900/40 shadow-md border border-amber-100/20">
                  <span class="text-emerald-100 font-bold text-lg text-center line-clamp-2">${r.name}</span>
                  <span class="text-xs text-amber-200 mt-1">${r.released||""}</span>
                  <div class="mt-2 flex flex-wrap gap-1 justify-center">
                    ${(r.platforms||[]).map($=>`<span class="bg-amber-900/60 text-amber-100 text-xs px-2 py-0.5 rounded-full">${$.platform.name}</span>`).join("")}
                  </div>
                </button>
              `).join("")}
            </div>
            <div class="flex justify-center items-center gap-4 mt-8">
              <button class="btn-zelda px-4 py-2" id="prev-page" ${d<=1?"disabled":""}>&larr; Anterior</button>
              <span class="text-emerald-200 font-bold">Página ${d} de ${l} &mdash; <span class="text-xs">${x} juegos</span></span>
              <button class="btn-zelda px-4 py-2" id="next-page" ${d>=l?"disabled":""}>Siguiente &rarr;</button>
            </div>
          </section>
          <div id="zelda-modal-root"></div>
        `;const m=document.getElementById("prev-page"),p=document.getElementById("next-page");m?.addEventListener("click",()=>{d>1&&(d--,g())}),p?.addEventListener("click",()=>{d++,g()});const o=document.getElementById("zelda-modal-root");i.querySelectorAll("[data-idx]").forEach(r=>{r.addEventListener("click",async()=>{const u=parseInt(r.getAttribute("data-idx")),$=t[u];if(o){o.innerHTML=`
              <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div class="bg-stone-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border-4 border-amber-400/40 flex flex-col items-center">
                  <span class='text-emerald-200 text-lg animate-pulse mb-4'>Cargando detalles...</span>
                </div>
              </div>
            `;try{const a=await A($.id);o.innerHTML=`
                <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                  <div class="bg-stone-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border-4 border-amber-400/40">
                    <button class="absolute top-2 right-2 text-amber-200 hover:text-emerald-300 text-2xl font-bold" id="close-modal">&times;</button>
                    <img src="${a.background_image||"https://static.wikia.nocookie.net/zelda_gamepedia_en/images/9/9a/Triforce_Artwork.png"}" alt="${a.name}" class="rounded-xl mb-4 w-full h-56 object-cover bg-stone-900/40 shadow-md border border-amber-100/20">
                    <h2 class="zelda-title text-2xl mb-2 text-emerald-300">${a.name}</h2>
                    <p class="text-amber-100 mb-2 text-sm">${a.released?`Lanzamiento: <b>${a.released}</b>`:""}</p>
                    <div class="mb-2 flex flex-wrap gap-2">
                      ${(a.platforms||[]).map(k=>`<span class="bg-amber-900/60 text-amber-100 text-xs px-2 py-0.5 rounded-full">${k.platform.name}</span>`).join("")}
                    </div>
                    <p class="text-emerald-100 text-sm mb-2">${a.genres?.map(k=>k.name).join(", ")||""}</p>
                    <p class="text-amber-200 text-xs mb-2">${a.esrb_rating?`ESRB: ${a.esrb_rating.name}`:""}</p>
                    <div class="my-4 p-3 bg-emerald-950/60 rounded-lg border-l-4 border-amber-400/60 max-h-48 overflow-y-auto text-white text-sm text-left shadow-inner">
                      ${a.description_raw?a.description_raw.length>400?a.description_raw.slice(0,400)+"...":a.description_raw:"Sin descripción disponible."}
                    </div>
                    <a href="${a.website||"#"}" target="_blank" rel="noopener" class="btn-zelda mt-4 inline-block ${a.website?"":"pointer-events-none opacity-50"}">Sitio oficial</a>
                  </div>
                </div>
              `,document.getElementById("close-modal")?.addEventListener("click",()=>{o.innerHTML=""})}catch{o.innerHTML="<div class='fixed inset-0 bg-black/60 flex items-center justify-center z-50'><div class='bg-stone-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border-4 border-amber-400/40 flex flex-col items-center'><span class='text-red-400'>No se pudo cargar detalles.</span><button class='btn-zelda mt-4' id='close-modal'>Cerrar</button></div></div>",document.getElementById("close-modal")?.addEventListener("click",()=>{o.innerHTML=""})}}})});const f=document.getElementById("sort-order");f&&(f.value=L,f.onchange=()=>{L=f.value,d=1,g()});const E=Array.from(document.querySelectorAll(".platform-checkbox"));E.forEach(r=>{r.checked=w.includes(r.value),r.onchange=()=>{w=E.filter(u=>u.checked).map(u=>u.value),d=1,g()}})}}class I{constructor(n){this.container=n,this.setupNavigation(),this.renderSection("juegos")}setupNavigation(){document.getElementById("nav-juegos")?.addEventListener("click",()=>this.renderSection("juegos"))}renderSection(n){switch(n){case"juegos":B(this.container);break}}}document.addEventListener("DOMContentLoaded",()=>{const i=document.getElementById("app");i&&new I(i)});
