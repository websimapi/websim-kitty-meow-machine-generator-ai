class KittyMeowMachine {
    constructor() {
        this.currentMood = 'happy';
        this.meowHistory = [];
        this.isGenerating = false;
        this.customKitties = {};
        
        // Base moods, never modified
        this.baseMoodData = {
            happy: { name: '😸 Happy', image: 'cat-happy.png', description: 'An adorable happy orange cat', meows: ['Meow! 😸', 'Purr meow! 🐾', 'Mrow mrow! ✨', 'Happy meow! 💕'], soundPrompts: ['happy cat purring and meowing', 'content kitten gentle meow', 'joyful cat soft purr'] },
            angry: { name: '😾 Grumpy', image: 'cat-angry.png', description: 'A grumpy orange cat', meows: ['HISS! 😾', 'Grrr meow! 💢', 'Angry mrow! 🔥', 'Mad cat sounds! 😤'], soundPrompts: ['angry cat hissing loudly', 'grumpy cat growling and yowling', 'annoyed feline angry meow'] },
            sleepy: { name: '😴 Sleepy', image: 'cat-sleepy.png', description: 'A sleepy orange cat', meows: ['Yawn... meow 😴', 'Sleepy purr... 💤', 'Zzz... mrow 🌙', 'Drowsy meow... ☁️'], soundPrompts: ['sleepy cat soft yawn and purr', 'tired kitten gentle meow', 'drowsy feline quiet purr'] },
            hungry: { name: '🍽️ Hungry', image: 'cat-hungry.png', description: 'A hungry orange cat', meows: ['FEED ME! 🍽️', 'Hungry meow! 🐟', 'Where food? Mrow! 🥫', 'Nom nom meow! 🍖'], soundPrompts: ['demanding hungry cat loud meow', 'begging kitten insistent meowing', 'food-wanting cat persistent calls'] },
            playful: { name: '🎾 Playful', image: 'cat-playful.png', description: 'A playful orange cat', meows: ['Play time! 🎾', 'Zoom zoom meow! 💨', 'Catch me! Mrow! 🏃‍♂️', 'Bouncy meow! 🎈'], soundPrompts: ['playful kitten excited chirping', 'energetic cat trilling sounds', 'active feline playful meows'] },
            curious: { name: '🔍 Curious', image: 'cat-curious.png', description: 'A curious orange cat', meows: ['What\'s that? 🔍', 'Interested mrow? 🤔', 'Tell me more! Meow 📚', 'Curious purr? 💭'], soundPrompts: ['inquisitive cat questioning trill', 'curious kitten soft chirp', 'interested feline gentle meow'] },
            scared: { name: '😨 Scared', image: 'cat-scared.png', description: 'A scared orange cat', meows: ['Eek! Meow! 😨', 'Hide me! Mrow! 🙈', 'Scary! Meow meow! 👻', 'Help! Frightened purr! 😰'], soundPrompts: ['frightened cat startled meow', 'scared kitten worried cry', 'nervous feline anxious sounds'] },
            excited: { name: '🎉 Excited', image: 'cat-excited.png', description: 'An excited orange cat', meows: ['WOW! Meow meow! 🎉', 'Amazing! Purr! ✨', 'So cool! Mrow! 🌟', 'Thrilled meow! 🎊'], soundPrompts: ['excited cat enthusiastic meowing', 'thrilled kitten happy chirps', 'energetic feline celebration sounds'] },
            loving: { name: '💖 Loving', image: 'cat-loving.png', description: 'A loving orange cat', meows: ['Love you! Purr 💖', 'Cuddle meow! 🤗', 'Sweet purr purr! 💕', 'Affection mrow! 🥰'], soundPrompts: ['loving cat gentle purring', 'affectionate kitten soft meows', 'tender feline loving sounds'] },
            mischievous: { name: '😈 Mischievous', image: 'cat-mischievous.png', description: 'A mischievous orange cat', meows: ['Hehe... meow 😏', 'Sneaky mrow! 🤫', 'Trouble time! Purr 😈', 'Naughty meow! 😼'], soundPrompts: ['mischievous cat playful trill', 'sneaky kitten quiet meow', 'naughty feline subtle chirp'] }
        };

        this.moodData = { ...this.baseMoodData }; // Combined data
        this.currentCatDescription = this.moodData.happy.description;

        this.initializeElements();
        this.loadCustomKitties();
        this.renderMoodButtons();
        this.bindEvents();
        this.selectMood('happy');
    }
    
    initializeElements() {
        this.catImage = document.getElementById('catImage');
        this.speechBubble = document.getElementById('speechBubble');
        this.meowText = document.getElementById('meowText');
        this.generateBtn = document.getElementById('generateMeow');
        this.surpriseBtn = document.getElementById('surpriseMe');
        this.newKittyBtn = document.getElementById('newKittyBtn');
        this.historyContainer = document.getElementById('historyContainer');
        this.moodButtonsContainer = document.querySelector('.mood-buttons');
        this.clearKittiesBtn = document.getElementById('clearKittiesBtn');
    }
    
    bindEvents() {
        this.moodButtonsContainer.addEventListener('click', (e) => {
            if (e.target.matches('.mood-btn')) {
                 this.selectMood(e.target.dataset.mood);
            }
        });
        
        this.generateBtn.addEventListener('click', () => {
            this.generateMeow();
        });
        
        this.surpriseBtn.addEventListener('click', () => {
            this.surpriseMe();
        });

        this.newKittyBtn.addEventListener('click', () => {
            this.createNewKitty();
        });
        
        this.clearKittiesBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all your adopted kittens? This cannot be undone.')) {
                this.clearCustomKitties();
            }
        });
    }

    renderMoodButtons() {
        this.moodButtonsContainer.innerHTML = '';
        Object.entries(this.moodData).forEach(([moodId, data]) => {
            const btn = document.createElement('button');
            btn.className = 'mood-btn';
            btn.dataset.mood = moodId;
            btn.textContent = data.name;

            if (data.isCustom) {
                btn.classList.add('custom-kitty-btn');
                btn.title = data.description;
            }

            this.moodButtonsContainer.appendChild(btn);
        });
        this.updateActiveButton();
    }

    updateActiveButton() {
        const buttons = this.moodButtonsContainer.querySelectorAll('.mood-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mood === this.currentMood);
        });
    }
    
    selectMood(mood) {
        if (!this.moodData[mood]) {
            console.warn(`Mood "${mood}" not found. Defaulting to happy.`);
            this.currentMood = 'happy';
        } else {
            this.currentMood = mood;
        }
        
        this.updateActiveButton();
        
        const moodInfo = this.moodData[this.currentMood];
        this.currentCatDescription = moodInfo.description;
        this.catImage.src = moodInfo.image;
        this.catImage.alt = moodInfo.description;
        
        // Add bounce animation when mood changes
        this.catImage.style.animation = 'none';
        void this.catImage.offsetWidth; // Trigger reflow
        this.catImage.style.animation = 'float 3s ease-in-out infinite';
    }
    
    async generateMeow() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.setLoading(true);
        this.generateBtn.textContent = '🎵 Generating...';
        
        try {
            // Generate AI meow text
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a cat. Generate a short, cute meow or cat-like phrase that fits the specified mood and cat description. Add cat emojis. Keep it under 50 characters. The user will provide the mood and a description of you.`
                    },
                    {
                        role: "user",
                        content: `My mood is: ${this.moodData[this.currentMood].name}. My description is: ${this.currentCatDescription}`
                    }
                ]
            });

            const aiMeow = completion.content;
            this.showMeowBubble(aiMeow);
            
            const moodInfo = this.moodData[this.currentMood];
            // Use base mood sound prompts for custom cats too
            const soundPrompts = moodInfo.soundPrompts || this.baseMoodData.happy.soundPrompts;
            const soundPrompt = soundPrompts[Math.floor(Math.random() * soundPrompts.length)];
            
            const soundResult = await websim.textToSpeech({
              text: "meow",
              prompt: soundPrompt
            });

            const audioUrl = soundResult.url;
            
            // Play the generated sound
            const audio = new Audio(audioUrl);
            audio.play();
            
            this.addToHistory(aiMeow, audioUrl);
            
        } catch (error) {
            console.error('Error generating meow:', error);
            this.showMeowBubble('Meow! (Error generating sound) 😿');
        }
        
        this.isGenerating = false;
        this.setLoading(false);
        this.generateBtn.textContent = '🎵 Generate Meow';
    }
    
    async surpriseMe() {
        const moods = Object.keys(this.moodData);
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        this.selectMood(randomMood);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.generateMeow();
    }
    
    async createNewKitty() {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.setLoading(true);
        this.newKittyBtn.textContent = '💖 Finding a kitty...';
        
        try {
            this.showMeowBubble("Let's find you a new friend! 🐾");

            const chatCompletion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a cat character creator. Create a unique, adorable cartoon cat. Respond with JSON containing a short "name" (e.g., "✨ Sparkle") and a "description" (e.g., "A fluffy calico cat wearing a tiny bow tie"). The name should be short and include a relevant emoji.`
                    },
                    {
                        role: "user",
                        content: "Create a new cat character for me."
                    }
                ],
                json: true,
            });
            const kittyData = JSON.parse(chatCompletion.content);

            const imagePrompt = `${kittyData.description}, anime/kawaii style, cute, simple background, full body`;
            const imageResult = await websim.imageGen({
                prompt: imagePrompt,
                transparent: true,
                aspect: 'square'
            });

            const moodId = `custom_${Date.now()}`;
            const newKitty = {
                name: kittyData.name,
                image: imageResult.url,
                description: kittyData.description,
                isCustom: true,
                soundPrompts: this.baseMoodData.happy.soundPrompts, // Inherit sounds
            };

            this.customKitties[moodId] = newKitty;
            this.moodData[moodId] = newKitty;
            this.saveCustomKitties();
            this.renderMoodButtons();
            
            this.showMeowBubble("I'm here! Let's play! ✨");
            this.selectMood(moodId);

        } catch (error) {
            console.error("Error creating new kitty:", error);
            this.showMeowBubble("Oh no! Couldn't find a kitty. 😿");
        }

        this.isGenerating = false;
        this.setLoading(false);
        this.newKittyBtn.textContent = '💖 Adopt a New Kitty!';
    }
    
    saveCustomKitties() {
        localStorage.setItem('customKitties', JSON.stringify(this.customKitties));
        this.updateClearButtonVisibility();
    }

    loadCustomKitties() {
        const saved = localStorage.getItem('customKitties');
        if (saved) {
            this.customKitties = JSON.parse(saved);
            this.moodData = { ...this.baseMoodData, ...this.customKitties };
        }
        this.updateClearButtonVisibility();
    }
    
    clearCustomKitties() {
        this.customKitties = {};
        this.moodData = { ...this.baseMoodData };
        localStorage.removeItem('customKitties');
        this.renderMoodButtons();
        this.selectMood('happy');
        this.updateClearButtonVisibility();
        this.showMeowBubble("All adopted kitties have gone home. 🐾");
    }
    
    updateClearButtonVisibility() {
        const hasCustomKitties = Object.keys(this.customKitties).length > 0;
        this.clearKittiesBtn.style.display = hasCustomKitties ? 'block' : 'none';
    }

    setLoading(isLoading) {
        this.generateBtn.disabled = isLoading;
        this.surpriseBtn.disabled = isLoading;
        this.newKittyBtn.disabled = isLoading;
        
        if (isLoading) {
            this.generateBtn.textContent = '🎵 Generating...';
        } else {
            this.generateBtn.textContent = '🎵 Generate Meow';
        }
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