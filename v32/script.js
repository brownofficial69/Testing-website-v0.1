/* v32: DNA Helix Canvas */
const canvas = document.getElementById('helix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = 400;
const W = canvas.width, H = canvas.height;

const PAIRS = [
  ['ThreatWeave','Threat Intel'],['SecureView','Detection Eng'],['SOC Lab','Sigma Rules'],
  ['IOC Hunter','YARA'],['NIST CSF','GRC'],['AWS Health','Cloud Sec'],
  ['Python','Go'],['React','TypeScript'],['Docker','Redis'],
  ['OSCP','CCNA'],['CISM','Security+'],['Pentest','OWASP'],
  ['Burp Suite','Nmap'],['MITRE ATT&CK','Splunk'],['FastAPI','PostgreSQL']
];

// Render sequence table
const seqPairs = document.getElementById('seq-pairs');
PAIRS.forEach(([a,b])=>{
  seqPairs.innerHTML += `<div class="seq-pair"><span class="sp-a">${a}</span><span class="sp-bond">═══</span><span class="sp-b">${b}</span></div>`;
});

let t=0;
function draw(){
  ctx.clearRect(0,0,W,H);
  const cx=W/2;
  const count=PAIRS.length;
  const step=H/(count+1);

  for(let i=0;i<count;i++){
    const y = step*(i+1);
    const phase = (i/count)*Math.PI*4 + t;
    const ax = cx + Math.cos(phase)*160;
    const bx = cx + Math.cos(phase+Math.PI)*160;
    const depth = Math.sin(phase);

    // Connection bar
    ctx.strokeStyle=`rgba(255,255,255,${0.08+Math.abs(depth)*0.1})`;
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(ax,y);ctx.lineTo(bx,y);ctx.stroke();

    // Base pair labels
    const sz = 0.7+Math.abs(depth)*0.3;
    ctx.font=`${500} ${Math.round(10*sz)}px Space Grotesk`;
    ctx.textBaseline='middle';

    // Strand A node
    ctx.fillStyle=`rgba(79,195,247,${0.4+Math.abs(depth)*0.6})`;
    ctx.shadowColor='#4fc3f7';ctx.shadowBlur=depth>0?12:0;
    ctx.beginPath();ctx.arc(ax,y,5+Math.abs(depth)*5,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle=`rgba(79,195,247,${0.6+Math.abs(depth)*0.4})`;
    ctx.textAlign=ax<cx?'right':'left';
    ctx.fillText(PAIRS[i][0],ax+(ax<cx?-12:12),y);

    // Strand B node
    ctx.fillStyle=`rgba(206,147,216,${0.4+Math.abs(depth)*0.6})`;
    ctx.shadowColor='#ce93d8';ctx.shadowBlur=depth<0?12:0;
    ctx.beginPath();ctx.arc(bx,y,5+Math.abs(depth)*5,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle=`rgba(206,147,216,${0.6+Math.abs(depth)*0.4})`;
    ctx.textAlign=bx<cx?'right':'left';
    ctx.fillText(PAIRS[i][1],bx+(bx<cx?-12:12),y);
  }

  t+=0.01;
  requestAnimationFrame(draw);
}
draw();
