class VirtualKeyboard {
    constructor() {
        this.currentLanguage = 'en';
        this.isShift = false;
        this.isSymbols = false;
        this.textInput = document.getElementById('textInput');
        this.keyboard = document.getElementById('keyboard');
        this.init();
    }

    init() {
        this.initLanguageSelector();
        this.renderKeyboard();
        this.addEventListeners();
    }

    initLanguageSelector() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLanguage = btn.dataset.lang;
                this.renderKeyboard();
            });
        });
    }

    renderKeyboard() {
        this.keyboard.innerHTML = '';
        const layout = this.isShift ? LAYOUTS[this.currentLanguage].shift : LAYOUTS[this.currentLanguage].default;

        layout.forEach((row, rowIndex) => {
            const keyboardRow = document.createElement('div');
            keyboardRow.className = 'keyboard-row';

            // إضافة زر Shift في بداية الصف الأخير
            if (rowIndex === layout.length - 1) {
                const shiftKey = this.createKey('Shift', 'special shift-key');
                keyboardRow.appendChild(shiftKey);
            }

            row.forEach(key => {
                const keyElement = this.createKey(key);
                keyboardRow.appendChild(keyElement);
            });

            // إضافة زر Backspace في نهاية كل صف
            if (rowIndex === 0) {
                const backspaceKey = this.createKey('⌫', 'special backspace-key');
                keyboardRow.appendChild(backspaceKey);
            }

            this.keyboard.appendChild(keyboardRow);
        });

        // إضافة صف مفتاح المسافة
        const spaceRow = document.createElement('div');
        spaceRow.className = 'keyboard-row';
        
        // إضافة أزرار إضافية في صف المسافة
        const symbolsKey = this.createKey('123', 'special');
        const spaceBar = this.createKey(' ', 'space');
        const enterKey = this.createKey('Enter', 'special');
        
        spaceRow.appendChild(symbolsKey);
        spaceRow.appendChild(spaceBar);
        spaceRow.appendChild(enterKey);
        
        this.keyboard.appendChild(spaceRow);
    }

    createKey(content, additionalClass = '') {
        const key = document.createElement('div');
        key.className = `key ${additionalClass}`;
        key.textContent = content;
        key.addEventListener('click', () => this.handleKeyClick(content));
        return key;
    }

    handleKeyClick(key) {
        switch(key) {
            case 'Shift':
                this.isShift = !this.isShift;
                this.renderKeyboard();
                break;
            case '⌫':
                const text = this.textInput.value;
                this.textInput.value = text.substring(0, text.length - 1);
                break;
            case '123':
                this.isSymbols = !this.isSymbols;
                this.renderKeyboard();
                break;
            case 'Enter':
                this.textInput.value += '\n';
                break;
            default:
                this.textInput.value += key;
                if (this.isShift) {
                    this.isShift = false;
                    this.renderKeyboard();
                }
        }
        this.textInput.focus();
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') {
                this.isShift = true;
                this.renderKeyboard();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') {
                this.isShift = false;
                this.renderKeyboard();
            }
        });

        // Handle physical keyboard input
        this.textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                // Let the default backspace behavior work
                return;
            }
            if (e.key.length === 1) {
                e.preventDefault();
                this.handleKeyClick(e.key);
            }
        });
    }
}

// Initialize the virtual keyboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VirtualKeyboard();
});
