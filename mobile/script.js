// Mobile Game State
let gameState = {
    teams: [
        { name: 'الفريق الأول', score: 0, lifelines: { ask: true, double: true, google: true } },
        { name: 'الفريق الثاني', score: 0, lifelines: { ask: true, double: true, google: true } },
        { name: 'الفريق الثالث', score: 0, lifelines: { ask: true, double: true, google: true } },
        { name: 'الفريق الرابع', score: 0, lifelines: { ask: true, double: true, google: true } },
        { name: 'الفريق الخامس', score: 0, lifelines: { ask: true, double: true, google: true } }
    ],
    activeTeam: null,
    currentQuestion: null,
    usedQuestions: [],
    correctAnswers: [],
    incorrectAnswers: [],
    timer: 120,
    timerInterval: null,
    isTimerRunning: false
};

let questionsData = {};

// Initialize Mobile Game
async function initMobileGame() {
    await loadQuestions();
    loadGameState();
    renderTeamSelection();
    updateActiveTeamInfo();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Load questions from questions.json
async function loadQuestions() {
    try {
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
        console.log('Loaded questions from questions.json:', questionsData);
    } catch (error) {
        console.error('Error loading questions:', error);
        questionsData = getEmbeddedQuestions();
        console.log('Using embedded questions:', questionsData);
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
                    "question": "ما هي المادة الأساسية المستخدمة في صنع الخرسانة المسلحة؟",
                    "answer": "الإسمنت",
                    "image": "images/cement.jpg"
                },
                {
                    "points": 400,
                    "question": "ما هو اسم أطول جسر في العالم يربط بين مدينتين؟",
                    "answer": "جسر دانيانغ-كونشان",
                    "image": "images/civil_400.jpg"
                },
                {
                    "points": 600,
                    "question": "في أي وحدة قياس يتم قياس قوة الضغط على المواد؟",
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
                    "question": "ما هو اسم القوة التي تقاوم الحركة بين الأسطح؟",
                    "answer": "قوة الاحتكاك",
                    "image": "images/mechanical_200.jpg"
                },
                {
                    "points": 400,
                    "question": "ما هي وحدة قياس القوة في النظام الدولي؟",
                    "answer": "نيوتن",
                    "image": "images/mechanical_400_new.jpg"
                },
                {
                    "points": 600,
                    "question": "ما هو نوع المحرك الذي يحول الطاقة الحرارية إلى حركة ميكانيكية؟",
                    "answer": "محرك الاحتراق الداخلي",
                    "image": "images/mechanical_600.jpg"
                }
            ]
        },
        "الهندسة الكهربائية": {
            "image": "images/electrical_600.jpg",
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
                    "image": "images/ohm_law.jpg"
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
                    "image": "images/computer_main.jpg"
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

// Render Team Selection Screen
function renderTeamSelection() {
    const container = document.getElementById('teamButtons');
    container.innerHTML = '';
    
    gameState.teams.forEach((team, index) => {
        const button = document.createElement('button');
        button.className = 'team-button';
        button.textContent = team.name;
        button.onclick = () => selectTeam(index);
        
        if (gameState.activeTeam === index) {
            button.classList.add('active');
        }
        
        container.appendChild(button);
    });
}

// Select Team
function selectTeam(teamIndex) {
    gameState.activeTeam = teamIndex;
    renderTeamSelection();
    updateActiveTeamInfo();
    showCategories();
}

// Show Categories Screen
function showCategories() {
    document.getElementById('teamSelectionScreen').style.display = 'none';
    document.getElementById('questionScreen').style.display = 'none';
    document.getElementById('categoriesScreen').style.display = 'block';
    
    renderCategories();
}

// Show Team Selection
function showTeamSelection() {
    document.getElementById('categoriesScreen').style.display = 'none';
    document.getElementById('questionScreen').style.display = 'none';
    document.getElementById('teamSelectionScreen').style.display = 'block';
}

// Render Categories
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = '';
    
    for (const [categoryName, categoryData] of Object.entries(questionsData)) {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.onclick = () => showCategoryQuestions(categoryName, categoryData);
        
        const img = document.createElement('img');
        img.src = categoryData.image;
        img.className = 'category-image';
        img.onerror = () => { 
            img.style.display = 'none'; 
            categoryCard.style.background = '#667eea';
        };
        
        const info = document.createElement('div');
        info.className = 'category-info';
        info.innerHTML = `
            <div class="category-name">${categoryName}</div>
            <div class="question-buttons">
                <span class="question-btn">200</span>
                <span class="question-btn">400</span>
                <span class="question-btn">600</span>
            </div>
        `;
        
        categoryCard.appendChild(img);
        categoryCard.appendChild(info);
        grid.appendChild(categoryCard);
    }
}

