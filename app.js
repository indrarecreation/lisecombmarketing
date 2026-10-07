/* WANDER STORIES — V2 CONTENT ENGINE
   Prototype data layer. Replace localStorage persistence/auth with Supabase/Firebase for production.
*/
const DEFAULT_DATA = {
  riders:[
    {id:"R001",name:"Lead Rider",password:"ride2026",trips:["ride-07","ride-06","ride-05"],active:true},
    {id:"R002",name:"Rider Two",password:"demo2026",trips:["ride-07"],active:true}
  ],
  trips:[
    {id:"ride-07",number:"RIDE 07",title:"Roads to the West",subtitle:"Munnar · Coorg · Mysore",date:"12 — 15 AUG 2026",km:742,riders:8,visibility:"private",cover:"assets/images/ride-01.jpg",
     chapters:[
       {title:"The Beginning",eyebrow:"CHAPTER 01",text:"At 5:32 in the morning, eight riders rolled out before the city had properly woken up."},
       {title:"The Road",eyebrow:"CHAPTER 02",text:"Clouds, curves, coffee stops and the kind of road that makes everyone slow down."},
       {title:"Little Things We Kept",eyebrow:"CHAPTER 03",text:"A roadside laugh, a wrong turn and the photograph nobody planned."}
     ],
     memories:[
       {title:"The first coffee",caption:"Nobody was fully awake yet.",image:"assets/images/memory-01.jpg"},
       {title:"That viewpoint",caption:"The road suddenly felt worth every kilometre.",image:"assets/images/memory-02.jpg"}
     ],
     route:[
       {name:"Kochi",time:"05:32",lat:9.9312,lng:76.2673,note:"Departure"},
       {name:"Munnar",time:"10:45",lat:10.0889,lng:77.0595,note:"First big view"},
       {name:"Coorg",time:"16:20",lat:12.3375,lng:75.8069,note:"The quiet road"},
       {name:"Mysore",time:"20:10",lat:12.2958,lng:76.6394,note:"End of the day"}
     ]
    },
    {id:"ride-06",number:"RIDE 06",title:"Chasing Monsoon",subtitle:"Alleppey · Vagamon · Thekkady",date:"03 — 05 JUL 2026",km:418,riders:6,visibility:"private",cover:"assets/images/ride-02.jpg",chapters:[],memories:[],route:[]},
    {id:"ride-05",number:"RIDE 05",title:"The Long Way Home",subtitle:"Wayanad · Ooty · Coonoor",date:"18 — 20 JUN 2026",km:603,riders:10,visibility:"public",cover:"assets/images/ride-03.jpg",chapters:[],memories:[],route:[]}
  ]
};

function loadData(){
  try{return JSON.parse(localStorage.getItem("wanderStoriesData")) || DEFAULT_DATA}
  catch(e){return DEFAULT_DATA}
}
function saveData(data){localStorage.setItem("wanderStoriesData",JSON.stringify(data))}
function resetDemo(){localStorage.removeItem("wanderStoriesData");location.reload()}
window.WS={loadData,saveData,resetDemo};

if(document.querySelector("#journeyGrid")){
  const data=loadData();
  const grid=document.querySelector("#journeyGrid");
  grid.innerHTML=data.trips.map(t=>`
    <article class="journey-card" data-trip="${t.id}">
      <div class="card-image" style="background-image:url('${t.cover}')">
        <span class="card-number">${t.number} · ${t.visibility==="private"?"PRIVATE":"OPEN"}</span>
        <span class="card-lock">${t.visibility==="private"?"PRIVATE · 🔒":"OPEN · ↗"}</span>
      </div>
      <div class="card-body">
        <h3>${t.title}</h3><p>${t.subtitle}</p>
        <div class="card-foot"><span>${t.date}</span><span>${t.km} KM</span></div>
      </div>
    </article>`).join("");
  grid.querySelectorAll(".journey-card").forEach(card=>card.onclick=()=>{
    const t=data.trips.find(x=>x.id===card.dataset.trip);
    if(t.visibility==="private"&&!sessionStorage.getItem("riderAuth")) openLogin();
    else location.href=`magazine.html?trip=${t.id}`;
  });
}
const modal=document.querySelector("#loginModal");
function openLogin(){if(modal){modal.classList.add("open");modal.querySelector("#riderId").focus()}}
function closeLogin(){if(modal)modal.classList.remove("open")}
if(document.querySelector("#loginBtn"))document.querySelector("#loginBtn").onclick=openLogin;
document.querySelectorAll("[data-close]").forEach(x=>x.onclick=closeLogin);
if(document.querySelector("#loginForm"))document.querySelector("#loginForm").onsubmit=e=>{
  e.preventDefault();
  const data=loadData(),id=document.querySelector("#riderId").value.trim().toUpperCase(),pw=document.querySelector("#riderPassword").value;
  const rider=data.riders.find(r=>r.id===id&&r.password===pw&&r.active);
  if(!rider)return showToast("Invalid rider ID or password.");
  sessionStorage.setItem("riderAuth","true");sessionStorage.setItem("riderId",id);sessionStorage.setItem("riderTrips",JSON.stringify(rider.trips));
  closeLogin();showToast(`Welcome, ${rider.name}.`);setTimeout(()=>location.href=`magazine.html?trip=${rider.trips[0]}`,450);
};
function showToast(msg){const t=document.querySelector("#toast");if(!t)return;t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}
