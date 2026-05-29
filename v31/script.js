/* v31: News Wire */
const TICKER_ITEMS = ['ThreatWeave v2.1 deployed','SOC Detection Lab hits 94% ATT&CK coverage','SecureView dashboard goes live','IOC Hunter aggregates 1,247 indicators','OSCP Certified','AWS Healthcare threat model published','CISM Certification earned','NIST CSF 2.0 tool released'];
const SKILLS = ['Threat Intel','Detection Eng','Sigma Rules','YARA','Splunk','Python','Go','TypeScript','React','Docker','AWS','GRC','Pentest','OWASP','Burp Suite'];

document.getElementById('ticker').textContent = TICKER_ITEMS.map(t=>`   ◆ ${t}   `).join('');

const sf = document.getElementById('skills-feed');
SKILLS.forEach(s=>{
  const div=document.createElement('div');
  div.className='feed-item';
  div.innerHTML=`<span class="fi-tag">SKILL</span><b>${s}</b>`;
  sf.appendChild(div);
});
