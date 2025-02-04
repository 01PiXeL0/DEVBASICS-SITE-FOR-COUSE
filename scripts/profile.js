class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.initializeProfile();
        this.initializeEventListeners();
    }

    initializeProfile() {
        // Проверяем авторизацию
        const savedUser = localStorage.getItem('currentUser');
        if (!savedUser) {
            window.location.href = '/index.html';
            return;
        }

        this.currentUser = JSON.parse(savedUser);
        this.updateProfileInfo();
        this.updateAuthUI();
        this.loadProgress();
    }

    initializeEventListeners() {
        // Обработчик для кнопки выхода
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logout-btn')) {
                e.preventDefault();
                this.handleLogout();
            }
        });
    }

    updateProfileInfo() {
        // Заполняем информацию о пользователе
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        
        if (userName && userEmail) {
            userName.textContent = this.currentUser.name;
            userEmail.textContent = this.currentUser.email;
        }
    }

    updateAuthUI() {
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.innerHTML = `
                <div class="user-menu">
                    <span class="user-name">${this.currentUser.name}</span>
                    <div class="user-dropdown">
                        <a href="/pages/auth/profile.html">Профиль</a>
                        <a href="/pages/auth/settings.html">Настройки</a>
                        <a href="#" class="logout-btn">Выйти</a>
                    </div>
                </div>
            `;
        }
    }

    loadProgress() {
        // Загружаем прогресс пользователя (пока заглушка)
        const coursesProgress = {
            'HTML и CSS': 30,
            'JavaScript': 15,
            'Python': 0
        };

        // Обновляем прогресс-бары
        const progressCards = document.querySelectorAll('.progress-card');
        progressCards.forEach(card => {
            const courseName = card.querySelector('h3').textContent;
            const progress = coursesProgress[courseName] || 0;
            const progressBar = card.querySelector('.progress');
            const progressText = card.querySelector('.progress-text');
            
            // Анимируем заполнение прогресс-бара
            setTimeout(() => {
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${progress}% завершено`;
            }, 200);
        });
    }

    handleLogout() {
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const profileManager = new ProfileManager();
});