// Game State
let gameState = {
    teams: [
        { name: "الفريق الأول", score: 0, lifelines: { ask: true, double: true, google: true } },
        { name: "الفريق الثاني", score: 0, lifelines: { ask: true, double: true, google: true } },
        { name: "الفريق الثالث", score: 0, lifelines: { ask: true, double: true, google: true } },
        { name: "الفريق الرابع", score: 0, lifelines: { ask: true, double: true, google: true } },
        { name: "الفريق الخامس", score: 0, lifelines: { ask: true, double: true, google: true } }
    ],
    activeTeam: 0,
    usedQuestions: [],
    currentQuestion: null,
    timerInterval: null,
    timeRemaining: 80,
    doublePointsTeam: null, // Track which team activated double points
    googleTimerInterval: null,
    googleTimeRemaining: 60
};

// Load questions from JSON
let questionsData = {};

// Category images mapping
function getCategoryImage(categoryName) {
    const imageMap = {
        "الهندسة المعمارية": "images/architecture_main.jpg",
        "الهندسة المدنية": "images/civil_main.jpg",
        "الهندسة الميكانيكية": "images/mechanical_main.jpg",
        "الهندسة الكهربائية": "images/electrical_main.jpg",
        "هندسة الحاسوب": "images/computer_main.jpg",
        "الأمن السيبراني": "images/cybersecurity_main.jpg"
    };
    return imageMap[categoryName] || "images/architecture_main.jpg";
}

// Category fallback colors
function getCategoryFallbackColor(categoryName) {
    const colorMap = {
        "الهندسة المعمارية": "#3A86FF",
        "الهندسة المدنية": "#2A9D8F",
        "الهندسة الميكانيكية": "#FFD93B",
        "الهندسة الكهربائية": "#9D4EDD",
        "هندسة الحاسوب": "#E63946",
        "الأمن السيبراني": "#000000"
    };
    return colorMap[categoryName] || "#3A86FF";
}

// Initialize the game
async function initGame() {
    await loadQuestions();
    loadGameState();
    renderTeamSelectionButtons();
    renderCategories();
    renderTeams();
}

// Load questions from questions.json
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        questionsData = await response.json();
    } catch (error) {
        console.error('Error loading questions:', error);
        // Use embedded questions with images if file not found
        questionsData = getEmbeddedQuestions();
    }
}

