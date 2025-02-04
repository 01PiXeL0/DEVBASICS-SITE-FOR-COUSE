class AuthManager {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.initializeAuth();
        this.initializeEventListeners();
        this.initializeBurgerMenu();
    }

    initializeAuth() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
            this.updateAuthUI();
        }
    }

    initializeEventListeners() {
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || 
                e.target.classList.contains('auth-modal')) {
                this.closeAuthModal();
            }
            
            if (e.target.id === 'showRegister') {
                e.preventDefault();
                this.closeAuthModal();
                this.showRegisterModal();
            }
            
            if (e.target.id === 'showLogin') {
                e.preventDefault();
                this.closeAuthModal();
                this.showLoginModal();
            }

            if (e.target.classList.contains('logout-btn')) {
                e.preventDefault();
                this.handleLogout();
            }
        });
    }

    initializeBurgerMenu() {
        const burgerHTML = `
            <div class="burger-menu">
                <div class="burger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        document.querySelector('nav').insertAdjacentHTML('beforeend', burgerHTML);
        
        document.querySelector('.burger-icon').addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
            document.querySelector('.burger-icon').classList.toggle('active');
        });
    }

    showLoginModal() {
        const modalHTML = `
            <div class="auth-modal">
                <div class="auth-modal-content">
                    <div class="modal-header">
                        <h2>Вход в систему</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" required maxlength="50">
                            </div>
                            <div class="form-group">
                                <label for="password">Пароль</label>
                                <div class="password-input">
                                    <input type="password" id="password" required maxlength="30">
                                    <i class="fas fa-eye toggle-password"></i>
                                </div>
                            </div>
                            <button type="submit" class="auth-btn">Войти</button>
                        </form>
                        <p class="auth-switch">Нет аккаунта? <a href="#" id="showRegister">Зарегистрироваться</a></p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addModalListeners('login');
    }

    showRegisterModal() {
        const modalHTML = `
            <div class="auth-modal">
                <div class="auth-modal-content">
                    <div class="modal-header">
                        <h2>Регистрация</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="registerForm">
                            <div class="form-group">
                                <label for="name">Имя</label>
                                <input type="text" id="name" required maxlength="20">
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" required maxlength="50">
                            </div>
                            <div class="form-group">
                                <label for="password">Пароль</label>
                                <div class="password-input">
                                    <input type="password" id="password" required maxlength="30">
                                    <i class="fas fa-eye toggle-password"></i>
                                </div>
                            </div>
                            <button type="submit" class="auth-btn">Зарегистрироваться</button>
                        </form>
                        <p class="auth-switch">Уже есть аккаунт? <a href="#" id="showLogin">Войти</a></p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addModalListeners('register');
    }

    addModalListeners(type) {
        const form = document.getElementById(`${type}Form`);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (type === 'login') {
                    this.handleLogin();
                } else {
                    this.handleRegister();
                }
            });
        }

        const togglePassword = document.querySelector('.toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', (e) => {
                const passwordInput = document.getElementById('password');
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                e.target.classList.toggle('fa-eye');
                e.target.classList.toggle('fa-eye-slash');
            });
        }
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        // После успешной авторизации
        this.currentUser = {
            email: email,
            name: email.split('@')[0] // Временно используем часть email как имя
        };
    
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.isLoggedIn = true;
        this.closeAuthModal();
        
        // Перенаправляем на профиль после успешного входа
        window.location.href = '/pages/auth/profile.html';
    }

    handleRegister() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        this.currentUser = {
            name: name,
            email: email
        };

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.isLoggedIn = true;
        this.updateAuthUI();
        this.closeAuthModal();
    }

    handleLogout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.isLoggedIn = false;
        this.updateAuthUI();
    }

    updateAuthUI() {
        const loginBtn = document.querySelector('.btn-login');
        if (this.isLoggedIn) {
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
            
            // Обработчик клика по имени пользователя
            const userMenu = loginBtn.querySelector('.user-menu');
            userMenu.addEventListener('click', (e) => {
                if (!e.target.classList.contains('logout-btn')) {
                    window.location.href = '/pages/auth/profile.html';
                }
            });
    
            // Обработчик для кнопки выхода
            const logoutBtn = loginBtn.querySelector('.logout-btn');
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        } else {
            loginBtn.textContent = 'Войти';
        }
    }

    closeAuthModal() {
        const modal = document.querySelector('.auth-modal');
        if (modal) {
            modal.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();
});