// ============================================================
// v12: Gamified Cybersecurity Challenge Portfolio
// ============================================================

// Game state
let gameState = {
  score: 0,
  level: 1,
  streak: 0,
  progress: 0,
  challenges: [],
  currentChallenge: 0,
  isPlaying: false,
  achievements: []
};

// Challenges (mini-quizzes unlocking project details)
const CHALLENGES = [
  {
    title: 'Threat Intelligence 101',
    question: 'What does IOC stand for?',
    options: ['Indicator of Compromise', 'Internet of Computers', 'Internal Object Code', 'Integrated Optical Circuit'],
    correct: 0,
    points: 100,
    unlocksProject: 'ThreatWeave'
  },
  {
    title: 'Detection Engineering',
    question: 'Which MITRE ATT&CK tactic describes credential dumping?',
    options: ['Initial Access', 'Credential Access', 'Execution', 'Defense Evasion'],
    correct: 1,
    points: 100,
    unlocksProject: 'SOC Detection Lab'
  },
  {
    title: 'Python Mastery',
    question: 'Which library is best for async HTTP requests in Python?',
    options: ['requests', 'aiohttp', 'urllib3', 'httplib'],
    correct: 1,
    points: 100,
    unlocksProject: 'IOC Hunter'
  },
  {
    title: 'GRC Fundamentals',
    question: 'What is the primary goal of NIST CSF?',
    options: ['Software testing', 'Cyber risk management', 'Network design', 'Database optimization'],
    correct: 1,
    points: 100,
    unlocksProject: 'NIST CSF 2.0'
  },
  {
    title: 'Web Security',
    question: 'Which of these is NOT in the OWASP Top 10?',
    options: ['Injection', 'XSS', 'CSRF', 'Typos'],
    correct: 3,
    points: 100,
    unlocksProject: 'SecureView'
  },
  {
    title: 'Incident Response',
    question: 'What is the first step in incident response?',
    options: ['Remediation', 'Containment', 'Detection', 'Eradication'],
    correct: 2,
    points: 100,
    unlocksProject: 'AWS Healthcare'
  }
];

// Achievements
const ACHIEVEMENTS = [
  { id: 'first-blood', emoji: '🎯', name: 'First Blood', desc: 'Complete first challenge' },
  { id: 'perfect', emoji: '💯', name: 'Perfect Score', desc: '3 streak' },
  { id: 'speedrunner', emoji: '⚡', name: 'Speedrunner', desc: 'Complete 5 challenges' },
  { id: 'expert', emoji: '👑', name: 'Security Expert', desc: 'Complete all challenges' },
  { id: 'streak-master', emoji: '🔥', name: 'Streak Master', desc: '6+ streak' },
  { id: 'points-collector', emoji: '💰', name: 'Points Collector', desc: '500+ points' }
];

// Leaderboard (mock data + user)
const LEADERBOARD = [
  { rank: 1, name: 'DarkMatter', score: 2100 },
  { rank: 2, name: 'CyberGhost', score: 1950 },
  { rank: 3, name: 'Shadman', score: parseInt(localStorage.getItem('arcade-score') || 0) },
  { rank: 4, name: 'ThreatHunter', score: 1800 },
  { rank: 5, name: 'SecurityBot', score: 1650 }
];

// Screen management
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Start game
function startGame() {
  gameState = {
    score: 0,
    level: 1,
    streak: 0,
    progress: 0,
    challenges: CHALLENGES.map((c, i) => ({ ...c, index: i })).sort(() => Math.random() - 0.5),
    currentChallenge: 0,
    isPlaying: true,
    achievements: []
  };
  updateUI();
  showChallenge();
}

// Show challenge
function showChallenge() {
  if (gameState.currentChallenge >= gameState.challenges.length) {
    endGame();
    return;
  }

  const challenge = gameState.challenges[gameState.currentChallenge];
  document.getElementById('challenge-title').textContent = challenge.title;
  document.getElementById('challenge-content').textContent = challenge.question;

  const optionsContainer = document.getElementById('challenge-options');
  optionsContainer.innerHTML = '';

  challenge.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option;
    btn.onclick = () => answerChallenge(index, challenge.correct);
    optionsContainer.appendChild(btn);
  });

  showScreen('challenge-screen');
  startTimer();
}

