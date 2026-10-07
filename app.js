const $=s=>document.querySelector(s);const toast=m=>{const t=$("#toast");if(t){t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}};
async function boot(){
 try{
  const d=await API.trips();
  $("#tripCount").textContent=d.length;
  $("#kmCount").textContent=d.reduce((a,x)=>a+Number(x.km||0),0).toLocaleString();
  $("#riderCount").textContent=d.reduce((a,x)=>a+Number(x.riders||0),0);
  $("#journeyGrid").innerHTML=d.map(t=>`<article class="journey-card" data-id="${t.id}"><div class="card-image" style="background-image:url('${t.cover||"assets/images/ride-01.jpg"}')"><span class="card-number">${t.number||"RIDE"} · ${t.visibility==="private"?"PRIVATE":"OPEN"}</span><span class="card-lock">${t.visibility==="private"?"🔒 PRIVATE":"↗ OPEN"}</span></div><div class="card-body"><h3>${t.title}</h3><p>${t.subtitle||""}</p><div class="card-foot"><span>${t.date||""}</span><span>${t.km||0} KM</span></div></div></article>`).join("");
  document.querySelectorAll(".journey-card").forEach(c=>c.onclick=()=>openTrip(c.dataset.id));
 }catch(e){$("#journeyGrid").innerHTML="<p>Connect the Apps Script URL in config.js to load the live archive.</p>"}
}
async function openTrip(id){
 const token=sessionStorage.getItem("wsToken");
 try{
  const d=await API.trip(id,token);sessionStorage.setItem("wsTrip",JSON.stringify(d));location.href=`magazine.html?trip=${id}`;
 }catch(e){if(confirm("This is a private journey. Login as a rider?"))$("#loginModal").classList.add("open")}
}
$("#loginBtn").onclick=()=>$("#loginModal").classList.add("open");
document.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>$("#loginModal").classList.remove("open"));
$("#loginForm").onsubmit=async e=>{e.preventDefault();try{const d=await API.login($("#riderId").value.trim(),$("#riderPassword").value);sessionStorage.setItem("wsToken",d.token);sessionStorage.setItem("wsRider",JSON.stringify(d.rider));$("#loginModal").classList.remove("open");toast("Welcome back.");boot()}catch(err){toast(err.message)}};
boot();