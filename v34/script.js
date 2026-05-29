/* v34: Polaroid Gallery - Draggable */
const POLAROIDS = [
  {caption:'ThreatWeave',detail:'Go · Claude API · Redis',color:'pol-blue',style:'background:linear-gradient(135deg,#1e1e3f,#4a4a9f)',text:'TW',pos:{top:80,left:60},rot:-4},
  {caption:'SecureView',detail:'React · TypeScript · Vite',color:'pol-purple',style:'background:linear-gradient(135deg,#1a3a4a,#2a6a8a)',text:'SV',pos:{top:80,left:320},rot:3},
  {caption:'SOC Detection Lab',detail:'Python · Sigma · MITRE',color:'pol-pink',style:'background:linear-gradient(135deg,#3a1a1a,#8a2a2a)',text:'SD',pos:{top:300,left:80},rot:-6},
  {caption:'IOC Hunter',detail:'Python · VirusTotal · APIs',color:'pol-green',style:'background:linear-gradient(135deg,#1a3a1a,#2a7a2a)',text:'IH',pos:{top:280,left:560},rot:5},
  {caption:'NIST CSF 2.0',detail:'GRC · Compliance · SVG',color:'pol-yellow',style:'background:linear-gradient(135deg,#3a3a0a,#7a7a1a)',text:'NC',pos:{top:520,left:200},rot:-3},
  {caption:'AWS Healthcare',detail:'STRIDE · GDPR · AWS',color:'pol-blue',style:'background:linear-gradient(135deg,#2a1a3a,#6a2a8a)',text:'AW',pos:{top:500,left:480},rot:4},
  {caption:'CCNA · OSCP · CISM · Sec+',detail:'Certifications',color:'pol-yellow',style:'background:linear-gradient(135deg,#3a2a0a,#8a6a1a)',text:'★',pos:{top:460,left:740},rot:-5},
  {caption:'Contact Me',detail:'brownofficial69@gmail.com',color:'pol-pink',style:'background:linear-gradient(135deg,#2a0a1a,#6a1a3a)',text:'✉',pos:{top:80,left:700},rot:6},
];

const board = document.getElementById('board');

POLAROIDS.forEach((p,i)=>{
  const div = document.createElement('div');
  div.className = 'polaroid';
  div.style.cssText = `top:${p.pos.top}px;left:${p.pos.left}px;transform:rotate(${p.rot}deg)`;
  div.innerHTML = `
    <div class="pol-inner ${p.color}">
      <div class="pol-photo-area" style="${p.style};display:flex;align-items:center;justify-content:center">
        <span style="font-size:36px;font-weight:900;color:rgba(255,255,255,0.9);font-family:Inter">${p.text}</span>
      </div>
      <div class="pol-caption">${p.caption}<span class="pol-detail">${p.detail}</span></div>
    </div>
    <div class="pin" style="background:${['#e74c3c','#3498db','#2ecc71','#9b59b6','#f39c12','#1abc9c','#e67e22','#e91e63'][i%8]};"></div>`;

  // Drag
  let dragging=false, ox=0, oy=0;
  div.addEventListener('mousedown',e=>{
    dragging=true;ox=e.clientX-div.offsetLeft;oy=e.clientY-div.offsetTop;
    div.style.zIndex=100;div.style.transition='none';
  });
  document.addEventListener('mousemove',e=>{
    if(!dragging) return;
    div.style.left=(e.clientX-ox)+'px';div.style.top=(e.clientY-oy)+'px';
  });
  document.addEventListener('mouseup',()=>{dragging=false;div.style.zIndex='';div.style.transition='';});
  board.appendChild(div);
});
