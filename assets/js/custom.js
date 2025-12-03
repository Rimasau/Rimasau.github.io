document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form.php-email-form");
    if (form) form.classList.remove("php-email-form");

    form.removeAttribute("action");
    form.setAttribute("method", "get");
    form.addEventListener("submit", e => e.preventDefault());

    const resultBox = document.createElement("div");
    resultBox.id = "resultBox";
    resultBox.style.marginTop = "20px";
    resultBox.style.padding = "15px";
    resultBox.style.background = "#eee";
    form.after(resultBox);

    const messageBox = document.createElement("div");
    messageBox.id = "messageBox";
    messageBox.style.marginBottom = "10px";
    messageBox.style.padding = "10px";
    messageBox.style.borderRadius = "5px";
    messageBox.style.color = "#155724";
    messageBox.style.backgroundColor = "#d4edda";
    messageBox.style.border = "1px solid #c3e6cb";
    messageBox.style.fontWeight = "bold";
    messageBox.style.display = "none";
    form.before(messageBox);


    function createField(labelText, id, type = "text") {
        const label = document.createElement("label");
        label.textContent = labelText;

        const input = document.createElement("input");
        input.type = type;
        input.id = id;
        input.required = true;
        input.style.display = "block";
        input.style.marginBottom = "10px";

        form.appendChild(label);
        form.appendChild(input);
    }



    createField("Vardas:", "fname");
    createField("Pavardė:", "lname");
    createField("El. paštas:", "email", "email");
    createField("Telefono numeris:", "phone", "tel");
    createField("Adresas:", "address");


    function createSlider(labelText, id) {
        const label = document.createElement("label");
        label.textContent = labelText;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = 1;
        slider.max = 10;
        slider.value = 5;
        slider.id = id;
        slider.style.display = "block";
        slider.style.marginBottom = "20px";

        form.appendChild(label);
        form.appendChild(slider);
    }

    createSlider("Kaip vertinate si cv (1–10):", "q1");
    createSlider("Kokia jusu siandien nuotaika (1–10):", "q2");
    createSlider("Ar rekomenduotumete mane kitiems (1–10):", "q3");


    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit";
    submitBtn.style.marginTop = "10px";
    submitBtn.disabled = true;
    form.appendChild(submitBtn);

    function showError(field, message) {
        let errorEl = field.nextElementSibling;
        if (!errorEl || !errorEl.classList.contains("error-message")) {
            errorEl = document.createElement("div");
            errorEl.classList.add("error-message");
            errorEl.style.color = "red";
            errorEl.style.fontSize = "0.9em";
            field.after(errorEl);
        }
        if (message) {
            errorEl.textContent = message;
            field.style.border = "1px solid red";
            errorEl.style.display = "block";
        } else {
            errorEl.textContent = "";
            field.style.border = "";
            errorEl.style.display = "none";
        }
    }

    function validateField(field) {
        const value = field.value.trim();
        let valid = true;
        let error = "";

        if (!value) {
            valid = false;
            error = "Laukas privalomas";
        } else {
            switch(field.id) {
                case "fname":
                case "lname":
                    if (!/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/.test(value)) {
                        valid = false;
                        error = "Tik raidės";
                    }
                    break;
                case "email":
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        valid = false;
                        error = "Neteisingas el. pašto formatas";
                    }
                    break;
                case "phone":
                    // Telefono formatas +370 xxx xxxx
                    if (!/^\+370 \d{3} \d{4}$/.test(value)) {
                        valid = false;
                        error = "Telefonas turi būti formatu +370 xxx xxxx";
                    }
                    break;
                case "q1":
                case "q2":
                case "q3":
                    let num = parseInt(value);
                    if (isNaN(num) || num < 1 || num > 10) {
                        valid = false;
                        error = "Įvertinimas turi būti 1-10";
                    }
                    break;
            }
        }

        showError(field, error);
        return valid;
    }


    function formatPhone(value) {
        value = value.replace(/[^\d+]/g, "");

        if (value.startsWith("+370")) {
            let rest = value.slice(4).replace(/\D/g, "");
            if (rest.length > 0) {
                rest = rest.slice(0, 7);
                value = "+370 " + rest.replace(/(\d{3})(\d{0,4})/, "$1 $2").trim();
            } else {
                value = "+370 ";
            }
        } else {
            value = value.slice(0, 13);
        }
        return value;
    }


    const phoneInput = document.getElementById("phone");
    phoneInput.addEventListener("input", (e) => {
        const cursorPos = phoneInput.selectionStart;
        const oldLength = phoneInput.value.length;

        phoneInput.value = formatPhone(phoneInput.value);

        const newLength = phoneInput.value.length;
        const diff = newLength - oldLength;

        phoneInput.selectionStart = phoneInput.selectionEnd = cursorPos + diff;

        validateField(phoneInput);
        checkAllFields();
    });


    ["fname", "lname", "email", "address", "q1", "q2", "q3"].forEach(id => {
        const f = document.getElementById(id);
        f.addEventListener("input", () => {
            validateField(f);
            checkAllFields();
        });
    });


    function checkAllFields() {
        const fields = ["fname", "lname", "email", "phone", "address", "q1", "q2", "q3"];
        let allValid = true;
        for (const id of fields) {
            const f = document.getElementById(id);
            if (!validateField(f)) {
                allValid = false;
                break;
            }
        }
        submitBtn.disabled = !allValid;
        return allValid;
    }


    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!checkAllFields()) {
            messageBox.textContent = "Prašome užpildyti formą teisingai.";
            messageBox.style.color = "#721c24"; 
            messageBox.style.backgroundColor = "#f8d7da";
            messageBox.style.border = "1px solid #f5c6cb";
            messageBox.style.display = "block";
            return;
        }

        const data = {
            fname: document.getElementById("fname").value.trim(),
            lname: document.getElementById("lname").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),
            q1: parseInt(document.getElementById("q1").value),
            q2: parseInt(document.getElementById("q2").value),
            q3: parseInt(document.getElementById("q3").value)
        };


        const avg = ((data.q1 + data.q2 + data.q3) / 3).toFixed(1);


        messageBox.textContent = "Duomenys pateikti sėkmingai!";
        messageBox.style.color = "#155724";
        messageBox.style.backgroundColor = "#d4edda";
        messageBox.style.border = "1px solid #c3e6cb";
        messageBox.style.display = "block";


        console.log("Formos duomenys:", data);
        console.log("Vidurkis:", avg);


        resultBox.innerHTML = `
            <p><b>Vardas:</b> ${data.fname}</p>
            <p><b>Pavardė:</b> ${data.lname}</p>
            <p><b>El. paštas:</b> ${data.email}</p>
            <p><b>Telefono numeris:</b> ${data.phone}</p>
            <p><b>Adresas:</b> ${data.address}</p>
            <p><b>Įvertinimų vidurkis:</b> ${avg}</p>
        `;
    });

});