// Show Category Questions
function showCategoryQuestions(categoryName, categoryData) {
    const container = document.getElementById('categoriesGrid');
    container.innerHTML = '';
    
    // Add back button
    const backBtn = document.createElement('button');
    backBtn.className = 'back-button';
    backBtn.innerHTML = '<i data-lucide="arrow-left"></i>';
    backBtn.onclick = () => renderCategories();
    container.appendChild(backBtn);
    
    // Add category title
    const title = document.createElement('h3');
    title.textContent = categoryName;
    title.style.color = 'white';
    title.style.marginBottom = '2rem';
    title.style.textAlign = 'center';
    container.appendChild(title);
    
    // Add question buttons
    categoryData.questions.forEach(question => {
        const button = document.createElement('button');
        button.className = 'question-btn';
        button.textContent = question.points;
        
        const questionId = `${categoryName}_${question.points}`;
        if (gameState.usedQuestions.includes(questionId)) {
            button.classList.add('used');
            button.textContent = '✓';
        } else {
            button.onclick = () => selectQuestion(categoryName, question);
        }
        
        container.appendChild(button);
    });
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Select Question
function selectQuestion(category, question) {
    if (gameState.activeTeam === null) {
        alert('يرجى اختيار فريق أولاً!');
        return;
    }
    
    gameState.currentQuestion = {
        category: category,
        ...question
    };
    
    showQuestion();
}

// Show Question Screen
function showQuestion() {
    document.getElementById('teamSelectionScreen').style.display = 'none';
    document.getElementById('categoriesScreen').style.display = 'none';
    document.getElementById('questionScreen').style.display = 'block';
    
    const question = gameState.currentQuestion;
    
    document.getElementById('categoryName').textContent = question.category;
    document.getElementById('questionPoints').textContent = `${question.points} نقطة`;
    
    const imageContainer = document.getElementById('questionImageContainer');
    if (question.image) {
        imageContainer.innerHTML = `<img src="${question.image}?t=${Date.now()}" class="question-image" onerror="this.style.display='none';">`;
    } else {
        imageContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: rgba(255,255,255,0.7);">لا توجد صورة</div>';
    }
    
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('answerText').textContent = question.answer;
    
    // Reset answer section
    document.getElementById('answerSection').style.display = 'none';
    document.getElementById('answerButtons').style.display = 'none';
    document.getElementById('revealBtn').style.display = 'flex';
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show Categories from Question
function showCategories() {
    document.getElementById('teamSelectionScreen').style.display = 'none';
    document.getElementById('questionScreen').style.display = 'none';
    document.getElementById('categoriesScreen').style.display = 'block';
    
    renderCategories();
}

// Reveal Answer
function revealAnswer() {
    document.getElementById('answerSection').style.display = 'block';
    document.getElementById('answerButtons').style.display = 'flex';
    document.getElementById('revealBtn').style.display = 'none';
}

// Mark Correct
function markCorrect() {
    if (gameState.activeTeam !== null) {
        const points = gameState.currentQuestion.points;
        gameState.teams[gameState.activeTeam].score += points;
        
        const questionId = `${gameState.currentQuestion.category}_${points}`;
        gameState.usedQuestions.push(questionId);
        gameState.correctAnswers.push(questionId);
        
        saveGameState();
        updateActiveTeamInfo();
        
        alert(`صحيح! +${points} نقطة للفريق ${gameState.activeTeam + 1}`);
        
        showCategories();
    }
}

// Mark Incorrect
function markIncorrect() {
    if (gameState.activeTeam !== null) {
        const questionId = `${gameState.currentQuestion.category}_${gameState.currentQuestion.points}`;
        gameState.usedQuestions.push(questionId);
        gameState.incorrectAnswers.push(questionId);
        
        saveGameState();
        
        alert('إجابة خاطئة!');
        
        showCategories();
    }
}

// Toggle Mobile Menu
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        renderMobileMenu();
    }
}

// Render Mobile Menu
function renderMobileMenu() {
    const teamsContainer = document.getElementById('mobileTeams');
    const statsContainer = document.getElementById('mobileStats');
    
    // Render teams
    teamsContainer.innerHTML = '';
    gameState.teams.forEach((team, index) => {
        const teamDiv = document.createElement('div');
        teamDiv.className = `mobile-team ${index === gameState.activeTeam ? 'active' : ''}`;
        teamDiv.innerHTML = `
            <span>${team.name}</span>
            <span>${team.score} نقطة</span>
        `;
        teamsContainer.appendChild(teamDiv);
    });
    
    // Render stats
    statsContainer.innerHTML = `
        <div>الأسئلة المستخدمة: ${gameState.usedQuestions.length}</div>
        <div>الإجابات الصحيحة: ${gameState.correctAnswers.length}</div>
        <div>الإجابات الخاطئة: ${gameState.incorrectAnswers.length}</div>
    `;
}

// Update Active Team Info
function updateActiveTeamInfo() {
    const info = document.getElementById('activeTeamInfo');
    if (gameState.activeTeam !== null) {
        const team = gameState.teams[gameState.activeTeam];
        info.textContent = `${team.name} - ${team.score} نقطة`;
    } else {
        info.textContent = 'لم يتم اختيار فريق';
    }
}

// Save Game State
function saveGameState() {
    localStorage.setItem('senjemMobileState', JSON.stringify(gameState));
}

// Load Game State
function loadGameState() {
    const saved = localStorage.getItem('senjemMobileState');
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            gameState = { ...gameState, ...savedState };
        } catch (error) {
            console.error('Error loading game state:', error);
        }
    }
}

// Reset Game
function resetGame() {
    if (confirm('هل تريد إعادة تعيين اللعبة؟')) {
        gameState = {
            teams: [
                { name: 'الفريق الأول', score: 0, lifelines: { ask: true, double: true, google: true } },
                { name: 'الفريق الثاني', score: 0, lifelines: { ask: true, double: true, google: true } },
                { name: 'الفريق الثالث', score: 0, lifelines: { ask: true, double: true, google: true } },
                { name: 'الفريق الرابع', score: 0, lifelines: { ask: true, double: true, google: true } },
                { name: 'الفريق الخامس', score: 0, lifelines: { ask: true, double: true, google: true } }
            ],
            activeTeam: null,
            currentQuestion: null,
            usedQuestions: [],
            correctAnswers: [],
            incorrectAnswers: [],
            timer: 120,
            timerInterval: null,
            isTimerRunning: false
        };
        
        localStorage.removeItem('senjemMobileState');
        renderTeamSelection();
        updateActiveTeamInfo();
        showTeamSelection();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initMobileGame); 