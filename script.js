class KittyMeowMachine {
    constructor() {
        this.currentMood = 'happy';
        this.meowHistory = [];
        this.isGenerating = false;
        
        this.moodData = {
            happy: {
                image: 'cat-happy.png',
                meows: ['Meow! 😸', 'Purr meow! 🐾', 'Mrow mrow! ✨', 'Happy meow! 💕'],
                soundPrompts: ['happy cat purring and meowing', 'content kitten gentle meow', 'joyful cat soft purr']
            },
            angry: {
                image: 'cat-angry.png', 
                meows: ['HISS! 😾', 'Grrr meow! 💢', 'Angry mrow! 🔥', 'Mad cat sounds! 😤'],
                soundPrompts: ['angry cat hissing loudly', 'grumpy cat growling and yowling', 'annoyed feline angry meow']
            },
            sleepy: {
                image: 'cat-sleepy.png',
                meows: ['Yawn... meow 😴', 'Sleepy purr... 💤', 'Zzz... mrow 🌙', 'Drowsy meow... ☁️'],
                soundPrompts: ['sleepy cat soft yawn and purr', 'tired kitten gentle meow', 'drowsy feline quiet purr']
            },
            hungry: {
                image: 'cat-hungry.png',
                meows: ['FEED ME! 🍽️', 'Hungry meow! 🐟', 'Where food? Mrow! 🥫', 'Nom nom meow! 🍖'],
                soundPrompts: ['demanding hungry cat loud meow', 'begging kitten insistent meowing', 'food-wanting cat persistent calls']
            },
            playful: {
                image: 'cat-playful.png',
                meows: ['Play time! 🎾', 'Zoom zoom meow! 💨', 'Catch me! Mrow! 🏃‍♂️', 'Bouncy meow! 🎈'],
                soundPrompts: ['playful kitten excited chirping', 'energetic cat trilling sounds', 'active feline playful meows']
            },
            curious: {
                image: 'cat-curious.png',
                meows: ['What\'s that? 🔍', 'Interested mrow? 🤔', 'Tell me more! Meow 📚', 'Curious purr? 💭'],
                soundPrompts: ['inquisitive cat questioning trill', 'curious kitten soft chirp', 'interested feline gentle meow']
            },
            scared: {
                image: 'cat-scared.png',
                meows: ['Eek! Meow! 😨', 'Hide me! Mrow! 🙈', 'Scary! Meow meow! 👻', 'Help! Frightened purr! 😰'],
                soundPrompts: ['frightened cat startled meow', 'scared kitten worried cry', 'nervous feline anxious sounds']
            },
            excited: {
                image: 'cat-excited.png',
                meows: ['WOW! Meow meow! 🎉', 'Amazing! Purr! ✨', 'So cool! Mrow! 🌟', 'Thrilled meow! 🎊'],
                soundPrompts: ['excited cat enthusiastic meowing', 'thrilled kitten happy chirps', 'energetic feline celebration sounds']
            },
            loving: {
                image: 'cat-loving.png',
                meows: ['Love you! Purr 💖', 'Cuddle meow! 🤗', 'Sweet purr purr! 💕', 'Affection mrow! 🥰'],
                soundPrompts: ['loving cat gentle purring', 'affectionate kitten soft meows', 'tender feline loving sounds']
            },
            mischievous: {
                image: 'cat-mischievous.png',
                meows: ['Hehe... meow 😏', 'Sneaky mrow! 🤫', 'Trouble time! Purr 😈', 'Naughty meow! 😼'],
                soundPrompts: ['mischievous cat playful trill', 'sneaky kitten quiet meow', 'naughty feline subtle chirp']
            }
        };
        
        this.initializeElements();
        this.bindEvents();
        this.updateCatDisplay();
    }
    
    initializeElements() {
        this.catImage = document.getElementById('catImage');
        this.speechBubble = document.getElementById('speechBubble');
        this.meowText = document.getElementById('meowText');
        this.generateBtn = document.getElementById('generateMeow');
        this.surpriseBtn = document.getElementById('surpriseMe');
        this.customMessage = document.getElementById('customMessage');
        this.customMeowBtn = document.getElementById('customMeowBtn');
        this.historyContainer = document.getElementById('historyContainer');
        this.moodButtons = document.querySelectorAll('.mood-btn');
    }
    
    bindEvents() {
        this.moodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectMood(e.target.dataset.mood);
            });
        });
        
        this.generateBtn.addEventListener('click', () => {
            this.generateMeow();
        });
        
        this.surpriseBtn.addEventListener('click', () => {
            this.surpriseMe();
        });
        
        this.customMeowBtn.addEventListener('click', () => {
            this.generateCustomMeow();
        });
        
        this.customMessage.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateCustomMeow();
            }
        });
    }
    
    selectMood(mood) {
        this.currentMood = mood;
        
        // Update active button
        this.moodButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mood === mood) {
                btn.classList.add('active');
            }
        });
        
        this.updateCatDisplay();
    }
    
    updateCatDisplay() {
        const moodData = this.moodData[this.currentMood];
        this.catImage.src = moodData.image;
        
        // Add bounce animation when mood changes
        this.catImage.style.animation = 'none';
        setTimeout(() => {
            this.catImage.style.animation = 'float 3s ease-in-out infinite';
        }, 100);
    }
    
    async generateMeow() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.generateBtn.textContent = '🎵 Generating...';
        
        try {
            const moodData = this.moodData[this.currentMood];
            
            // Show random text meow immediately
            const randomMeow = moodData.meows[Math.floor(Math.random() * moodData.meows.length)];
            this.showMeowBubble(randomMeow);
            
            // Generate AI sound effect
            const soundPrompt = moodData.soundPrompts[Math.floor(Math.random() * moodData.soundPrompts.length)];
            
            // Create sound effect based on the prompt
            const soundBlob = await fetch('/generate-sound', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: soundPrompt,
                    duration: 2
                })
            }).then(r => r.blob());
            
            const audioUrl = URL.createObjectURL(soundBlob);
            
            // Play the generated sound
            const audio = new Audio(audioUrl);
            audio.play();
            
            this.addToHistory(randomMeow, audioUrl);
            
        } catch (error) {
            console.error('Error generating meow:', error);
            this.showMeowBubble('Meow! (Error generating sound) 😿');
        }
        
        this.isGenerating = false;
        this.generateBtn.textContent = '🎵 Generate Meow';
    }
    
    async surpriseMe() {
        // Randomly select a mood first
        const moods = Object.keys(this.moodData);
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        this.selectMood(randomMood);
        
        // Wait a bit for the mood change to be visible
        setTimeout(() => {
            this.generateMeow();
        }, 500);
    }
    
    async generateCustomMeow() {
        const message = this.customMessage.value.trim();
        if (!message) return;
        
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.customMeowBtn.textContent = '🗣️ Generating...';
        
        try {
            // Use AI to create a cat-like version of the message
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a cat translator. Convert human messages into cute cat-speak while maintaining the meaning. 
                        Add appropriate cat emojis. Keep it playful and adorable. Maximum 50 characters.
                        Examples:
                        "I'm hungry" -> "Meow! Want noms! 🍽️😸"
                        "Hello" -> "Mrow hello! 🐾"
                        "I love you" -> "Purr love you! 💕🐱"`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            });
            
            const catMessage = completion.content;
            this.showMeowBubble(catMessage);
            
            // Generate cat meow sound based on current mood
            const moodData = this.moodData[this.currentMood];
            const soundPrompt = moodData.soundPrompts[Math.floor(Math.random() * moodData.soundPrompts.length)];
            
            const soundBlob = await fetch('/generate-sound', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: soundPrompt,
                    duration: 2
                })
            }).then(r => r.blob());
            
            const audioUrl = URL.createObjectURL(soundBlob);
            const audio = new Audio(audioUrl);
            audio.play();
            
            this.addToHistory(catMessage, audioUrl);
            this.customMessage.value = '';
            
        } catch (error) {
            console.error('Error generating custom meow:', error);
            this.showMeowBubble('Meow! (Error) 😿');
        }
        
        this.isGenerating = false;
        this.customMeowBtn.textContent = '🗣️ Make Kitty Say It';
    }
    
    showMeowBubble(text) {
        this.meowText.textContent = text;
        this.speechBubble.classList.remove('show');
        
        setTimeout(() => {
            this.speechBubble.classList.add('show');
        }, 100);
        
        // Hide bubble after 5 seconds
        setTimeout(() => {
            this.speechBubble.classList.remove('show');
        }, 5000);
    }
    
    addToHistory(meowText, audioUrl) {
        const historyItem = {
            text: meowText,
            audioUrl: audioUrl,
            timestamp: new Date(),
            mood: this.currentMood
        };
        
        this.meowHistory.unshift(historyItem);
        
        // Keep only last 10 items
        if (this.meowHistory.length > 10) {
            this.meowHistory = this.meowHistory.slice(0, 10);
        }
        
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        this.historyContainer.innerHTML = '';
        
        this.meowHistory.forEach((item, index) => {
            const historyDiv = document.createElement('div');
            historyDiv.className = 'history-item';
            
            const contentSpan = document.createElement('span');
            contentSpan.className = 'meow-content';
            contentSpan.textContent = item.text;
            
            const playBtn = document.createElement('button');
            playBtn.className = 'play-btn';
            playBtn.innerHTML = '🔊';
            playBtn.title = 'Play sound';
            playBtn.addEventListener('click', () => {
                const audio = new Audio(item.audioUrl);
                audio.play();
            });
            
            historyDiv.appendChild(contentSpan);
            historyDiv.appendChild(playBtn);
            this.historyContainer.appendChild(historyDiv);
        });
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KittyMeowMachine();
});