// Game State
let gameState = {
    teams: [
        { name: "الفريق الأول", score: 0, lifelines: { ask: true, double: true } },
        { name: "الفريق الثاني", score: 0, lifelines: { ask: true, double: true } },
        { name: "الفريق الثالث", score: 0, lifelines: { ask: true, double: true } },
        { name: "الفريق الرابع", score: 0, lifelines: { ask: true, double: true } },
        { name: "الفريق الخامس", score: 0, lifelines: { ask: true, double: true } }
    ],
    activeTeam: 0,
    usedQuestions: [],
    currentQuestion: null,
    timerInterval: null,
    timeRemaining: 60,
    doublePointsTeam: null // Track which team activated double points
};

// Load questions from JSON
let questionsData = {};

// Category images mapping
function getCategoryImage(categoryName) {
    const imageMap = {
        "هندسة الكمبيوتر والذكاء الاصطناعي": "images/computer_main.jpg",
        "الهندسة الميكانيكية": "images/mechanical_main.jpg",
        "الهندسة المدنية": "images/civil_main.jpg",
        "الهندسة المعمارية": "images/architecture_main.jpg",
        "من أنا": "questions-image/Q2.jpeg"
    };
    return imageMap[categoryName] || "images/architecture_main.jpg";
}

// Category fallback colors
function getCategoryFallbackColor(categoryName) {
    const colorMap = {
        "هندسة الكمبيوتر والذكاء الاصطناعي": "#E63946",
        "الهندسة الميكانيكية": "#FFD93B",
        "الهندسة المدنية": "#2A9D8F",
        "الهندسة المعمارية": "#3A86FF",
        "من أنا": "#9D4EDD"
    };
    return colorMap[categoryName] || "#3A86FF";
}

// Initialize the game
async function initGame() {
    console.log('Initializing game...');
    await loadQuestions();
    console.log('Questions loaded, questionsData:', questionsData);
    loadGameState();
    console.log('Game state loaded');
    renderTeamSelectionButtons();
    console.log('Team selection buttons rendered');
    renderCategories();
    console.log('Categories rendered');
    renderTeams();
    console.log('Teams rendered');
    console.log('Game initialization complete');
}

