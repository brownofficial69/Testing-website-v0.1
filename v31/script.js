/* v31: News Wire */
const TICKER_ITEMS = ['ThreatWeave: 5/5 concurrency tests','SOC Detection Lab: multi-stage detections','SecureView: 17/17 unit tests','IOC Hunter: 19/19 security tests passing','First-Class BSc (73.67%)','ADAM / EVE / Mizan: 21/21 Phase-8 tests','Anthropic Claude Academy: 9 courses','Supply Chain Risk Framework dissertation'];
const SKILLS = ['Threat Intel','Detection Eng','Sigma Rules','YARA','Splunk','Python','Go','TypeScript','React','Docker','AWS','GRC','Pentest','OWASP','Burp Suite'];

document.getElementById('ticker').textContent = TICKER_ITEMS.map(t=>`   ◆ ${t}   `).join('');

const sf = document.getElementById('skills-feed');
SKILLS.forEach(s=>{
  const div=document.createElement('div');
  div.className='feed-item';
  div.innerHTML=`<span class="fi-tag">SKILL</span><b>${s}</b>`;
  sf.appendChild(div);
});
