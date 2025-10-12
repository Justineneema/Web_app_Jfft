// ========== GLOBAL VARIABLES ==========
let currentUser = localStorage.getItem('currentUser');
let demoMode = localStorage.getItem('demoMode');

// Test configuration
let testConfig = {
  duration: 60,
  textType: 'common',
  difficulty: 'easy'
};

// Test state
let testState = {
  isActive: false,
  isPaused: false,
  startTime: null,
  timeLeft: 60,
  currentIndex: 0,
  errors: 0,
  correctChars: 0,
  totalChars: 0,
  wpm: 0,
  accuracy: 100
};

// Text content for different types and difficulties
const textContent = {
  common: {
    easy: "the quick brown fox jumps over the lazy dog this is a simple test to measure your typing speed and accuracy keep typing and do not stop until the time runs out remember to focus on both speed and accuracy for the best results",
    medium: "programming requires patience practice and persistence debugging code can be challenging but rewarding when you finally solve complex problems writing clean efficient code takes time and experience to master properly",
    hard: "sophisticated algorithms optimize performance through careful consideration of time complexity space complexity and implementation details while maintaining readability and maintainability for future development cycles"
  },
  quotes: {
    easy: "To be or not to be that is the question. All that glitters is not gold. The pen is mightier than the sword. Actions speak louder than words. Better late than never.",
    medium: "The only way to do great work is to love what you do. Innovation distinguishes between a leader and a follower. Stay hungry stay foolish. Design is not just what it looks like design is how it works.",
    hard: "The future belongs to those who believe in the beauty of their dreams. Success is not final failure is not fatal it is the courage to continue that counts. In the midst of winter I found there was within me an invincible summer."
  },
  code: {
    easy: "function hello() { console.log('Hello World'); return true; } if (condition) { doSomething(); } else { doSomethingElse(); }",
    medium: "const API_URL = 'https://api.example.com'; async function fetchData() { try { const response = await fetch(API_URL); return await response.json(); } catch (error) { console.error(error); } }",
    hard: "interface UserRepository { findById(id: string): Promise<User | null>; save(user: User): Promise<void>; } class DatabaseUserRepository implements UserRepository { async findById(id: string) { return await this.db.query('SELECT * FROM users WHERE id = ?', [id]); } }"
  }
};