// Load questions from questions.json
async function loadQuestions() {
    try {
        console.log('Attempting to load questions from questions.json...');
        const response = await fetch('questions.json?t=' + Date.now(), {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        questionsData = await response.json();
        console.log('Successfully loaded questions from questions.json:', questionsData);
    } catch (error) {
        console.error('Error loading questions from JSON, using embedded questions:', error);
        // Use embedded questions with images if file not found
        questionsData = getEmbeddedQuestions();
        console.log('Using embedded questions:', questionsData);
    }
    
    // Ensure questionsData is set
    if (!questionsData) {
        console.error('questionsData is still undefined, using embedded questions as fallback');
        questionsData = getEmbeddedQuestions();
    }
    
    console.log('Final questionsData:', questionsData);
}

// Embedded questions with local images
function getEmbeddedQuestions() {
    return {
        "هندسة الكمبيوتر والذكاء الاصطناعي": {
            "image": "images/computer_main.jpg",
            "questions": [
                {
                    "points": 100,
                    "question": "كم لغه يوجد للحاسوب؟",
                    "answer": "اكثر من ٧٠٠ لغه"
                },
                {
                    "points": 200,
                    "question": "ماهي اكثر لغات الحاسوب استخداما نظرا لسهولتها؟",
                    "answer": "البايثون"
                },
                {
                    "points": 300,
                    "question": "الفريق الأحمر في الأمن السيبراني مسؤول عن ماذا تحديدًا في منظومة العمل؟",
                    "answer": "مسؤول عن اختبار الاختراق والفحص الأمني من الثغرات"
                },
                {
                    "points": 400,
                    "question": "هجوم إلكتروني يعمل على محاولات عديدة لتخمين كلمة المرور، ما هو؟",
                    "answer": "Brute Force"
                }
            ]
        },
        "الهندسة الميكانيكية": {
            "image": "images/mechanical_main.jpg",
            "questions": [
                {
                    "points": 100,
                    "question": "كم نسبة استهلاك أجهزه التكييف من إجمالي استهلاك الكهرباء في الكويت؟",
                    "answer": "٧٠٪؜"
                },
                {
                    "points": 200,
                    "question": "ما اسم غاز التبريد الذي يستخدم في الدورة المغلقة داخل أجهزه التكييف؟",
                    "answer": "غاز الفريون"
                },
                {
                    "points": 300,
                    "question": "في الهندسة الميكانيكية، هناك ثلاثة أنواع رئيسية لانتقال الحرارة ماهي؟",
                    "answer": "التوصيل (Conduction)، الحمل (Convection)، الإشعاع (Radiation)"
                },
                {
                    "points": 400,
                    "question": "ما هي المكونات الأربعة الأساسية التي تشكل دورة التبريد في أجهزه التكييف؟",
                    "answer": "الضاغط (Compressor)، المكثف (Condenser)، صمام التمدد (Expansion Valve)، المبخر (Evaporator)"
                }
            ]
        },
        "الهندسة المدنية": {
            "image": "images/civil_main.jpg",
            "questions": [
                {
                    "points": 100,
                    "question": "اذكر ٣ أشياء من لبس عامل البناء",
                    "answer": "الخوذه، الفيست، حذاء الامان، كمام، نظاره، قفازات"
                },
                {
                    "points": 200,
                    "question": "اذكر ٣ من مواد البناء",
                    "answer": "رمل، حصى، اسمنت، حديد"
                },
                {
                    "points": 300,
                    "question": "اذكر أحد البنى التحتية",
                    "answer": "الصرف الصحي، تمديدات الكهرباء"
                },
                {
                    "points": 400,
                    "question": "لماذا يستخدم الحديد مع الاسمنت في الخرسانة؟",
                    "answer": "لأن الحديد يساعد في تماسك الخرسانة في حال التمدد والانكماش"
                }
            ]
        },
        "الهندسة المعمارية": {
            "image": "images/architecture_main.jpg",
            "questions": [
                {
                    "points": 100,
                    "question": "من أين بدأت العمارة؟",
                    "answer": "من الطبيعة و محاولات التكيف معها"
                },
                {
                    "points": 200,
                    "question": "ما الاسم المعماري لهذا المخطط؟",
                    "answer": "Plan",
                    "image": "questions-image/For Q2 m3mariah.jpeg"
                },
                {
                    "points": 300,
                    "question": "ماهي ثاني خطوة في وظيفة المهندس المعماري؟",
                    "answer": "دراسة المساحات وتقسيمها حسب الاحتياجات"
                },
                {
                    "points": 400,
                    "question": "ما الفائدة من استخدام مخططات الSections؟",
                    "answer": "لمعرفة الارتفاعات المحددة لكل طابق",
                    "image": "questions-image/For Q4 m3mariah.jpeg"
                }
            ]
        },
        "من أنا": {
            "image": "images/history.jpg",
            "questions": [
                {
                    "points": 200,
                    "question": "صورة مغبشة",
                    "answer": "صورة مكشوفة",
                    "image": "questions-image/Q1.jpeg",
                    "answerImage": "questions-image/Q1-A.jpeg"
                },
                {
                    "points": 200,
                    "question": "صورة مغبشة",
                    "answer": "صورة مكشوفة",
                    "image": "questions-image/Q2.jpeg",
                    "answerImage": "questions-image/Q2-A.jpeg"
                },
                {
                    "points": 200,
                    "question": "صورة مغبشة",
                    "answer": "صورة مكشوفة",
                    "image": "questions-image/Q3.jpeg",
                    "answerImage": "questions-image/Q3-A.jpeg"
                },
                {
                    "points": 200,
                    "question": "من الناقص من الصورة؟",
                    "answer": "عبدالمحسن المري",
                    "image": "questions-image/abdulmhsn almri.jpeg"
                }
            ]
        }
    };
}

// Render categories grid
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) {
        console.error('categoriesGrid element not found');
        return;
    }
    
    console.log('Rendering categories with data:', questionsData);
    console.log('questionsData type:', typeof questionsData);
    console.log('questionsData keys:', Object.keys(questionsData || {}));
    grid.innerHTML = '';
    
    if (!questionsData || Object.keys(questionsData).length === 0) {
        console.error('No questions data available');
        grid.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">لا توجد بيانات للأسئلة</div>';
        return;
    }
    
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
        categoryData.questions.forEach((question, questionIndex) => {
            const button = document.createElement('button');
            button.className = 'question-button';
            
            const questionId = `${categoryName}_${question.points}_${questionIndex}`;
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
                button.onclick = () => selectQuestion(categoryName, question, questionIndex);
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
            { key: 'double', icon: '<i data-lucide="zap"></i>', title: 'نقاط مضاعفة' }
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
                // Ask an engineer in the room - just mark as used
                break;
            case 'double':
                // Double points for this team only - just mark as used
                gameState.doublePointsTeam = teamIndex;
                break;
        }
        
        // Update display immediately
        renderTeams();
        updateLifelinesInline();
        saveGameState();
    }
}