// Answer challenge
function answerChallenge(selected, correct) {
  const challenge = gameState.challenges[gameState.currentChallenge];
  const isCorrect = selected === correct;

  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach(btn => btn.disabled = true);

  const correctBtn = buttons[correct];
  correctBtn.classList.add('correct');

  if (!isCorrect) {
    const selectedBtn = buttons[selected];
    selectedBtn.classList.add('wrong');
    gameState.streak = 0;
  } else {
    gameState.score += challenge.points;
    gameState.streak++;
    checkAchievements();
  }

  setTimeout(() => {
    showSuccess(isCorrect, challenge.points);
  }, 1500);
}

// Show success
function showSuccess(isCorrect, points) {
  const message = isCorrect
    ? `You unlocked: ${gameState.challenges[gameState.currentChallenge].unlocksProject}!`
    : 'Try again!';

  document.getElementById('points-earned').textContent = isCorrect ? `+${points}` : '+0';
  document.getElementById('success-message').textContent = message;

  showScreen('success-screen');
}

// Next challenge
function nextChallenge() {
  gameState.currentChallenge++;
  gameState.progress = (gameState.currentChallenge / gameState.challenges.length) * 100;
  updateUI();
  showChallenge();
}

// End game
function endGame() {
  gameState.isPlaying = false;
  localStorage.setItem('arcade-score', gameState.score);
  localStorage.setItem('arcade-level', gameState.level);
  document.getElementById('final-score').textContent = gameState.score;
  document.getElementById('final-level').textContent = gameState.currentChallenge + 1;
  updateLeaderboard();
  showScreen('gameover-screen');
}

// Check achievements
function checkAchievements() {
  if (gameState.currentChallenge === 0) {
    addAchievement('first-blood');
  }
  if (gameState.streak === 3) {
    addAchievement('perfect');
  }
  if (gameState.currentChallenge === 5) {
    addAchievement('speedrunner');
  }
  if (gameState.currentChallenge === gameState.challenges.length - 1) {
    addAchievement('expert');
  }
  if (gameState.streak >= 6) {
    addAchievement('streak-master');
  }
  if (gameState.score >= 500) {
    addAchievement('points-collector');
  }
}

// Add achievement
function addAchievement(id) {
  if (!gameState.achievements.includes(id)) {
    gameState.achievements.push(id);
    updateAchievements();
  }
}

// Update UI
function updateUI() {
  document.getElementById('score').textContent = gameState.score;
  document.getElementById('level').textContent = gameState.level;
  document.getElementById('streak').textContent = gameState.streak;
  document.getElementById('progress-fill').style.width = gameState.progress + '%';
  updateAchievements();
  updateLeaderboard();
}

// Update achievements display
function updateAchievements() {
  const container = document.getElementById('achievements');
  container.innerHTML = ACHIEVEMENTS
    .map(ach => `
      <div class="achievement ${!gameState.achievements.includes(ach.id) ? 'locked' : ''}" title="${ach.name}">
        ${ach.emoji}
      </div>
    `)
    .join('');
}

// Update leaderboard
function updateLeaderboard() {
  const sorted = LEADERBOARD.sort((a, b) => b.score - a.score);
  const container = document.getElementById('leaderboard');
  container.innerHTML = sorted
    .slice(0, 5)
    .map((entry, i) => `
      <div class="leaderboard-entry">
        <span class="leaderboard-rank">#${i + 1}</span>
        <span class="leaderboard-name">${entry.name}</span>
        <span class="leaderboard-score">${entry.score}</span>
      </div>
    `)
    .join('');
}

// Timer
let timerInterval;
function startTimer() {
  const timerBar = document.getElementById('timer-bar');
  let time = 100;
  timerInterval = setInterval(() => {
    time -= 2;
    timerBar.style.width = time + '%';
    if (time <= 0) {
      clearInterval(timerInterval);
    }
  }, 50);
}

// View portfolio
function viewPortfolio() {
  window.location.href = '../v9/index.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  showScreen('welcome-screen');

  // Dark mode effect
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

window.addEventListener('resize', () => {
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
