document.addEventListener('DOMContentLoaded', function() {
    // Кнопка копирования кода
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.previousElementSibling;
            const code = codeBlock.textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Скопировано!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Ошибка при копировании:', err);
            });
        });
    });

    // Проверка практического задания
    const checkButton = document.querySelector('.btn-check');
    const codeTextarea = document.querySelector('#practice-code');

    checkButton.addEventListener('click', function() {
        const code = codeTextarea.value;
        
        // Создаем временный DOM-элемент для парсинга HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(code, 'text/html');
        
        let errors = [];
        let successes = [];
        let allCorrect = true;

        // Проверяем DOCTYPE
        if (!code.toLowerCase().includes('<!doctype html>')) {
            errors.push('❌ Отсутствует DOCTYPE declaration');
            allCorrect = false;
        } else {
            successes.push('✅ DOCTYPE указан верно');
        }

        // Проверяем базовую структуру
        if (!doc.querySelector('html')) {
            errors.push('❌ Отсутствует корневой элемент <html>');
            allCorrect = false;
        } else {
            successes.push('✅ Элемент <html> присутствует');
        }

        if (!doc.querySelector('head')) {
            errors.push('❌ Отсутствует элемент <head>');
            allCorrect = false;
        } else {
            successes.push('✅ Элемент <head> присутствует');
        }

        if (!doc.querySelector('title')) {
            errors.push('❌ Отсутствует элемент <title>');
            allCorrect = false;
        } else {
            successes.push('✅ Элемент <title> присутствует');
        }

        if (!doc.querySelector('body')) {
            errors.push('❌ Отсутствует элемент <body>');
            allCorrect = false;
        } else {
            successes.push('✅ Элемент <body> присутствует');
        }

        // Проверяем заголовки и параграфы
        const h1Elements = doc.querySelectorAll('h1');
        if (h1Elements.length === 0) {
            errors.push('❌ Отсутствует заголовок первого уровня <h1>');
            allCorrect = false;
        } else if (h1Elements.length > 1) {
            errors.push('⚠️ На странице больше одного заголовка <h1>');
            allCorrect = false;
        } else {
            successes.push('✅ Заголовок <h1> присутствует');
        }

        const h2Elements = doc.querySelectorAll('h2');
        if (h2Elements.length === 0) {
            errors.push('❌ Отсутствует заголовок второго уровня <h2>');
            allCorrect = false;
        } else {
            successes.push('✅ Заголовок <h2> присутствует');
        }

        const paragraphs = doc.querySelectorAll('p');
        if (paragraphs.length < 2) {
            errors.push('❌ Необходимо минимум два параграфа <p>');
            allCorrect = false;
        } else {
            successes.push('✅ Параграфы присутствуют (минимум 2)');
        }

        // Удаляем предыдущее модальное окно, если оно существует
        const existingModal = document.querySelector('.result-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Создаем модальное окно с результатами
        const modal = document.createElement('div');
        modal.className = 'result-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    ${allCorrect 
                        ? '<h3>🎉 Отлично! Все верно!</h3>' 
                        : '<h3>🤔 Есть что исправить</h3>'
                    }
                    <button class="modal-close-btn">&times;</button>
                </div>
                <div class="results-list">
                    ${errors.length > 0 ? errors.map(e => `<div class="error-item">${e}</div>`).join('') : ''}
                    ${successes.length > 0 ? successes.map(s => `<div class="success-item">${s}</div>`).join('') : ''}
                </div>
                <button class="modal-close">Закрыть</button>
            </div>
        `;

        // Добавляем стили для модального окна
        const modalStyles = `
            .result-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: var(--card-background);
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                border: 2px solid var(--primary-color);
                position: relative;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid var(--primary-color);
            }
            .modal-content h3 {
                color: var(--primary-color);
                margin: 0;
                font-size: 1.5rem;
            }
            .modal-close-btn {
                background: none;
                border: none;
                color: var(--primary-color);
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .modal-close-btn:hover {
                color: var(--secondary-color);
            }
            .results-list {
                margin-bottom: 20px;
                max-height: 300px;
                overflow-y: auto;
            }
            .success-item {
                color: #2ecc71;
                margin-bottom: 10px;
                padding: 5px 0;
            }
            .error-item {
                color: #e74c3c;
                margin-bottom: 10px;
                padding: 5px 0;
            }
            .modal-close {
                background: var(--primary-color);
                color: #000;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                width: 100%;
                transition: background-color 0.3s;
            }
            .modal-close:hover {
                background: var(--secondary-color);
            }
        `;

        // Добавляем стили на страницу
        const styleSheet = document.createElement('style');
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
        document.body.appendChild(modal);

        // Обработчики закрытия модального окна
        const closeModal = () => {
            modal.remove();
            styleSheet.remove();
        };

        modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Добавляем обработчик клавиши Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Если все верно, добавляем класс success кнопке
        if (allCorrect) {
            checkButton.classList.add('success');
        } else {
            checkButton.classList.remove('success');
        }
    });

    // Кнопка завершения урока
    const completeButton = document.querySelector('.complete-lesson');
    completeButton.addEventListener('click', function() {
        // Сохраняем прогресс
        const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        progress['html-css'] = progress['html-css'] || {};
        progress['html-css'].lesson1 = true;
        progress['html-css'].lastCompletedLesson = 1;
        localStorage.setItem('courseProgress', JSON.stringify(progress));

        // Обновляем состояние кнопки
        completeButton.textContent = 'Урок пройден ✓';
        completeButton.classList.add('completed');
    });

    // Проверяем, был ли урок уже пройден
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    if (progress['html-css']?.lesson1) {
        completeButton.textContent = 'Урок пройден ✓';
        completeButton.classList.add('completed');
    }
});