// Embedded questions with local images
function getEmbeddedQuestions() {
    return {
        "الهندسة المعمارية": {
            "image": "images/architecture_main.jpg",
            "questions": [
                {
                    "points": 200,
                    "question": "ما هو اسم أطول برج في العالم؟",
                    "answer": "برج خليفة",
                    "image": "images/burj_khalifa.jpg"
                },
                {
                    "points": 400,
                    "question": "ما هو الشكل الهندسي الذي يعتبر أقوى شكل في البناء؟",
                    "answer": "المثلث",
                    "image": "images/triangle.jpg"
                },
                {
                    "points": 600,
                    "question": "ما هي المادة الأساسية المستخدمة في بناء ناطحات السحاب؟",
                    "answer": "الزجاج والفولاذ",
                    "image": "images/skyscrapers.jpg"
                }
            ]
        },
        "الهندسة المدنية": {
            "image": "images/civil_main.jpg",
            "questions": [
                {
                    "points": 200,
                    "question": "ما هي المادة الأساسية في صنع الخرسانة؟",
                    "answer": "الإسمنت",
                    "image": "images/cement.jpg"
                },
                {
                    "points": 400,
                    "question": "ما هو اسم أطول جسر في العالم؟",
                    "answer": "جسر دانيانغ-كونشان",
                    "image": "images/civil_400_new.jpg"
                },
                {
                    "points": 600,
                    "question": "في أي مادة يتم قياس قوة الضغط؟",
                    "answer": "الباسكال",
                    "image": "images/pressure.jpg"
                }
            ]
        },
        "الهندسة الميكانيكية": {
            "image": "images/mechanical_main.jpg",
            "questions": [
                {
                    "points": 200,
                    "question": "ما هو اسم القوة التي تقاوم الحركة؟",
                    "answer": "الاحتكاك",
                    "image": "images/mechanical_200_new.jpg"
                },
                {
                    "points": 400,
                    "question": "ما هي وحدة قياس القوة؟",
                    "answer": "نيوتن",
                    "image": "images/mechanical_400_new.jpg"
                },
                {
                    "points": 600,
                    "question": "ما هو اسم المحرك الذي يحول الحرارة إلى حركة؟",
                    "answer": "محرك الاحتراق الداخلي",
                    "image": "images/mechanical_600_new.jpg"
                }
            ]
        },
        "الهندسة الكهربائية": {
            "image": "images/electrical_main.jpg",
            "questions": [
                {
                    "points": 200,
                    "question": "ما هي وحدة قياس التيار الكهربائي؟",
                    "answer": "أمبير",
                    "image": "images/ampere.jpg"
                },
                {
                    "points": 400,
                    "question": "ما هو اسم الجهاز الذي يقيس الجهد الكهربائي؟",
                    "answer": "فولتميتر",
                    "image": "images/voltmeter.jpg"
                },
                {
                    "points": 600,
                    "question": "ما هو قانون أوم في الكهرباء؟",
                    "answer": "V = I × R",
                    "image": "images/electrical_600.jpg"
                }
            ]
        },
        "هندسة الحاسوب": {
            "image": "images/computer_main.jpg",
            "questions": [
                {
                    "points": 200,
                    "question": "ما هو اسم عقل الحاسوب؟",
                    "answer": "المعالج (CPU)",
                    "image": "images/cpu.jpg"
                },
                {
                    "points": 400,
                    "question": "ما هي وحدة قياس سرعة المعالج؟",
                    "answer": "هيرتز (Hz)",
                    "image": "images/computer_400.jpg"
                },
                {
                    "points": 600,
                    "question": "ما هو اسم لغة البرمجة المشهورة بالثعبان؟",
                    "answer": "Python",
                    "image": "images/python.jpg"
                }
            ]
        },
        "الأمن السيبراني": {
            "image": "images/cybersecurity_main.jpg",
            "questions": [
                {
                    "points": 200,
                    "question": "ما هو اسم البرنامج الضار الذي يخفي نفسه؟",
                    "answer": "حصان طروادة",
                    "image": "images/trojan.jpg"
                },
                {
                    "points": 400,
                    "question": "ما هو المصطلح المستخدم للهجمات الإلكترونية؟",
                    "answer": "القرصنة",
                    "image": "images/hacking.jpg"
                },
                {
                    "points": 600,
                    "question": "ما هو اسم عملية تشفير البيانات؟",
                    "answer": "التشفير",
                    "image": "images/encryption.jpg"
                }
            ]
        }
    };
}

// Render categories grid
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = '';
    
    for (const [categoryName, categoryData] of Object.entries(questionsData)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.setAttribute('data-category', categoryName);
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'category-header';
        
        // Add background image
        const img = document.createElement('img');
        img.src = getCategoryImage(categoryName);
        img.className = 'category-image';
        img.onerror = () => { 
            img.style.display = 'none'; 
            headerDiv.style.background = getCategoryFallbackColor(categoryName);
        };
        headerDiv.appendChild(img);
        
        // Add overlay
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'category-overlay';
        headerDiv.appendChild(overlayDiv);
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'category-name';
        nameDiv.textContent = categoryName;
        headerDiv.appendChild(nameDiv);
        
        categoryDiv.appendChild(headerDiv);
        
        // Add question buttons
        categoryData.questions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'question-button';
            
            const questionId = `${categoryName}_${question.points}`;
            if (gameState.usedQuestions.includes(questionId)) {
                button.classList.add('used');
                
                // Add status indicator with team number
                if (gameState.correctAnswers && gameState.correctAnswers.includes(questionId)) {
                    // Find which team got this correct
                    const teamNumber = getTeamNumberForQuestion(questionId, 'correct');
                    button.innerHTML = `${question.points} <span class="status-icon correct">✓${teamNumber}</span>`;
                } else if (gameState.incorrectAnswers && gameState.incorrectAnswers.includes(questionId)) {
                    // Find which team got this incorrect
                    const teamNumber = getTeamNumberForQuestion(questionId, 'incorrect');
                    button.innerHTML = `${question.points} <span class="status-icon incorrect">✗${teamNumber}</span>`;
                } else {
                    button.textContent = question.points;
                }
            } else {
                button.textContent = question.points;
                button.onclick = () => selectQuestion(categoryName, question);
            }
            
            categoryDiv.appendChild(button);
        });
        
        grid.appendChild(categoryDiv);
    }
}

