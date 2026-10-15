/* Script commun à toutes les pages : menu, thème, pagination, pied de page.
   Tout est dans une fonction pour ne pas entrer en conflit avec les scripts des pages.
   Seuls $, $$, esc et PAGES sont partagés (ne pas les redéclarer dans une page). */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
document.documentElement.classList.add("js");

/* Pour ajouter une page : créer le fichier .html puis ajouter une ligne ici. */
const PAGES=[
{id:"timeline",href:"timeline.html",label:"Timeline",emoji:"⏳",color:"var(--violet)",desc:"Les grandes dates du Web, de 1989 à l'IA."},
{id:"url",href:"url.html",label:"URL",emoji:"🔗",color:"var(--orange)",desc:"Lire une adresse morceau par morceau et comprendre les codes 200, 404 et 500."},
{id:"domaine",href:"domaine.html",label:"Domaines",emoji:"🏷️",color:"var(--green)",desc:"Qui vend les noms, combien ça coûte, et le rôle du DNS."},
{id:"standards",href:"standards.html",label:"Standards",emoji:"📐",color:"var(--cyan)",desc:"Qui écrit les règles du Web, et pourquoi elles sont indispensables."},
{id:"securite",href:"securite.html",label:"Sécurité",emoji:"🛡️",color:"var(--pink)",desc:"Phishing, virus, force brute : reconnaître les attaques et s'en protéger."},
{id:"quiz",href:"quiz.html",label:"Quiz",emoji:"🎯",color:"var(--blue)",desc:"Teste tes connaissances : codes HTTP, phishing, domaines, standards et dates du Web."},
{id:"sources",href:"sources.html",label:"Sources",emoji:"📚",color:"var(--yellow)",desc:"Les liens consultés, l'auteur et les outils IA utilisés."}];
const NAV=[{id:"index",href:"index.html",label:"Accueil",emoji:"🏠",color:"var(--blue)"},...PAGES];

const cur=document.body.dataset.page||"index";
const me=PAGES.find(p=>p.id===cur);
document.body.style.setProperty("--accent",me?me.color:"var(--blue)");

/* Lien d'accès rapide au contenu (clavier) */
const main=$("main");
if(main){main.id="main";main.tabIndex=-1;
document.body.insertAdjacentHTML("afterbegin",'<a class="skip" href="#main">Aller au contenu</a>')}

/* Menu : liens en ligne sur grand écran, bouton ☰ sur tablette et téléphone */
const H=$("#site-header");
if(H){H.className="site-header";
H.innerHTML=`<div class="hbar"><a class="brand" href="index.html" aria-label="Le Web, simplement : accueil">🌐<span> Le Web, simplement</span></a><nav id="nav" aria-label="Navigation principale">${NAV.map(p=>`<a href="${p.href}" style="--c:${p.color}"${p.id===cur?' aria-current="page"':""}><span aria-hidden="true">${p.emoji}</span> ${p.label}</a>`).join("")}</nav><button class="btn ghost" id="theme" type="button"></button><button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Ouvrir le menu"><span></span></button></div>`;
const bg=$("#burger");
const setMenu=o=>{H.classList.toggle("open",o);bg.setAttribute("aria-expanded",String(o));bg.setAttribute("aria-label",o?"Fermer le menu":"Ouvrir le menu")};
bg.onclick=()=>setMenu(!H.classList.contains("open"));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&H.classList.contains("open")){setMenu(false);bg.focus()}});
document.addEventListener("click",e=>{if(!H.contains(e.target))setMenu(false)});
const mq=matchMedia("(min-width:1100px)"),close=()=>setMenu(false);
if(mq.addEventListener)mq.addEventListener("change",close);else if(mq.addListener)mq.addListener(close)}

/* Thème clair / sombre (mémorisé) */
const R=document.documentElement,tb=$("#theme");
function setT(t){R.dataset.theme=t;if(tb){const d=t==="dark";tb.innerHTML=`<span aria-hidden="true">${d?"☀️":"🌙"}</span><span class="lbl"> ${d?"Clair":"Nuit"}</span>`;tb.setAttribute("aria-label",d?"Passer en mode clair":"Passer en mode nuit")}}
let th="dark";try{th=localStorage.getItem("theme")||"dark"}catch(e){}
setT(th==="light"?"light":"dark");
if(tb)tb.onclick=()=>{const n=R.dataset.theme==="dark"?"light":"dark";setT(n);try{localStorage.setItem("theme",n)}catch(e){}};

/* Pagination « précédent / suivant » */
const PG=$("#pager");
if(PG&&me){const i=PAGES.indexOf(me),a=i>0?PAGES[i-1]:{href:"index.html",label:"Accueil",emoji:"🏠",color:"var(--blue)"},b=PAGES[i+1];
PG.innerHTML=`<div class="container pager"><a href="${a.href}" style="--c:${a.color}"><small>← Précédent</small>${a.emoji} ${a.label}</a>${b?`<a href="${b.href}" style="--c:${b.color}"><small>Suivant →</small>${b.emoji} ${b.label}</a>`:`<a href="index.html" style="--c:var(--blue)"><small>Retour</small>🏠 Accueil</a>`}</div>`}

const F=$("#site-footer");
if(F)F.innerHTML=`<footer><div class="container">Site pédagogique sur le Web · SANTOS Richard · fait avec l'aide de Claude (IA)</div></footer>`;

/* Apparition des sections au défilement */
const els=$$(".reveal");
if("IntersectionObserver"in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});els.forEach(e=>io.observe(e))}else els.forEach(e=>e.classList.add("in"));

Object.assign(window,{$,$$,esc,PAGES});
})();
