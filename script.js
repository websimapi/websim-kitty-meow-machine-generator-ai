class KittyMeowMachine {
    constructor() {
        this.currentMood = 'happy';
        this.meowHistory = [];
        this.isGenerating = false;
        this.isCustomCat = false;
        this.currentCatDescription = 'An adorable happy orange cat';
        
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
        this.newKittyBtn = document.getElementById('newKittyBtn');
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

        this.newKittyBtn.addEventListener('click', () => {
            this.createNewKitty();
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
        if (!this.isCustomCat) {
            const moodData = this.moodData[this.currentMood];
            this.catImage.src = moodData.image;
        }
        
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
            
            // Generate AI meow text
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a cat. Generate a short, cute meow or cat-like phrase that fits the specified mood and cat description. Add cat emojis. Keep it under 50 characters. The user will provide the mood and a description of you.`
                    },
                    {
                        role: "user",
                        content: `My mood is: ${this.currentMood}. My description is: ${this.currentCatDescription}`
                    }
                ]
            });

            const aiMeow = completion.content;
            this.showMeowBubble(aiMeow);
            
            // Generate AI sound effect
            const soundPrompt = moodData.soundPrompts[Math.floor(Math.random() * moodData.soundPrompts.length)];
            
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
    
    async createNewKitty() {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.newKittyBtn.textContent = '💖 Finding a kitty...';
        this.newKittyBtn.disabled = true;
        this.setLoading(true);

        try {
            this.showMeowBubble("Let's find you a new friend! 🐾");

            const chatCompletion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a cat character creator. Describe a unique, adorable cartoon cat. Be concise and creative. Just the description, no preamble. E.g., 'A fluffy calico cat wearing a tiny bow tie, looking curious.' or 'A chubby tabby cat with a star on its forehead.'"
                    },
                    {
                        role: "user",
                        content: "Create a new cat character for me."
                    }
                ],
            });
            const catDescription = chatCompletion.content;
            this.currentCatDescription = catDescription;

            const imagePrompt = `${catDescription}, happy expression, anime/kawaii style, cute, simple background`;

            const imageResult = await websim.imageGen({
                prompt: imagePrompt,
                transparent: true,
                aspect: 'square'
            });

            this.catImage.src = imageResult.url;
            this.isCustomCat = true;
            this.showMeowBubble("I'm here! Let's play! ✨");
            this.selectMood('happy');

        } catch (error) {
            console.error("Error creating new kitty:", error);
            this.showMeowBubble("Oh no! Couldn't find a kitty. 😿");
        }

        this.isGenerating = false;
        this.newKittyBtn.textContent = '💖 Adopt a New Kitty!';
        this.newKittyBtn.disabled = false;
        this.setLoading(false);
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.generateBtn.disabled = true;
            this.surpriseBtn.disabled = true;
            this.newKittyBtn.disabled = true;
        } else {
            this.generateBtn.disabled = false;
            this.surpriseBtn.disabled = false;
            this.newKittyBtn.disabled = false;
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