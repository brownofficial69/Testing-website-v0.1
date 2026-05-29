/* v33: 8-Bit Game Boy Portfolio */
const SCREENS = {
  projects:[
    'THREATWEAVE    GO·AI','SECUREVIEW     REACT','SOC LAB    SIGMA','IOC HUNTER   PYTHON','NIST CSF       GRC','AWS HEALTH  STRIDE'
  ],
  skills:[
    'THREAT INTEL  LV99','DETECTION ENG LV90','PYTHON        LV88','GO            LV85','GRC           LV85','AWS           LV80'
  ],
  certs:[
    'CCNA    CISCO','OSCP    OFFSEC','CISM    ISACA','SEC+    COMPTIA'
  ],
  about:[
    'SHADMAN HOSSAIN','COVENTRY UNIV.','ETH HACKING &','CYBERSECURITY','BSC 2023-2026','FINAL YEAR'
  ]
};

let currentSection = 'projects';
let started = false;

function showSection(name){
  currentSection = name;
  const world = document.getElementById('game-world');
  world.innerHTML = `<div style="font-size:7px;color:#306230;margin-bottom:6px;border-bottom:1px solid #306230;padding-bottom:4px">[${name.toUpperCase()}]</div>` +
    SCREENS[name].map(r=>`<div class="world-item"><span>${r}</span><span>▶</span></div>`).join('');
}

document.getElementById('btn-start').addEventListener('click',()=>{
  if(!started){
    started=true;
    document.getElementById('scene-intro').classList.remove('active');
    const sg=document.getElementById('scene-game');
    sg.style.display='flex';sg.style.flexDirection='column';sg.classList.add('active');
    showSection('projects');
  }
});

const sections=['projects','skills','certs','about'];
document.getElementById('dp-right').addEventListener('click',()=>{
  const i=sections.indexOf(currentSection);
  showSection(sections[(i+1)%sections.length]);
});
document.getElementById('dp-left').addEventListener('click',()=>{
  const i=sections.indexOf(currentSection);
  showSection(sections[(i-1+sections.length)%sections.length]);
});
document.getElementById('btn-a').addEventListener('click',()=>{ document.getElementById('level-val').textContent='MAX'; });
document.getElementById('btn-select').addEventListener('click',()=>{ showSection(sections[Math.floor(Math.random()*sections.length)]); });