// Render teams sidebar
function renderTeams() {
    const container = document.getElementById('teamsContainer');
    container.innerHTML = '';
    
    gameState.teams.forEach((team, index) => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        if (index === gameState.activeTeam) {
            teamCard.classList.add('active');
        }
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'team-header';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'team-name';
        nameDiv.textContent = team.name;
        
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'team-score';
        scoreDiv.textContent = `${team.score} نقطة`;
        
        headerDiv.appendChild(nameDiv);
        headerDiv.appendChild(scoreDiv);
        
        const lifelinesDiv = document.createElement('div');
        lifelinesDiv.className = 'team-lifelines';
        
        // Add lifeline buttons
        const lifelines = [
            { key: 'ask', icon: '<i data-lucide="users"></i>', title: 'اسأل مهندس' },
            { key: 'double', icon: '<i data-lucide="zap"></i>', title: 'نقاط مضاعفة' },
            { key: 'google', icon: '<i data-lucide="search"></i>', title: 'بحث جوجل 60ث' }
        ];
        
        lifelines.forEach(lifeline => {
            const span = document.createElement('span');
            span.className = 'lifeline';
            span.innerHTML = lifeline.icon;
            span.title = lifeline.title;
            
            if (!team.lifelines[lifeline.key]) {
                span.classList.add('used');
            }
            
            lifelinesDiv.appendChild(span);
        });
        
        teamCard.appendChild(headerDiv);
        teamCard.appendChild(lifelinesDiv);
        // Remove onclick - make it read-only
        
        container.appendChild(teamCard);
    });
    
    // Initialize Lucide icons for teams
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Set active team
function setActiveTeam(index) {
    gameState.activeTeam = index;
    renderTeams();
    saveGameState();
}

// Use lifeline
function useLifeline(teamIndex, lifelineKey) {
    if (gameState.teams[teamIndex].lifelines[lifelineKey]) {
        gameState.teams[teamIndex].lifelines[lifelineKey] = false;
        
        switch(lifelineKey) {
            case 'ask':
                // Ask an engineer in the room
                showEngineerHelp();
                break;
            case 'double':
                // Double points for this team only
                gameState.doublePointsTeam = teamIndex;
                showDoublePointsNotification();
                break;
            case 'google':
                // 20 second Google search timer
                showGoogleTimer();
                break;
        }
        
        renderTeams();
        updateLifelinesBar();
        saveGameState();
    }
}

// Select question
function selectQuestion(category, question) {
    // Check if a team is selected
    if (gameState.activeTeam === null || gameState.activeTeam === undefined) {
        alert('يرجى اختيار فريق أولاً!');
        return;
    }
    
    gameState.currentQuestion = {
        category: category,
        ...question
    };
    
    // Create and show question view
    showQuestionView();
}

