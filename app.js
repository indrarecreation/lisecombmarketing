const TRIPS = [
  {id:"ride-07",number:"RIDE 07",title:"Roads to the West",subtitle:"Munnar · Coorg · Mysore",date:"12 — 15 AUG 2026",km:"742 KM",riders:8,locked:true,image:"assets/images/ride-01.jpg",tag:"FEATURED"},
  {id:"ride-06",number:"RIDE 06",title:"Chasing Monsoon",subtitle:"Alleppey · Vagamon · Thekkady",date:"03 — 05 JUL 2026",km:"418 KM",riders:6,locked:true,image:"assets/images/ride-02.jpg",tag:"MONSOON"},
  {id:"ride-05",number:"RIDE 05",title:"The Long Way Home",subtitle:"Wayanad · Ooty · Coonoor",date:"18 — 20 JUN 2026",km:"603 KM",riders:10,locked:false,image:"assets/images/ride-03.jpg",tag:"OPEN"}
];

const grid = document.querySelector("#journeyGrid");
grid.innerHTML = TRIPS.map(t => `
  <article class="journey-card" data-trip="${t.id}">
    <div class="card-image" style="background-image:url('${t.image}')">
      <span class="card-number">${t.number} · ${t.tag}</span>
      <span class="card-lock">${t.locked ? "PRIVATE · 🔒" : "OPEN · ↗"}</span>
    </div>
    <div class="card-body">
      <h3>${t.title}</h3>
      <p>${t.subtitle}</p>
      <div class="card-foot"><span>${t.date}</span><span>${t.km}</span></div>
    </div>
  </article>
`).join("");

document.querySelectorAll(".journey-card").forEach(card => {
  card.addEventListener("click", () => {
    const trip = TRIPS.find(x => x.id === card.dataset.trip);
    if (trip.locked && !sessionStorage.getItem("riderAuth")) openLogin();
    else window.location.href = `magazine.html?trip=${trip.id}`;
  });
});

const modal = document.querySelector("#loginModal");
function openLogin(){ modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.querySelector("#riderId").focus(); }
function closeLogin(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }
document.querySelector("#loginBtn").onclick = openLogin;
document.querySelectorAll("[data-close]").forEach(x => x.onclick = closeLogin);
modal.addEventListener("click", e => { if(e.target === modal) closeLogin(); });

document.querySelector("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.querySelector("#riderId").value.trim().toUpperCase();
  const pw = document.querySelector("#riderPassword").value;
  // DEMO ONLY. Replace with Firebase/Supabase authentication before production.
  if(id === "R001" && pw === "ride2026"){
    sessionStorage.setItem("riderAuth","true");
    sessionStorage.setItem("riderId",id);
    closeLogin();
    showToast("Welcome back, R001.");
    setTimeout(() => window.location.href = "magazine.html?trip=ride-07", 500);
  } else showToast("Invalid rider ID or password.");
});

function showToast(msg){const t=document.querySelector("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
document.querySelector("#replayHero").onclick = () => showToast("Journey replay will be connected to the live route map.");
