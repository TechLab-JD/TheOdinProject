class AudioManager {
    constructor(bgAudioId) {
        this.bgAudio = document.getElementById(bgAudioId);
        this.bgAudio.loop = true;
        this.volume = 0.3;
        this.bgAudio.volume = this.volume;
        this.muted = false; // only affects background music

        // Choice sounds
        this.choiceBuffers = {
            rock: new Audio('audio/rock.mp3'),
            paper: new Audio('audio/paper.mp3'),
            scissors: new Audio('audio/scissors.mp3')
        };

        // Outcome sounds
        this.outcomeBuffers = {
            win: new Audio('audio/win.mp3'),
            loss: new Audio('audio/loss.mp3'),
            tie: new Audio('audio/tie.mp3'),
            finalLoss: new Audio('audio/final_loss.mp3'),
            finalWin: new Audio('audio/final_win.mp3'),
        };

        // Preload all
        Object.values({...this.choiceBuffers, ...this.outcomeBuffers}).forEach(audio => {
            audio.preload = 'auto';
            audio.load();
        });
    }

    toggleMute() {
        this.muted = !this.muted;
        this.bgAudio.muted = this.muted; // only mute BG music
    }

    setVolume(value) {
        this.volume = parseFloat(value);
        this.bgAudio.volume = this.volume;
    }

    playChoice(choice) {
        if (!this.choiceBuffers[choice]) return;
        const audio = this.choiceBuffers[choice].cloneNode();
        audio.volume = this.volume;
        audio.play(); // unaffected by mute
    }

    playOutcome(outcome) {
        if (!this.outcomeBuffers[outcome]) return;
        const audio = this.outcomeBuffers[outcome].cloneNode();
        audio.volume = this.volume;
        audio.play(); // unaffected by mute
    }
}


// Singleton
const audioManager = new AudioManager('bg-audio');