// Show question view
function showQuestionView() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="question-view-container">
            <div class="question-top-bar">
                <div class="lifelines-section" id="lifelinesSection">
                    <div class="lifelines-inline" id="lifelinesInline">
                        <!-- Lifelines will be populated here -->
                    </div>
                </div>
                
                <div class="timer-container">
                    <button class="timer-btn" onclick="resetTimer()"><i data-lucide="rotate-ccw"></i></button>
                    <div class="timer-display" id="timerDisplay">1:20</div>
                </div>
                
                <div class="question-points-info">
                    <strong>${gameState.currentQuestion.points} نقطة</strong>
                </div>
            </div>
            
            <div class="question-main">
                <div class="question-image-container">
                    ${gameState.currentQuestion.image ? 
                        `<img src="${gameState.currentQuestion.image}" class="question-image" onerror="this.src=''; this.style.display='none'; this.parentNode.classList.add('empty');" onload="console.log('Image loaded successfully:', this.src);">` : 
                        '<div class="image-placeholder">لا توجد صورة</div>'
                    }
                </div>
                <div class="question-text">${gameState.currentQuestion.question}</div>
            </div>
            
            <div class="answer-section" id="answerSection">
                <div class="answer-text">${gameState.currentQuestion.answer}</div>
            </div>
            
            <div class="question-actions">
                <button class="action-btn primary" onclick="revealAnswer()" id="revealBtn">
                    <i data-lucide="eye"></i> إظهار الإجابة
                </button>
                <div class="answer-buttons" id="answerButtons" style="display: none;">
                    <button class="action-btn success" onclick="markCorrect()">
                        <i data-lucide="check"></i> صحيح
                    </button>
                    <button class="action-btn danger" onclick="markIncorrect()">
                        <i data-lucide="x"></i> خاطئ
                    </button>
                </div>
            </div>
        </div>
    `;
    
    resetTimer();
    startTimer();
    updateLifelinesInline();
    
    // Show back button when in question view
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.style.display = 'block';
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show main categories view
function showMainView() {
    // Stop timer when returning to main view
    pauseTimer();
    
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="team-selection-bar">
            <h3>\u0627\u062e\u062a\u0631 \u0627\u0644\u0641\u0631\u064a\u0642:</h3>
            <div class="team-selection-buttons" id="teamSelectionButtons">
                <!-- \u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u0641\u0631\u0642 \u0633\u064a\u062a\u0645 \u0625\u0646\u0634\u0627\u0624\u0647\u0627 \u062a\u0644\u0642\u0627\u0626\u064a\u0627\u064b -->
            </div>
        </div>
        <div class="categories-grid" id="categoriesGrid">
            <!-- Categories will be dynamically loaded here -->
        </div>
    `;
    
    renderTeamSelectionButtons();
    renderCategories();
    
    // Hide back button when in main view
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.style.display = 'none';
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Render team selection buttons
function renderTeamSelectionButtons() {
    const container = document.getElementById('teamSelectionButtons');
    if (!container) return;
    
    container.innerHTML = '';
    
    gameState.teams.forEach((team, index) => {
        const button = document.createElement('button');
        button.className = 'team-select-button';
        button.textContent = `الفريق ${index + 1}`;
        button.onclick = () => selectMainTeam(index);
        
        if (gameState.activeTeam === index) {
            button.classList.add('selected');
        }
        
        container.appendChild(button);
    });
}

// Select main team (from main page)
function selectMainTeam(teamIndex) {
    gameState.activeTeam = teamIndex;
    renderTeamSelectionButtons();
    renderTeams();
    saveGameState();
}

// Select playing team (simplified)
function selectPlayingTeam(teamIndex) {
    if (teamIndex === "") return;
    
    gameState.activeTeam = parseInt(teamIndex);
    updateLifelinesBar();
    renderTeams();
}

