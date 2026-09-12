const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
let expression = "";

function render(){
  expressionEl.textContent = expression || "\u00A0";
  if(!expression){ resultEl.textContent = "0"; return; }
  try{
    const safe = expression.replace(/[^0-9+\-*/().]/g,"");
    const value = Function('"use strict"; return (' + safe + ')')();
    if(Number.isFinite(value)) resultEl.textContent = formatNumber(value);
  }catch(e){}
}
function formatNumber(n){
  if(Math.abs(n) >= 1e12 || (Math.abs(n) > 0 && Math.abs(n) < 1e-8)) return n.toExponential(8);
  return Number(n.toFixed(10)).toLocaleString("en-US",{maximumFractionDigits:10});
}
document.querySelectorAll(".key").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const action = btn.dataset.action;
    const val = btn.dataset.value;
    if(action === "clear"){ expression=""; render(); return; }
    if(action === "backspace"){ expression=expression.slice(0,-1); render(); return; }
    if(action === "equals"){
      try{
        const safe = expression.replace(/[^0-9+\-*/().]/g,"");
        const value = Function('"use strict"; return (' + safe + ')')();
        if(Number.isFinite(value)) expression = String(value);
      }catch(e){}
      render(); return;
    }
    if(val){ expression += val; render(); }
  });
});
document.getElementById("clearBtn").addEventListener("click",()=>{expression="";render();});
window.addEventListener("keydown",(e)=>{
  if(/[0-9+\-*/().]/.test(e.key)){ expression += e.key; render(); }
  else if(e.key==="Enter"){ document.querySelector('[data-action="equals"]').click(); }
  else if(e.key==="Backspace"){ expression=expression.slice(0,-1); render(); }
  else if(e.key==="Escape"){ expression=""; render(); }
});

function val(id){ return Number(document.getElementById(id).value); }
function setText(id, text){ document.getElementById(id).textContent=text; }
function money(n){ return n.toLocaleString("en-US",{style:"currency",currency:"USD"}); }

function calcPercentage(){
  const a=val("pctA"), b=val("pctB");
  setText("pctResult", Number.isFinite(a*b/100) ? `${a}% of ${b} = ${formatNumber(a*b/100)}` : "Enter valid numbers");
}
function calcTip(){
  const bill=val("tipBill"), pct=val("tipPct"), people=Math.max(1,val("tipPeople")||1);
  const tip=bill*pct/100, total=bill+tip;
  setText("tipResult", `${money(total/people)} each • ${money(tip)} tip`);
}
function calcBMI(){
  const w=val("bmiWeight"), h=val("bmiHeight");
  const bmi=(w/(h*h))*703;
  setText("bmiResult", h>0 && w>0 ? `BMI: ${bmi.toFixed(1)}` : "Enter valid height and weight");
}
function calcLoan(){
  const p=val("loanAmount"), annual=val("loanRate"), n=val("loanMonths");
  if(!(p>0&&n>0)){ setText("loanResult","Enter valid values"); return; }
  const r=annual/100/12;
  const m = r===0 ? p/n : p*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
  setText("loanResult", `${money(m)} / month`);
}
function milesToKm(){ const x=val("miles"); setText("milesResult", `${formatNumber(x*1.609344)} km`); }
function poundsToKg(){ const x=val("pounds"); setText("poundsResult", `${formatNumber(x*0.45359237)} kg`); }
function fToC(){ const x=val("fahrenheit"); setText("tempResult", `${formatNumber((x-32)*5/9)} °C`); }
function feetToMeters(){ const x=val("feet"); setText("feetResult", `${formatNumber(x*0.3048)} m`); }

document.getElementById("year").textContent = new Date().getFullYear();
render();