// Select question
function selectQuestion(category, question, questionIndex) {
    // Check if a team is selected
    if (gameState.activeTeam === null || gameState.activeTeam === undefined) {
        alert('يرجى اختيار فريق أولاً!');
        return;
    }
    
    gameState.currentQuestion = {
        category: category,
        index: questionIndex,
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
                    <div class="timer-display" id="timerDisplay">1:00</div>
                </div>
                
                <div class="question-points-info">
                    <strong>${gameState.currentQuestion.points} نقطة</strong>
                </div>
            </div>
            
            <div class="question-main">
                ${gameState.currentQuestion.image ? 
                    `<div class="question-image-container">
                        <img src="${gameState.currentQuestion.image}?t=${Date.now()}" class="question-image" onerror="this.src=''; this.style.display='none'; this.parentNode.classList.add('empty');" onload="console.log('Image loaded successfully:', this.src);">
                    </div>` : 
                    ''
                }
                <div class="question-text">${gameState.currentQuestion.question}</div>
            </div>
            
            <div class="answer-section" id="answerSection">
                <div class="answer-text">${gameState.currentQuestion.answer}</div>
                ${gameState.currentQuestion.answerImage ? 
                    `<div class="answer-image-container">
                        <img src="${gameState.currentQuestion.answerImage}?t=${Date.now()}" class="answer-image" onerror="this.src=''; this.style.display='none';">
                    </div>` : 
                    ''
                }
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
        { key: 'double', icon: '<i data-lucide="zap"></i>', name: 'مضاعفة' }
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
    const questionId = `${gameState.currentQuestion.category}_${gameState.currentQuestion.points}_${gameState.currentQuestion.index}`;
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
    const questionId = `${gameState.currentQuestion.category}_${gameState.currentQuestion.points}_${gameState.currentQuestion.index}`;
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
    gameState.timeRemaining = 60;
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
        gameState.timeRemaining = 60;
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
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="engineer-help-container">
            <div class="engineer-help-header">
                <div class="help-icon">
                    <i data-lucide="users"></i>
                </div>
                <h2>اسأل مهندس</h2>
                <p>يمكنك الآن أن تسأل أي مهندس في الغرفة للمساعدة!</p>
            </div>
            
            <div class="engineer-help-content">
                <div class="help-instructions">
                    <h3>التعليمات:</h3>
                    <ul>
                        <li>اختر مهندساً من المتواجدين في الغرفة</li>
                        <li>اطرح سؤالك بوضوح</li>
                        <li>استمع للإجابة والنصائح</li>
                        <li>قرر إجابتك النهائية</li>
                    </ul>
                </div>
                
                <div class="current-question-reminder">
                    <h4>السؤال الحالي:</h4>
                    <p class="question-text-reminder">${gameState.currentQuestion.question}</p>
                    <p class="points-reminder">${gameState.currentQuestion.points} نقطة</p>
                </div>
            </div>
            
            <div class="engineer-help-actions">
                <button class="action-btn primary" onclick="returnToQuestion()">
                    <i data-lucide="arrow-right"></i> العودة للسؤال
                </button>
            </div>
        </div>
    `;
    
    // Show back button when in engineer help view
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.style.display = 'block';
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Return to question from engineer help
function returnToQuestion() {
    showQuestionView();
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

function closeLifelineOverlay() {
    const overlay = document.querySelector('.lifeline-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Reset game
function resetGame() {
    if (confirm('هل أنت متأكد من رغبتك في إعادة تعيين اللعبة بالكامل؟')) {
        gameState = {
            teams: [
                { name: "الفريق الأول", score: 0, lifelines: { ask: true, double: true } },
                { name: "الفريق الثاني", score: 0, lifelines: { ask: true, double: true } },
                { name: "الفريق الثالث", score: 0, lifelines: { ask: true, double: true } },
                { name: "الفريق الرابع", score: 0, lifelines: { ask: true, double: true } },
                { name: "الفريق الخامس", score: 0, lifelines: { ask: true, double: true } }
            ],
            activeTeam: 0,
            usedQuestions: [],
            currentQuestion: null,
            timerInterval: null,
            timeRemaining: 60,
            doublePointsTeam: null
        };
        
        localStorage.removeItem('sinGameState');
        renderCategories();
        renderTeams();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded, calling initGame...');
    initGame();
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('DOM still loading, waiting for DOMContentLoaded...');
} else {
    console.log('DOM already loaded, calling initGame immediately...');
    initGame();
}