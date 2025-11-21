document.addEventListener('DOMContentLoaded', () => {

    // ---------- Elements ----------
    const muteBtn = document.getElementById('mute-btn');
    const soundIcon = document.querySelector('#mute-btn img');
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const volumeSlider = document.getElementById('volume');
    const roundsSelect = document.getElementById('rounds');

    const rpsButtons = document.querySelectorAll('.rps-btn');
    const playerBoard = document.querySelector('.player-board');
    const npcBoard = document.querySelector('.npc-board');
    const playerDots = document.querySelector('.player-dots');
    const npcDots = document.querySelector('.npc-dots');

    // ---------- Game State ----------
    let playerScore = 0;
    let npcScore = 0;
    let totalRounds = parseInt(roundsSelect.value);
    const choices = ['rock', 'paper', 'scissors'];

    // ---------- UI Initialization ----------
    soundIcon.src = audioManager.muted ? 'images/nosound.svg' : 'images/sound.svg';
    volumeSlider.value = audioManager.volume;

    // ---------- Mute ----------
    muteBtn.addEventListener('click', () => {
        audioManager.toggleMute();
        soundIcon.src = audioManager.muted ? 'images/nosound.svg' : 'images/sound.svg';
    });

    // ---------- Settings ----------
    settingsBtn.addEventListener('click', () => settingsModal.classList.toggle('show'));
    closeSettings.addEventListener('click', () => settingsModal.classList.remove('show'));
    volumeSlider.addEventListener('input', () => audioManager.setVolume(volumeSlider.value));
    roundsSelect.addEventListener('change', () => {
        totalRounds = parseInt(roundsSelect.value);
        resetGame();
    });

    // ---------- Game Buttons ----------
    rpsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const playerChoice = btn.id;
            const npcChoice = choices[Math.floor(Math.random() * 3)];
            playRound(playerChoice, npcChoice);
        });
    });

    // ---------- Game Functions ----------
    function playRound(playerChoice, npcChoice) {
        clearBoards();

        // ---------- Player Selection ----------
        const playerIcon = createIcon(playerChoice, playerBoard);
        animateSelection(playerIcon);
        audioManager.playChoice(playerChoice); // play immediately

        // ---------- NPC Selection (delayed to avoid overlap) ----------
        setTimeout(() => {
            const npcIcon = createIcon(npcChoice, npcBoard);
            animateSelection(npcIcon);
            audioManager.playChoice(npcChoice); // play immediately when appears

            // ---------- Fight Animation ----------
            setTimeout(() => {
                const winner = getWinner(playerChoice, npcChoice);
                animateFight(playerIcon, npcIcon, winner);

                // Play winner choice audio immediately with fight
                if (winner !== 'tie') {
                    const winnerChoice = winner === 'player' ? playerChoice : npcChoice;
                    audioManager.playChoice(winnerChoice);
                }

                // ---------- Outcome Audio after fight ----------
                setTimeout(() => {
                    if (winner === 'player') audioManager.playOutcome('win');
                    else if (winner === 'npc') audioManager.playOutcome('loss');
                    else audioManager.playOutcome('tie');

                    updateScore(winner);

                    // ---------- Check End Game ----------
                    if (playerScore === totalRounds || npcScore === totalRounds) {
                        const result = playerScore > npcScore ? 'You Win!' : 'You Lose!';
                        // Endgame audio
                        setTimeout(() => {
                            audioManager.playOutcome(playerScore > npcScore ? 'finalWin' : 'finalLoss');
                        }, 300); // 300ms delay (adjust as needed)                        
                        setTimeout(() => {
                            alert(result);
                            resetGame();
                        }, 400); // small delay to let audio start
                    }

                }, 600); // match fight animation duration

            }, 500); // fight starts immediately after NPC selection

        }, 800); // delay between player and NPC selection
    }

    // ---------- Helper Functions ----------
    function clearBoards() {
        playerBoard.innerHTML = '';
        npcBoard.innerHTML = '';
    }

    function createIcon(choice, area) {
        const img = document.createElement('img');
        img.src = `images/${choice}.png`;
        img.classList.add('battle-icon');
        area.appendChild(img);
        return img;
    }

    function animateSelection(icon) {
        icon.animate([
            { transform: 'translateY(-100px)', opacity: 0 },
            { transform: 'translateY(0px)', opacity: 1 }
        ], { duration: 500, easing: 'ease-out', fill: 'forwards' });
    }

    function animateFight(playerIcon, npcIcon, winner) {
        const centerX = 120;

        playerIcon.animate([
            { transform: 'translate(0,0)' },
            { transform: `translate(${centerX}px,0)` }
        ], { duration: 500, fill: 'forwards' });

        npcIcon.animate([
            { transform: 'translate(0,0)' },
            { transform: `translate(${-centerX}px,0)` }
        ], { duration: 500, fill: 'forwards' });

        if (winner === 'player') {
            playerIcon.animate([
                { transform: `translate(${centerX}px,0)` },
                { transform: `translate(${centerX + 15}px,0)` },
                { transform: `translate(${centerX}px,0)` }
            ], { duration: 300, iterations: 2 });
        } else if (winner === 'npc') {
            npcIcon.animate([
                { transform: `translate(${-centerX}px,0)` },
                { transform: `translate(${-centerX - 15}px,0)` },
                { transform: `translate(${-centerX}px,0)` }
            ], { duration: 300, iterations: 2 });
        }
    }

    function getWinner(player, npc) {
        if (player === npc) return 'tie';
        if ((player === 'rock' && npc === 'scissors') ||
            (player === 'paper' && npc === 'rock') ||
            (player === 'scissors' && npc === 'paper')) return 'player';
        return 'npc';
    }

    function updateScore(winner) {
        if (winner === 'player') {
            playerScore++;
            addDot(playerDots);
        } else if (winner === 'npc') {
            npcScore++;
            addDot(npcDots);
        }
    }

    function addDot(container) {
        const dot = document.createElement('div');
        dot.textContent = '•';
        container.appendChild(dot);
    }

    function resetGame() {
        playerScore = 0;
        npcScore = 0;
        playerBoard.innerHTML = '';
        npcBoard.innerHTML = '';
        playerDots.innerHTML = '';
        npcDots.innerHTML = '';
    }

});
