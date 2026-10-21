/* Adds a "try this" strip and the animated architecture diagram to each project demo. */
(function () {
  'use strict';
  var file = location.pathname.split('/').pop().replace('.html', '');
  var KEY = { 'supply-chain-risk': 'supply-chain' }[file] || file;
  var TIPS = {
    'soc-lab': ['Switch one rule off, press Run detections and see which finding disappears.', 'Raise the brute-force failure threshold until the attack is missed.', 'Change the correlation window and see how the multi-stage rule reacts.'],
    'ioc-hunter': ['Press Load messy sample, then Analyse, and read how each indicator was classified.', 'Look for indicators written in defanged form and see them refanged.', 'Download the result as CSV or JSON.'],
    'threatweave': ['Press Run collection and watch the four sample feeds come back in parallel.', 'Look at how indicators are grouped by ASN and by ATT&CK technique.', 'See which groups were reported by more than one feed.'],
    'secureview': ['Open the highest-severity alert and read the remediation guidance.', 'Escalate one alert and mark another as a false positive.', 'Close an alert, then reopen it.'],
    'adam-eve-mizan': ['Pick a scenario and press Evaluate to see the proposer, critic and mediator decide.', 'Edit the rationale text and notice that Mizan never reads it.', 'Tamper with entry 1, then Verify chain.'],
    'supply-chain-risk': ['Pick a preset vendor and read the rating.', 'Change one answer and watch the rating move.', 'Press Reset and compare with another preset.']
  };
  function addTips() {
    var t = TIPS[file]; if (!t) return;
    var host = document.querySelector('.notice') || document.querySelector('.top'); if (!host) return;
    var d = document.createElement('div'); d.className = 'tips';
    d.innerHTML = t.map(function (x, i) { return '<div class="tip"><i>try ' + (i + 1) + '</i><span>' + x + '</span></div>'; }).join('');
    host.parentNode.insertBefore(d, host.nextSibling);
  }
  function addArch() {
    var dg = window.DIAGRAMS && window.DIAGRAMS[KEY]; var main = document.querySelector('main'); if (!dg || !main) return;
    var s = document.createElement('section'); s.className = 'card arch';
    s.innerHTML = '<h2>How it is put together</h2><p class="muted">The structure of the project this demo is based on. The demo is a small in-browser version with sample data.</p><div class="dgwrap">' + dg + '</div>';
    main.appendChild(s);
  }
  addTips(); addArch();
})();