// Update lifelines inline (new function for top bar)
function updateLifelinesInline() {
    const lifelinesInline = document.getElementById('lifelinesInline');
    if (!lifelinesInline || gameState.activeTeam === null) return;
    
    const team = gameState.teams[gameState.activeTeam];
    const lifelines = [
        { key: 'ask', icon: '<i data-lucide="users"></i>', name: 'اسأل مهندس' },
        { key: 'double', icon: '<i data-lucide="zap"></i>', name: 'مضاعفة' },
        { key: 'google', icon: '<i data-lucide="search"></i>', name: 'جوجل' }
    ];
    
    lifelinesInline.innerHTML = lifelines.map(lifeline => `
        <button class="lifeline-inline-btn ${!team.lifelines[lifeline.key] ? 'used' : ''}" 
                onclick="useLifeline(${gameState.activeTeam}, '${lifeline.key}')"
                ${!team.lifelines[lifeline.key] ? 'disabled' : ''}>
            ${lifeline.icon} ${lifeline.name}
        </button>
    `).join('');
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Mark as correct
function markCorrect() {
    if (gameState.activeTeam === null) {
        alert('يرجى اختيار فريق أولاً!');
        return;
    }
    
    pauseTimer();
    
    // Calculate points (double if active)
    let pointsToAward = gameState.currentQuestion.points;
    if (gameState.doublePointsTeam === gameState.activeTeam) {
        pointsToAward *= 2;
        gameState.doublePointsTeam = null;
    }
    
    // Award points
    gameState.teams[gameState.activeTeam].score += pointsToAward;
    
    // Mark question as used with correct status
    const questionId = `${gameState.currentQuestion.category}_${gameState.currentQuestion.points}`;
    if (!gameState.usedQuestions.includes(questionId)) {
        gameState.usedQuestions.push(questionId);
    }
    
    // Add to correct answers tracking with team info
    if (!gameState.correctAnswers) gameState.correctAnswers = [];
    if (!gameState.questionTeamMap) gameState.questionTeamMap = {};
    gameState.correctAnswers.push(questionId);
    gameState.questionTeamMap[questionId] = { team: gameState.activeTeam, status: 'correct' };
    
    // Save state first
    saveGameState();
    
    // Update teams display immediately
    renderTeams();
    
    // Show success message
    const teamNumber = gameState.activeTeam + 1;
    const message = pointsToAward > gameState.currentQuestion.points ? 
        `🎉 نقاط مضاعفة! تم منح ${pointsToAward} نقطة للفريق ${teamNumber}!` :
        `✅ تم منح ${pointsToAward} نقطة للفريق ${teamNumber}!`;
    
    alert(message);
    
    // Return to main view
    showMainView();
}

// Mark as incorrect  
function markIncorrect() {
    pauseTimer();
    
    // Mark question as used with incorrect status
    const questionId = `${gameState.currentQuestion.category}_${gameState.currentQuestion.points}`;
    if (!gameState.usedQuestions.includes(questionId)) {
        gameState.usedQuestions.push(questionId);
    }
    
    // Add to incorrect answers tracking with team info
    if (!gameState.incorrectAnswers) gameState.incorrectAnswers = [];
    if (!gameState.questionTeamMap) gameState.questionTeamMap = {};
    gameState.incorrectAnswers.push(questionId);
    gameState.questionTeamMap[questionId] = { team: gameState.activeTeam, status: 'incorrect' };
    
    // Clear double points if not used
    if (gameState.doublePointsTeam !== null) {
        gameState.doublePointsTeam = null;
    }
    
    // Save state
    saveGameState();
    
    const teamNumber = gameState.activeTeam + 1;
    alert(`❌ تم تصنيف السؤال كخاطئ - لم يتم منح نقاط للفريق ${teamNumber}.`);
    
    // Return to main view
    showMainView();
}

// Helper function to get team number for question
function getTeamNumberForQuestion(questionId, status) {
    if (gameState.questionTeamMap && gameState.questionTeamMap[questionId]) {
        return gameState.questionTeamMap[questionId].team + 1; // Convert to 1-based numbering
    }
    return '';
}

// Go back to categories (emergency back button)
function goBackToCategories() {
    pauseTimer();
    showMainView();
}

// Update lifelines display in question view
function updateQuestionLifelines() {
    const lifelinesDiv = document.getElementById('questionLifelines');
    if (!lifelinesDiv || gameState.activeTeam === null) return;
    
    const team = gameState.teams[gameState.activeTeam];
    const lifelines = [
        { key: 'ask', icon: '🧑‍🤝‍🧑', title: 'Ask an Engineer' },
        { key: 'double', icon: 'x2', title: 'Double Points' },
        { key: 'google', icon: '🌐', title: '20s Google search' }
    ];
    
    lifelinesDiv.innerHTML = `
        <div class="lifeline-buttons">
            ${lifelines.map(lifeline => `
                <button class="lifeline-button ${!team.lifelines[lifeline.key] ? 'used' : ''}" 
                        onclick="useLifeline(${gameState.activeTeam}, '${lifeline.key}')"
                        ${!team.lifelines[lifeline.key] ? 'disabled' : ''}>
                    <span class="lifeline-icon">${lifeline.icon}</span>
                    <span class="lifeline-name">${lifeline.title}</span>
                </button>
            `).join('')}
        </div>
    `;
}


// Timer functions
function startTimer() {
    if (!gameState.timerInterval) {
        gameState.timerInterval = setInterval(() => {
            gameState.timeRemaining--;
            updateTimerDisplay();
            
            if (gameState.timeRemaining <= 0) {
                pauseTimer();
                alert('انتهى الوقت!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function resetTimer() {
    pauseTimer();
    gameState.timeRemaining = 80;
    updateTimerDisplay();
    startTimer();
}

function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    if (display) {
        const minutes = Math.floor(gameState.timeRemaining / 60);
        const seconds = gameState.timeRemaining % 60;
        display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Keep color black always
        display.style.color = '#000000';
    }
}

// Reveal answer (simplified)
function revealAnswer() {
    const answerSection = document.getElementById('answerSection');
    const answerButtons = document.getElementById('answerButtons');
    const revealBtn = document.getElementById('revealBtn');
    
    if (answerSection) {
        answerSection.style.display = 'block';
        answerSection.classList.add('revealed');
    }
    
    if (answerButtons) {
        answerButtons.style.display = 'flex';
    }
    
    if (revealBtn) {
        revealBtn.style.display = 'none';
    }
}

// Award points to specific team
function awardPointsToTeam(teamIndex) {
    pauseTimer();
    
    // Calculate points (double only if this team activated double points)
    let pointsToAward = gameState.currentQuestion.points;
    if (gameState.doublePointsTeam === teamIndex) {
        pointsToAward *= 2;
        gameState.doublePointsTeam = null; // Reset after use
    }
    
    // Award points to the selected team
    gameState.teams[teamIndex].score += pointsToAward;
    
    // Mark question as used
    const questionId = `${gameState.currentQuestion.category}_${gameState.currentQuestion.points}`;
    if (!gameState.usedQuestions.includes(questionId)) {
        gameState.usedQuestions.push(questionId);
    }
    
    // Return to main categories view
    showMainView();
    saveGameState();
    
    // Show confirmation
    const message = pointsToAward > gameState.currentQuestion.points ? 
        `DOUBLE POINTS! ${pointsToAward} points awarded to ${gameState.teams[teamIndex].name}!` :
        `${pointsToAward} points awarded to ${gameState.teams[teamIndex].name}!`;
    alert(message);
}

// Close question without awarding points
function closeQuestionWithoutPoints() {
    pauseTimer();
    
    // Clear double points if not used
    if (gameState.doublePointsTeam !== null) {
        gameState.doublePointsTeam = null;
        alert('Double points expired - question not answered by the team who activated it!');
    }
    
    // Mark question as used
    const questionId = `${gameState.currentQuestion.category}_${gameState.currentQuestion.points}`;
    if (!gameState.usedQuestions.includes(questionId)) {
        gameState.usedQuestions.push(questionId);
    }
    
    // Return to main categories view
    showMainView();
    saveGameState();
}

// Close without marking as used (for back button before reveal)
function closeWithoutMarking() {
    pauseTimer();
    
    // Return to main categories view
    showMainView();
}

// Close question and award points (for backwards compatibility)
function closeQuestion() {
    closeWithoutMarking();
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('sinGameState', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('sinGameState');
    if (saved) {
        const savedState = JSON.parse(saved);
        // Merge with default state to ensure all properties exist
        gameState = { ...gameState, ...savedState };
        
        // Reset timer when loading game state (timer should only run during questions)
        gameState.timeRemaining = 80;
        pauseTimer();
        
        // Update team names to Arabic if they're still in English
        const arabicNames = ["الفريق الأول", "الفريق الثاني", "الفريق الثالث", "الفريق الرابع", "الفريق الخامس"];
        gameState.teams.forEach((team, index) => {
            if (team.name.startsWith("Team ") || team.name === `الفريق ${index + 1}`) {
                team.name = arabicNames[index];
            }
        });
    }
}

// Lifeline Helper Functions
function showEngineerHelp() {
    const overlay = document.createElement('div');
    overlay.className = 'lifeline-overlay';
    overlay.innerHTML = `
        <div class="lifeline-modal">
            <h2>🧑‍🤝‍🧑 اسأل مهندس</h2>
            <p>يمكنك الآن أن تسأل أي مهندس في الغرفة للمساعدة!</p>
            <button class="action-button" onclick="closeLifelineOverlay()">متابعة</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

function showDoublePointsNotification() {
    const teamName = gameState.teams[gameState.doublePointsTeam].name;
    const overlay = document.createElement('div');
    overlay.className = 'lifeline-overlay';
    overlay.innerHTML = `
        <div class="lifeline-modal">
            <h2>x2 تم تفعيل النقاط المضاعفة!</h2>
            <p><strong>${teamName}</strong> قام بتفعيل النقاط المضاعفة!</p>
            <p>إذا أجاب ${teamName} بشكل صحيح: ${gameState.currentQuestion.points} × 2 = ${gameState.currentQuestion.points * 2} نقطة</p>
            <p class="warning">⚠️ النقاط المضاعفة تنطبق فقط إذا أجاب ${teamName} بشكل صحيح!</p>
            <button class="action-button" onclick="closeLifelineOverlay()">متابعة</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

function showGoogleTimer() {
    gameState.googleTimeRemaining = 60;
    
    const overlay = document.createElement('div');
    overlay.className = 'lifeline-overlay google-timer';
    overlay.innerHTML = `
        <div class="lifeline-modal google-modal">
            <h2>🌐 وقت بحث جوجل!</h2>
            <div class="google-timer-display" id="googleTimerDisplay">60</div>
            <p>ابحث في الإنترنت الآن!</p>
            <button class="action-button" onclick="closeLifelineOverlay()" style="margin-top: 20px; background: #fff; color: #000; border: 2px solid #fff;">إنهاء البحث</button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Start Google timer
    gameState.googleTimerInterval = setInterval(() => {
        gameState.googleTimeRemaining--;
        const display = document.getElementById('googleTimerDisplay');
        if (display) {
            display.textContent = gameState.googleTimeRemaining;
        }
        
        if (gameState.googleTimeRemaining <= 0) {
            clearInterval(gameState.googleTimerInterval);
            gameState.googleTimerInterval = null;
            closeLifelineOverlay();
            alert('انتهى وقت بحث جوجل!');
        }
    }, 1000);
}

function closeLifelineOverlay() {
    const overlay = document.querySelector('.lifeline-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Clear Google timer if active
    if (gameState.googleTimerInterval) {
        clearInterval(gameState.googleTimerInterval);
        gameState.googleTimerInterval = null;
    }
}

// Reset game
function resetGame() {
    if (confirm('هل أنت متأكد من رغبتك في إعادة تعيين اللعبة بالكامل؟')) {
        gameState = {
            teams: [
                { name: "الفريق الأول", score: 0, lifelines: { ask: true, double: true, google: true } },
                { name: "الفريق الثاني", score: 0, lifelines: { ask: true, double: true, google: true } },
                { name: "الفريق الثالث", score: 0, lifelines: { ask: true, double: true, google: true } },
                { name: "الفريق الرابع", score: 0, lifelines: { ask: true, double: true, google: true } },
                { name: "الفريق الخامس", score: 0, lifelines: { ask: true, double: true, google: true } }
            ],
            activeTeam: 0,
            usedQuestions: [],
            currentQuestion: null,
            timerInterval: null,
            timeRemaining: 80,
            doublePointsTeam: null,
            googleTimerInterval: null,
            googleTimeRemaining: 60
        };
        
        localStorage.removeItem('sinGameState');
        renderCategories();
        renderTeams();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);