if (document.getElementById('memory-game')) {
    

    const EASY = { rows: 3, cols: 4, name: "Lengvas", key: "easy" };
    const HARD = { rows: 4, cols: 6, name: "Sunkus", key: "hard" };
    

    const cardData = [
        { id: 1, type: "html", icon: "<i class='fab fa-html5'></i>", color: "#E44D26" },
        { id: 2, type: "css", icon: "<i class='fab fa-css3-alt'></i>", color: "#264DE4" },
        { id: 3, type: "js", icon: "<i class='fab fa-js-square'></i>", color: "#F0DB4F", textColor: "#000" },
        { id: 4, type: "react", icon: "<i class='fab fa-react'></i>", color: "#61DAFB", textColor: "#000" },
        { id: 5, type: "node", icon: "<i class='fab fa-node-js'></i>", color: "#68A063" },
        { id: 6, type: "git", icon: "<i class='fab fa-git-alt'></i>", color: "#F1502F" }
    ];


    let gameState = {
        difficulty: EASY,
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        gameStarted: false,
        gameOver: false,
        timer: 0,
        timerInterval: null,
        totalPairs: 0,
        canFlip: true,
        bestScores: {}
    };


    const gameBoard = document.getElementById('game-board');
    const movesElement = document.getElementById('moves');
    const matchesElement = document.getElementById('matches');
    const timerElement = document.getElementById('timer');
    const totalPairsElement = document.getElementById('total-pairs');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const winMessage = document.getElementById('win-message');
    const finalMovesElement = document.getElementById('final-moves');
    const finalTimeElement = document.getElementById('final-time');
    const finalPairsElement = document.getElementById('final-pairs');
    const bestScoreEasyElement = document.getElementById('best-score-easy');
    const bestScoreHardElement = document.getElementById('best-score-hard');

    function initGame() {
        gameState.gameStarted = false;
        gameState.gameOver = false;
        gameState.moves = 0;
        gameState.matchedPairs = 0;
        gameState.timer = 0;
        gameState.flippedCards = [];
        gameState.canFlip = true;
        

        const totalCards = gameState.difficulty.rows * gameState.difficulty.cols;
        gameState.totalPairs = totalCards / 2;
        
        loadBestScores();

        updateStats();
        

        if (gameBoard) gameBoard.innerHTML = '';
        

        if (winMessage) winMessage.classList.remove('show');
        

        clearInterval(gameState.timerInterval);
        

        generateCards();
        

        renderGameBoard();
        

        if (startBtn) {
            startBtn.innerHTML = '<i class="fas fa-play"></i> Pradėti žaidimą';
            startBtn.disabled = false;
        }
    }


    function generateCards() {

        const neededPairs = gameState.totalPairs;
        

        let selectedCards = [];
        if (neededPairs <= cardData.length) {
            selectedCards = cardData.slice(0, neededPairs);
        } else {

            const repetitions = Math.ceil(neededPairs / cardData.length);
            for (let i = 0; i < repetitions; i++) {
                selectedCards = selectedCards.concat(cardData.slice(0, Math.min(cardData.length, neededPairs - selectedCards.length)));
            }
        }
        

        let cardPairs = [];
        selectedCards.forEach(card => {
            cardPairs.push({...card, pairId: card.id});
            cardPairs.push({...card, pairId: card.id});
        });
        

        cardPairs = shuffleArray(cardPairs);

        gameState.cards = [];
        for (let i = 0; i < cardPairs.length; i++) {
            gameState.cards.push({
                id: i,
                type: cardPairs[i].type,
                icon: cardPairs[i].icon,
                color: cardPairs[i].color,
                textColor: cardPairs[i].textColor || "#fff",
                pairId: cardPairs[i].pairId,
                flipped: false,
                matched: false
            });
        }
    }


    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }


    function renderGameBoard() {
        if (!gameBoard) return;
        
        gameBoard.style.gridTemplateColumns = `repeat(${gameState.difficulty.cols}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${gameState.difficulty.rows}, 1fr)`;
        
        gameState.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            if (card.flipped || card.matched) {
                cardElement.classList.add('flipped');
            }
            if (card.matched) {
                cardElement.classList.add('matched');
            }
            
            cardElement.dataset.id = card.id;
            

            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front" style="background-color: ${card.color}; color: ${card.textColor}">
                        ${card.icon}
                    </div>
                    <div class="card-back">?</div>
                </div>
            `;
            
            cardElement.addEventListener('click', () => flipCard(card.id));
            gameBoard.appendChild(cardElement);
        });
    }


    function flipCard(cardId) {

        if (!gameState.gameStarted || gameState.gameOver || !gameState.canFlip) return;
        

        const card = gameState.cards.find(c => c.id === cardId);
        const cardElement = document.querySelector(`.card[data-id="${cardId}"]`);
        

        if (!card || card.flipped || card.matched) return;
        

        if (gameState.flippedCards.length >= 2) return;
       
        card.flipped = true;
        if (cardElement) cardElement.classList.add('flipped');
        

        gameState.flippedCards.push(card);

        if (gameState.flippedCards.length === 2) {
            gameState.moves++;
            updateStats();
            

            const [card1, card2] = gameState.flippedCards;
            

            if (card1.pairId === card2.pairId) {

                gameState.flippedCards.forEach(flippedCard => {
                    flippedCard.matched = true;
                    const matchedCardElement = document.querySelector(`.card[data-id="${flippedCard.id}"]`);
                    if (matchedCardElement) matchedCardElement.classList.add('matched');
                });
                
                gameState.matchedPairs++;
                updateStats();
                

                gameState.flippedCards = [];
                

                checkGameOver();
            } else {

                gameState.canFlip = false;
                
                setTimeout(() => {
                    gameState.flippedCards.forEach(flippedCard => {
                        flippedCard.flipped = false;
                        const flippedCardElement = document.querySelector(`.card[data-id="${flippedCard.id}"]`);
                        if (flippedCardElement) flippedCardElement.classList.remove('flipped');
                    });
                    
                    gameState.flippedCards = [];
                    gameState.canFlip = true;
                }, 1000);
            }
        }
    }


    function updateStats() {
        if (movesElement) movesElement.textContent = gameState.moves;
        if (matchesElement) matchesElement.textContent = gameState.matchedPairs;
        if (timerElement) timerElement.textContent = gameState.timer;
        if (totalPairsElement) totalPairsElement.textContent = gameState.totalPairs;
    }


    function checkGameOver() {
        if (gameState.matchedPairs === gameState.totalPairs) {
            gameState.gameOver = true;
            clearInterval(gameState.timerInterval);
            
            checkAndUpdateBestScore();

            if (finalMovesElement) finalMovesElement.textContent = gameState.moves;
            if (finalTimeElement) finalTimeElement.textContent = gameState.timer;
            if (finalPairsElement) finalPairsElement.textContent = gameState.totalPairs;
            if (winMessage) winMessage.classList.add('show');
        }
    }


    function startGame() {
        if (gameState.gameStarted || !startBtn) return;
        
        gameState.gameStarted = true;
        gameState.moves = 0;
        gameState.matchedPairs = 0;
        gameState.timer = 0;
        gameState.flippedCards = [];
        gameState.canFlip = true;
        

        gameState.cards.forEach(card => {
            card.flipped = false;
            card.matched = false;
        });
        

        updateStats();
        

        if (winMessage) winMessage.classList.remove('show');
        

        if (gameBoard) {
            gameBoard.innerHTML = '';
            renderGameBoard();
        }
        

        clearInterval(gameState.timerInterval);
        gameState.timerInterval = setInterval(() => {
            gameState.timer++;
            if (timerElement) timerElement.textContent = gameState.timer;
        }, 1000);

        startBtn.innerHTML = '<i class="fas fa-play"></i> Žaidimas vyksta';
        startBtn.disabled = true;
    }

    function changeDifficulty(difficulty) {
        if (difficulty === 'easy') {
            gameState.difficulty = EASY;
        } else if (difficulty === 'hard') {
            gameState.difficulty = HARD;
        }
        
        difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });
        

        initGame();
    }


    function resetGame() {
        initGame();
    }


    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }
    
    if (difficultyBtns.length > 0) {
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                changeDifficulty(btn.dataset.difficulty);
            });
        });
    }

    function loadBestScores() {
    try {
        const savedScores = localStorage.getItem('memoryGameBestScores');
        
        if (savedScores) {
            gameState.bestScores = JSON.parse(savedScores);
        } else {
            gameState.bestScores = {
                easy: { moves: null, time: null, date: null },
                hard: { moves: null, time: null, date: null }
            };
        }
        updateBestScoresDisplay();
    } catch (error) {
        console.error('Klaida įkeliant rezultatus:', error);
        gameState.bestScores = {
            easy: { moves: null, time: null, date: null },
            hard: { moves: null, time: null, date: null }
        };
    }
}


function saveBestScores() {
    try {
        localStorage.setItem('memoryGameBestScores', JSON.stringify(gameState.bestScores));
    } catch (error) {
        console.error('Klaida išsaugant rezultatus:', error);
    }
}


function updateBestScoresDisplay() {
    const easyScore = gameState.bestScores.easy;
    const hardScore = gameState.bestScores.hard;
    
    if (bestScoreEasyElement) {
        if (easyScore && easyScore.moves !== null) {
            bestScoreEasyElement.innerHTML = `
                <div class="best-score-value">${easyScore.moves} ėj.</div>
                <div class="best-score-time">${easyScore.time} sek.</div>
            `;
        } else {
            bestScoreEasyElement.innerHTML = '<div class="no-score">Dar nėra rezultato</div>';
        }
    }
    
    if (bestScoreHardElement) {
        if (hardScore && hardScore.moves !== null) {
            bestScoreHardElement.innerHTML = `
                <div class="best-score-value">${hardScore.moves} ėj.</div>
                <div class="best-score-time">${hardScore.time} sek.</div>
            `;
        } else {
            bestScoreHardElement.innerHTML = '<div class="no-score">Dar nėra rezultato</div>';
        }
    }
}


function checkAndUpdateBestScore() {
    const difficultyKey = gameState.difficulty.key;
    const currentScore = {
        moves: gameState.moves,
        time: gameState.timer,
        date: new Date().toISOString()
    };
    
    const bestScore = gameState.bestScores[difficultyKey];
    

    if (!bestScore || bestScore.moves === null || currentScore.moves < bestScore.moves) {
        gameState.bestScores[difficultyKey] = currentScore;
        saveBestScores();
        updateBestScoresDisplay();
        return true;
    }
    

    if (currentScore.moves === bestScore.moves && currentScore.time < bestScore.time) {
        gameState.bestScores[difficultyKey] = currentScore;
        saveBestScores();
        updateBestScoresDisplay();
        return true;
    }
    
    return false;
}

    initGame();
}