// ========== AUTHENTICATION ==========
function registerUser() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  
  if (!username || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (username.length < 3) {
    showNotification('Username must be at least 3 characters', 'error');
    return;
  }
  
  if (password.length < 6) {
    showNotification('Password must be at least 6 characters', 'error');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (users[username]) {
    showNotification('User already exists', 'error');
    return;
  }
  
  users[username] = {
    password: password,
    stats: {
      testsCompleted: 0,
      bestWPM: 0,
      averageWPM: 0,
      bestAccuracy: 0,
      averageAccuracy: 0,
      totalTimeTyping: 0,
      testHistory: []
    },
    achievements: [],
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('users', JSON.stringify(users));
  showNotification('Account created successfully! Please login.', 'success');
  
  // Clear form
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

function loginUser() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  
  if (!username || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (!users[username] || users[username].password !== password) {
    showNotification('Invalid credentials', 'error');
    return;
  }
  
  localStorage.setItem('currentUser', username);
  localStorage.removeItem('demoMode');
  showNotification('Login successful!', 'success');
  
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('demoMode');
  showNotification('Logged out successfully!', 'success');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// ========== NOTIFICATIONS ==========
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-width: 300px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    animation: slideInRight 0.3s ease;
  `;
  
  if (type === 'success') {
    notification.style.background = '#38a169';
  } else if (type === 'error') {
    notification.style.background = '#e53e3e';
  } else {
    notification.style.background = '#667eea';
  }
  
  const button = notification.querySelector('button');
  button.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 4000);
}

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(animationStyles);

// ========== TYPING TEST ENGINE ==========
class TypingTest {
  constructor() {
    this.text = '';
    this.currentIndex = 0;
    this.errors = 0;
    this.correctChars = 0;
    this.totalChars = 0;
    this.startTime = null;
    this.timer = null;
    this.isActive = false;
    this.isPaused = false;
    this.wpm = 0;
    this.accuracy = 100;
    
    this.initializeElements();
    this.bindEvents();
  }
  
  initializeElements() {
    this.wordsContainer = document.getElementById('wordsContainer');
    this.inputArea = document.getElementById('inputArea');
    this.timerElement = document.getElementById('timer');
    this.wpmElement = document.getElementById('wpm');
    this.accuracyElement = document.getElementById('accuracy');
    this.errorsElement = document.getElementById('errors');
    this.startBtn = document.getElementById('startBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
  }
  
  bindEvents() {
    if (this.inputArea) {
      this.inputArea.addEventListener('input', this.handleInput.bind(this));
      this.inputArea.addEventListener('keydown', this.handleKeyDown.bind(this));
      this.inputArea.addEventListener('paste', this.handlePaste.bind(this));
    }
  }
  
  loadText() {
    const { textType, difficulty } = testConfig;
    this.text = textContent[textType][difficulty];
    this.displayText();
  }
  
  displayText() {
    if (!this.wordsContainer) return;
    
    this.wordsContainer.innerHTML = '';
    
    for (let i = 0; i < this.text.length; i++) {
      const charElement = document.createElement('span');
      charElement.className = 'char';
      charElement.textContent = this.text[i];
      
      if (i === 0) {
        charElement.classList.add('current');
      }
      
      this.wordsContainer.appendChild(charElement);
    }
  }
  
  handleInput(event) {
    if (!this.isActive) {
      this.start();
    }
    
    const inputValue = event.target.value;
    const inputLength = inputValue.length;
    
    // Update character highlighting
    this.updateCharacterHighlighting(inputValue);
    
    // Update statistics
    this.updateStats();
  }
  
  handleKeyDown(event) {
    // Prevent certain key combinations
    if (event.ctrlKey && (event.key === 'a' || event.key === 'c' || event.key === 'v')) {
      if (event.key === 'v') {
        event.preventDefault();
        showNotification('Pasting is not allowed during the test', 'error');
      }
    }
  }
  
  handlePaste(event) {
    event.preventDefault();
    showNotification('Pasting is not allowed during the test', 'error');
  }
  
  updateCharacterHighlighting(inputValue) {
    const chars = this.wordsContainer.querySelectorAll('.char');
    
    chars.forEach((char, index) => {
      char.className = 'char';
      
      if (index < inputValue.length) {
        if (inputValue[index] === this.text[index]) {
          char.classList.add('correct');
        } else {
          char.classList.add('incorrect');
        }
      } else if (index === inputValue.length) {
        char.classList.add('current');
      }
    });
    
    // Calculate errors and correct characters
    this.errors = 0;
    this.correctChars = 0;
    
    for (let i = 0; i < inputValue.length; i++) {
      if (i < this.text.length) {
        if (inputValue[i] === this.text[i]) {
          this.correctChars++;
        } else {
          this.errors++;
        }
      }
    }
    
    this.totalChars = inputValue.length;
    this.currentIndex = inputValue.length;
  }
  
  updateStats() {
    if (!this.startTime) return;
    
    const currentTime = Date.now();
    const timeElapsed = (currentTime - this.startTime) / 1000 / 60; // in minutes
    
    // Calculate WPM (words per minute)
    this.wpm = timeElapsed > 0 ? Math.round((this.correctChars / 5) / timeElapsed) : 0;
    
    // Calculate accuracy
    this.accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
    
    // Update UI
    if (this.wpmElement) this.wpmElement.textContent = this.wpm;
    if (this.accuracyElement) this.accuracyElement.textContent = this.accuracy + '%';
    if (this.errorsElement) this.errorsElement.textContent = this.errors;
  }
  
  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.startTime = Date.now();
    testState.timeLeft = testConfig.duration;
    
    if (this.inputArea) {
      this.inputArea.disabled = false;
      this.inputArea.focus();
    }
    
    if (this.startBtn) {
      this.startBtn.style.display = 'none';
    }
    
    if (this.pauseBtn) {
      this.pauseBtn.style.display = 'inline-block';
    }
    
    this.startTimer();
    showNotification('Test started! Type the text above.', 'success');
  }
  
  startTimer() {
    this.timer = setInterval(() => {
      if (!this.isPaused) {
        testState.timeLeft--;
        
        if (this.timerElement) {
          this.timerElement.textContent = testState.timeLeft;
        }
        
        if (testState.timeLeft <= 0) {
          this.finish();
        }
      }
    }, 1000);
  }
  
  pause() {
    this.isPaused = !this.isPaused;
    
    if (this.inputArea) {
      this.inputArea.disabled = this.isPaused;
    }
    
    if (this.pauseBtn) {
      this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }
    
    showNotification(this.isPaused ? 'Test paused' : 'Test resumed', 'info');
  }
  
  finish() {
    this.isActive = false;
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    if (this.inputArea) {
      this.inputArea.disabled = true;
    }
    
    // Save test results
    this.saveResults();
    
    // Show results modal
    this.showResults();
    
    showNotification('Test completed!', 'success');
  }
  
  reset() {
    this.isActive = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.errors = 0;
    this.correctChars = 0;
    this.totalChars = 0;
    this.startTime = null;
    this.wpm = 0;
    this.accuracy = 100;
    testState.timeLeft = testConfig.duration;
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    if (this.inputArea) {
      this.inputArea.value = '';
      this.inputArea.disabled = false;
    }
    
    if (this.timerElement) {
      this.timerElement.textContent = testConfig.duration;
    }
    
    if (this.wpmElement) this.wpmElement.textContent = '0';
    if (this.accuracyElement) this.accuracyElement.textContent = '100%';
    if (this.errorsElement) this.errorsElement.textContent = '0';
    
    if (this.startBtn) {
      this.startBtn.style.display = 'inline-block';
    }
    
    if (this.pauseBtn) {
      this.pauseBtn.style.display = 'none';
    }
    
    this.loadText();
    showNotification('Test reset', 'info');
  }
  
  saveResults() {
    const results = {
      wpm: this.wpm,
      accuracy: this.accuracy,
      errors: this.errors,
      characters: this.totalChars,
      duration: testConfig.duration,
      textType: testConfig.textType,
      difficulty: testConfig.difficulty,
      date: new Date().toISOString()
    };
    
    if (currentUser && !demoMode) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      
      if (users[currentUser]) {
        users[currentUser].stats.testsCompleted++;
        users[currentUser].stats.testHistory.unshift(results);
        
        // Keep only last 50 tests
        if (users[currentUser].stats.testHistory.length > 50) {
          users[currentUser].stats.testHistory = users[currentUser].stats.testHistory.slice(0, 50);
        }
        
        // Update best scores
        if (this.wpm > users[currentUser].stats.bestWPM) {
          users[currentUser].stats.bestWPM = this.wpm;
        }
        
        if (this.accuracy > users[currentUser].stats.bestAccuracy) {
          users[currentUser].stats.bestAccuracy = this.accuracy;
        }
        
        // Update averages
        const history = users[currentUser].stats.testHistory;
        users[currentUser].stats.averageWPM = Math.round(
          history.reduce((sum, test) => sum + test.wpm, 0) / history.length
        );
        users[currentUser].stats.averageAccuracy = Math.round(
          history.reduce((sum, test) => sum + test.accuracy, 0) / history.length
        );
        
        users[currentUser].stats.totalTimeTyping += testConfig.duration;
        
        localStorage.setItem('users', JSON.stringify(users));
        
        // Check for achievements
        this.checkAchievements(users[currentUser]);
      }
    } else {
      // Save demo results
      const demoResults = JSON.parse(localStorage.getItem('demoResults') || '[]');
      demoResults.unshift(results);
      if (demoResults.length > 10) {
        demoResults.length = 10;
      }
      localStorage.setItem('demoResults', JSON.stringify(demoResults));
    }
  }
  
  checkAchievements(userStats) {
    const achievements = [
      { id: 'first-test', name: 'First Steps', condition: () => userStats.stats.testsCompleted >= 1 },
      { id: 'speed-demon', name: 'Speed Demon', condition: () => userStats.stats.bestWPM >= 50 },
      { id: 'perfectionist', name: 'Perfectionist', condition: () => userStats.stats.bestAccuracy === 100 },
      { id: 'champion', name: 'Champion', condition: () => userStats.stats.bestWPM >= 100 },
      { id: 'consistent', name: 'Consistent', condition: () => userStats.stats.testsCompleted >= 10 },
      { id: 'marathon', name: 'Marathon', condition: () => userStats.stats.totalTimeTyping >= 3600 }
    ];
    
    achievements.forEach(achievement => {
      if (!userStats.achievements.includes(achievement.id) && achievement.condition()) {
        userStats.achievements.push(achievement.id);
        showNotification(`Achievement unlocked: ${achievement.name}!`, 'success');
      }
    });
  }
  
  showResults() {
    const modal = document.getElementById('resultModal');
    if (!modal) return;
    
    document.getElementById('finalWPM').textContent = this.wpm;
    document.getElementById('finalAccuracy').textContent = this.accuracy + '%';
    document.getElementById('finalErrors').textContent = this.errors;
    document.getElementById('finalCharacters').textContent = this.totalChars;
    
    modal.style.display = 'flex';
  }
}

// Global typing test instance
let typingTest;

// ========== TEST CONTROLS ==========
function startTest() {
  if (typingTest) {
    typingTest.start();
  }
}

function resetTest() {
  if (typingTest) {
    typingTest.reset();
  }
}

function togglePause() {
  if (typingTest) {
    typingTest.pause();
  }
}

function startNewTest() {
  if (typingTest) {
    typingTest.reset();
  }
  closeResults();
}

function closeResults() {
  const modal = document.getElementById('resultModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// ========== SETTINGS MANAGEMENT ==========
function initializeSettings() {
  // Time settings
  const timeButtons = document.querySelectorAll('[data-time]');
  timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      testConfig.duration = parseInt(btn.dataset.time);
      testState.timeLeft = testConfig.duration;
      
      if (document.getElementById('timer')) {
        document.getElementById('timer').textContent = testConfig.duration;
      }
      
      if (typingTest) {
        typingTest.reset();
      }
    });
  });
  
  // Text type settings
  const textButtons = document.querySelectorAll('[data-text]');
  textButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      textButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      testConfig.textType = btn.dataset.text;
      
      if (typingTest) {
        typingTest.reset();
      }
    });
  });
  
  // Difficulty settings
  const difficultyButtons = document.querySelectorAll('[data-difficulty]');
  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      testConfig.difficulty = btn.dataset.difficulty;
      
      if (typingTest) {
        typingTest.reset();
      }
    });
  });
}

// ========== PAGE INITIALIZATION ==========
function initializePractice() {
  initializeSettings();
  
  // Initialize typing test
  typingTest = new TypingTest();
  typingTest.loadText();
  
  // Update user name in navigation
  updateUserName();
}

function loadDashboardData() {
  updateUserName();
  
  if (currentUser && !demoMode) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userStats = users[currentUser]?.stats;
    
    if (userStats) {
      document.getElementById('avgWPM').textContent = userStats.averageWPM || 0;
      document.getElementById('avgAccuracy').textContent = (userStats.averageAccuracy || 0) + '%';
      document.getElementById('testCount').textContent = userStats.testsCompleted || 0;
      document.getElementById('bestWPM').textContent = userStats.bestWPM || 0;
      
      // Load test history
      loadTestHistory(userStats.testHistory || []);
      
      // Update achievements
      updateAchievements(users[currentUser].achievements || []);
    }
  } else if (demoMode) {
    // Load demo data
    const demoResults = JSON.parse(localStorage.getItem('demoResults') || '[]');
    if (demoResults.length > 0) {
      const avgWPM = Math.round(demoResults.reduce((sum, test) => sum + test.wpm, 0) / demoResults.length);
      const avgAcc = Math.round(demoResults.reduce((sum, test) => sum + test.accuracy, 0) / demoResults.length);
      const bestWPM = Math.max(...demoResults.map(test => test.wpm));
      
      document.getElementById('avgWPM').textContent = avgWPM;
      document.getElementById('avgAccuracy').textContent = avgAcc + '%';
      document.getElementById('testCount').textContent = demoResults.length;
      document.getElementById('bestWPM').textContent = bestWPM;
      
      loadTestHistory(demoResults);
    }
  }
}

function loadTestHistory(history) {
  const historyContainer = document.getElementById('testHistory');
  if (!historyContainer || !history.length) return;
  
  historyContainer.innerHTML = '';
  
  history.slice(0, 5).forEach((test, index) => {
    const testItem = document.createElement('div');
    testItem.className = 'test-item';
    testItem.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      margin-bottom: 0.5rem;
      background: #f7fafc;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    `;
    
    testItem.innerHTML = `
      <div>
        <div style="font-weight: 600; color: #2d3748;">${test.wpm} WPM</div>
        <div style="font-size: 0.9rem; color: #718096;">${test.textType} - ${test.difficulty}</div>
      </div>
      <div style="text-align: right;">
        <div style="color: #4a5568;">${test.accuracy}% accuracy</div>
        <div style="font-size: 0.8rem; color: #a0aec0;">${new Date(test.date).toLocaleDateString()}</div>
      </div>
    `;
    
    historyContainer.appendChild(testItem);
  });
}

function updateAchievements(userAchievements) {
  const achievementElements = document.querySelectorAll('.achievement');
  
  achievementElements.forEach((element, index) => {
    const achievementIds = ['first-test', 'speed-demon', 'perfectionist', 'champion'];
    const achievementId = achievementIds[index];
    
    if (userAchievements.includes(achievementId)) {
      element.classList.remove('locked');
      element.classList.add('unlocked');
    }
  });
}

function loadLeaderboardData() {
  updateUserName();
  
  // Generate sample leaderboard data
  const leaderboardData = [
    { name: 'Alex', wpm: 120, accuracy: 98, tests: 45, lastActive: '2 hours ago' },
    { name: 'Sarah', wpm: 95, accuracy: 96, tests: 32, lastActive: '1 day ago' },
    { name: 'Mike', wpm: 88, accuracy: 94, tests: 28, lastActive: '3 days ago' },
    { name: 'Emma', wpm: 82, accuracy: 97, tests: 41, lastActive: '1 week ago' },
    { name: 'David', wpm: 78, accuracy: 92, tests: 19, lastActive: '2 weeks ago' }
  ];
  
  // Add current user to leaderboard
  if (currentUser && !demoMode) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userStats = users[currentUser]?.stats;
    
    if (userStats && userStats.bestWPM > 0) {
      leaderboardData.push({
        name: currentUser,
        wpm: userStats.bestWPM,
        accuracy: userStats.bestAccuracy,
        tests: userStats.testsCompleted,
        lastActive: 'Now'
      });
    }
  }
  
  // Sort by WPM
  leaderboardData.sort((a, b) => b.wpm - a.wpm);
  
  // Update leaderboard table
  const tableBody = document.getElementById('leaderboardTableBody');
  if (tableBody) {
    tableBody.innerHTML = '';
    
    leaderboardData.forEach((user, index) => {
      const row = document.createElement('tr');
      if (user.name === currentUser) {
        row.style.background = 'rgba(102, 126, 234, 0.1)';
        row.style.fontWeight = '600';
      }
      
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.wpm}</td>
        <td>${user.accuracy}%</td>
        <td>${user.tests}</td>
        <td>${user.lastActive}</td>
      `;
      
      tableBody.appendChild(row);
    });
  }
  
  // Update personal stats
  if (currentUser && !demoMode) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userStats = users[currentUser]?.stats;
    const userRank = leaderboardData.findIndex(user => user.name === currentUser) + 1;
    
    if (userStats) {
      document.getElementById('personalBest').textContent = userStats.bestWPM || 0;
      document.getElementById('averageScore').textContent = userStats.averageWPM || 0;
      document.getElementById('testsCompleted').textContent = userStats.testsCompleted || 0;
      
      document.getElementById('userWPM').textContent = userStats.bestWPM || 0;
      document.getElementById('userAccuracy').textContent = (userStats.bestAccuracy || 0) + '%';
      document.getElementById('userRank').textContent = userRank > 0 ? '#' + userRank : '#--';
      document.getElementById('userStreak').textContent = Math.floor(Math.random() * 30) + 1; // Mock streak
    }
  }
}

function updateUserName() {
  const userNameElements = document.querySelectorAll('#currentUserName');
  userNameElements.forEach(element => {
    if (demoMode) {
      element.textContent = 'Demo User';
    } else if (currentUser) {
      element.textContent = currentUser;
    }
  });
}

// ========== FILTER FUNCTIONALITY ==========
function initializeFilters() {
  // Period filters
  const periodButtons = document.querySelectorAll('[data-period]');
  periodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      periodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Implement period filtering logic here
    });
  });
  
  // Category filters
  const categoryButtons = document.querySelectorAll('[data-category]');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Implement category filtering logic here
    });
  });
}

// Initialize filters when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFilters);
} else {
  initializeFilters();
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (event) => {
  // Only handle shortcuts when not typing in the input area
  if (event.target.id === 'inputArea') return;
  
  switch(event.key) {
    case 'Enter':
      if (event.shiftKey) {
        resetTest();
      } else {
        startTest();
      }
      event.preventDefault();
      break;
    case 'Escape':
      if (document.getElementById('resultModal').style.display === 'flex') {
        closeResults();
      }
      break;
  }
});

// ========== MOBILE SUPPORT ==========
function isMobile() {
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
  // Add mobile-specific optimizations
  document.body.classList.add('mobile');
  
  // Prevent zoom on input focus
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.style.fontSize = '16px';
  });
}

// ========== INITIALIZATION ==========
// Update current user and demo mode on page load
currentUser = localStorage.getItem('currentUser');
demoMode = localStorage.getItem('demoMode');

// Initialize page-specific functionality
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('practice.html')) {
      initializePractice();
    } else if (window.location.pathname.includes('dashboard.html')) {
      loadDashboardData();
    } else if (window.location.pathname.includes('leaderboard.html')) {
      loadLeaderboardData();
    }

    // Initialize new UI features for all pages after DOM ready
    initializeThemeToggle && initializeThemeToggle();
    initializeVoiceTyping && initializeVoiceTyping();
  });
} else {
  if (window.location.pathname.includes('practice.html')) {
    initializePractice();
  } else if (window.location.pathname.includes('dashboard.html')) {
    loadDashboardData();
  } else if (window.location.pathname.includes('leaderboard.html')) {
    loadLeaderboardData();
  }

  // Initialize new UI features for all pages
  initializeThemeToggle && initializeThemeToggle();
  initializeVoiceTyping && initializeVoiceTyping();
}

/* =========================================================
   NEW: THEME (DARK / LIGHT) TOGGLE MODULE
   - Uses #themeToggle input in header (added in practice.html)
   - Persist setting to localStorage under 'jfft_theme'
   ========================================================= */
function initializeThemeToggle() {
  try {
    const toggle = document.getElementById('themeToggle');
    const label = document.getElementById('themeLabel');
    if (!toggle) return;

    // load saved theme
    const saved = localStorage.getItem('jfft_theme') || 'light';
    document.body.classList.toggle('dark', saved === 'dark');
    toggle.checked = saved === 'dark';
    label.textContent = saved === 'dark' ? '🌙' : '☀️';

    toggle.addEventListener('change', (e) => {
      const isDark = e.target.checked;
      document.body.classList.toggle('dark', isDark);
      localStorage.setItem('jfft_theme', isDark ? 'dark' : 'light');
      label.textContent = isDark ? '🌙' : '☀️';
    });
  } catch (e) {
    console.warn('Theme toggle init failed', e);
  }
}

/* =========================================================
   NEW: VOICE TYPING MODULE
   - Adds non-repeating speech-to-text that appends to #inputArea
   - Uses finalTranscript + lastFinalLength to avoid repeats
   - Integrates with your existing TypingTest input events (dispatch 'input')
   ========================================================= */
let _voiceRecognition = null;
let _voiceListening = false;
let _voiceFinal = '';
let _voiceLastLen = 0;

function initializeVoiceTyping() {
  try {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    const inputArea = document.getElementById('inputArea');
    if (!voiceBtn || !inputArea) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SpeechRecognition) {
      voiceBtn.disabled = true;
      voiceStatus.textContent = 'Voice: Unsupported';
      return;
    }

    _voiceRecognition = new SpeechRecognition();
    _voiceRecognition.continuous = true;
    _voiceRecognition.interimResults = true;
    _voiceRecognition.lang = 'en-US';

    _voiceRecognition.onstart = () => {
      _voiceListening = true;
      voiceBtn.textContent = '🛑 Stop Voice Typing';
      voiceBtn.classList.add('active');
      voiceStatus.textContent = 'Voice: Listening...';
      // reset markers for this run
      _voiceFinal = '';
      _voiceLastLen = 0;
    };

    _voiceRecognition.onend = () => {
      _voiceListening = false;
      voiceBtn.textContent = '🎤 Start Voice Typing';
      voiceBtn.classList.remove('active');
      voiceStatus.textContent = 'Voice: Stopped';
    };

    _voiceRecognition.onerror = (e) => {
      console.warn('Voice error', e);
      voiceStatus.textContent = 'Voice: Error';
    };

    _voiceRecognition.onresult = (ev) => {
      // Collect final and interim pieces; append only newly-finalized text
      let interim = '';
      for (let i = ev.resultIndex; i < ev.results.length; ++i) {
        const res = ev.results[i];
        if (res.isFinal) {
          _voiceFinal += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }

      // Append only the new final text (avoids repeats)
      const newPart = _voiceFinal.slice(_voiceLastLen).trim();
      if (newPart) {
        // ensure spacing
        const current = inputArea.value || '';
        inputArea.value = (current + (current && !current.endsWith(' ') ? ' ' : '') + newPart).trim();

        // update marker
        _voiceLastLen = _voiceFinal.length;

        // trigger your typing logic
        inputArea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    // Toggle on button click
    voiceBtn.addEventListener('click', () => {
      if (!_voiceListening) {
        // start recognition
        try {
          _voiceFinal = '';
          _voiceLastLen = 0;
          _voiceRecognition.start();
        } catch (err) {
          console.warn('Recognition start failed', err);
        }
      } else {
        _voiceRecognition.stop();
      }
    });
  } catch (e) {
    console.warn('Voice typing init failed', e);
  }
}