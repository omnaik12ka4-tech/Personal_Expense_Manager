const token=localStorage.getItem("token");if(!token)location.href="login.html";
const user=JSON.parse(localStorage.getItem("user")||"{}");
const page=location.pathname.split("/").pop();
const nav=[["dashboard.html","📊","Dashboard"],["transactions.html","💸","Transactions"],["budget.html","🎯","Budget"],["reports.html","📈","Reports"]];
document.getElementById("app").innerHTML=`<div class="layout"><aside class="sidebar"><div class="brand">₹ <span>Expense Manager</span></div><nav class="nav">${nav.map(n=>`<a href="${n[0]}" class="${page===n[0]?"active":""}">${n[1]} <span>${n[2]}</span></a>`).join("")}</nav><button class="btn logout" id="logout">↪ <span>Logout</span></button></aside><main class="main"><div class="topbar"><div><h1 id="pageTitle"></h1><div class="muted">Manage your personal finances</div></div><div class="user-chip">👤 ${user.name||"User"}</div></div><div id="content"></div></main></div>`;
document.getElementById("logout").onclick=()=>{localStorage.clear();location.href="login.html"};
const API="/api";
async function api(url,options={}){options.headers={...(options.headers||{}),Authorization:"Bearer "+token,"Content-Type":"application/json"};const r=await fetch(API+url,options);const d=await r.json();if(!r.ok)throw new Error(d.message||"Request failed");return d}
function money(n){return "₹"+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:2})}
function monthKey(){return new Date().toISOString().slice(0,7)}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}