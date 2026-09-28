const W = window.WEDDING;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function hydrate(){
  document.title = `${W.bride} & ${W.groom} — Wedding Invitation`;
  $("#bride").textContent=W.bride; $("#groom").textContent=W.groom;
  $("#sigBride").textContent=W.bride; $("#sigGroom").textContent=W.groom;
  $("#sealMonogram").textContent=W.monogram; $("#finalMonogram").textContent=W.monogram;
  $("#displayDate").textContent=W.displayDate;
  $("#invitationTitle").textContent=W.invitationTitle;
  $("#invitationText").textContent=W.invitationText;
  $("#venue").textContent=W.venue; $("#city").textContent=W.city;
  $("#dressCode").textContent=W.dressCode; $("#note").textContent=W.note;
  $("#heroImage").src=W.heroImage; $("#venueImage").src=W.venueImage;
  $("#music").src=W.music;
  $("#mapButton").href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(W.mapQuery)}`;
  $("#mapFrame").src=`https://www.google.com/maps?q=${encodeURIComponent(W.mapQuery)}&output=embed`;
  $("#timeline").innerHTML=W.schedule.map(([t,e])=>`<div class="timeline-row"><div class="timeline-time">${t}</div><div class="timeline-dot"></div><div class="timeline-event">${e}</div></div>`).join("");
  $("#palette").innerHTML=W.colors.map(c=>`<span class="swatch" style="background:${c}"></span>`).join("");
}
function countdown(){
  const d=Math.max(0,new Date(W.dateISO)-new Date());
  const sec=Math.floor(d/1000);
  $("#days").textContent=String(Math.floor(sec/86400)).padStart(3,"0");
  $("#hours").textContent=String(Math.floor(sec%86400/3600)).padStart(2,"0");
  $("#minutes").textContent=String(Math.floor(sec%3600/60)).padStart(2,"0");
  $("#seconds").textContent=String(sec%60).padStart(2,"0");
}
function start(){
  const opener=$("#openInvitation");
  opener.classList.add("active");
  const music=$("#music");
  music.play().then(()=>$("#musicButton").classList.add("playing")).catch(()=>{});
  setTimeout(()=>{
    $("#opening").classList.add("opened");
    $("#invite").classList.add("visible");
    $("#invite").setAttribute("aria-hidden","false");
    window.scrollTo(0,0);
    setTimeout(()=>$$(".reveal")[0]?.classList.add("in"),100);
  },1250);
}
hydrate(); countdown(); setInterval(countdown,1000);
$("#openInvitation").addEventListener("click",start);
$("#openInvitation").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")start()});
$("#musicButton").addEventListener("click",()=>{
  const a=$("#music");
  if(a.paused){a.play();$("#musicButton").classList.add("playing")}
  else{a.pause();$("#musicButton").classList.remove("playing")}
});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("in")}),{threshold:.15});
$$(".reveal").forEach(el=>io.observe(el));
$("#rsvpForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.currentTarget));
  const msg=$("#formMessage");
  if(W.rsvpEndpoint){
    try{
      const r=await fetch(W.rsvpEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      if(!r.ok) throw 0;
      msg.textContent="Thank you — your response has been received.";
      e.currentTarget.reset();
    }catch{msg.textContent="We couldn't submit your response. Please try again."}
  }else{
    localStorage.setItem("wedding-rsvp",JSON.stringify(data));
    msg.textContent="Thank you — RSVP saved on this demo.";
  }
});