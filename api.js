const API={
 async request(action,payload={}){
   if(!window.APP_CONFIG.API_URL || window.APP_CONFIG.API_URL.includes("PASTE_"))
     throw new Error("Apps Script API URL is not configured.");
   const body={action,...payload};
   const res=await fetch(window.APP_CONFIG.API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(body)});
   const json=await res.json();
   if(!json.ok)throw new Error(json.error||"Server error");
   return json.data;
 },
 login:(riderId,password)=>API.request("login",{riderId,password}),
 trips:()=>API.request("publicTrips"),
 trip:(tripId,token)=>API.request("trip",{tripId,token}),
 adminLogin:(username,password)=>API.request("adminLogin",{username,password}),
 adminData:token=>API.request("adminData",{token}),
 saveTrip:(token,trip)=>API.request("saveTrip",{token,trip}),
 saveRider:(token,rider)=>API.request("saveRider",{token,rider}),
 uploadPhoto:(token,payload)=>API.request("uploadPhoto",{token,...payload})
};