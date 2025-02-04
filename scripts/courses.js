document.addEventListener('DOMContentLoaded', function() {
    // Получаем прогресс из localStorage
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    const htmlCssProgress = progress['html-css'] || {};
    
    // Функция обновления статуса уроков
    function updateLessonsStatus() {
        const lessonCards = document.querySelectorAll('.lesson-card');
        let nextLessonFound = false;
        
        lessonCards.forEach((card) => {
            const lessonNumber = parseInt(card.dataset.lesson);
            const isCompleted = htmlCssProgress[`lesson${lessonNumber}`];
            const previousLessonCompleted = lessonNumber === 1 || htmlCssProgress[`lesson${lessonNumber - 1}`];
            
            // Очищаем все классы и стили
            card.classList.remove('completed', 'locked');
            card.style.pointerEvents = 'auto';
            
            // Удаляем существующие бейджи
            const existingBadge = card.querySelector('.completed-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            if (isCompleted) {
                // Урок пройден
                card.classList.add('completed');
                const icon = card.querySelector('.lesson-meta i:last-child');
                icon.className = 'fas fa-check-circle';
                icon.style.color = '#2ecc71';
                
                // Добавляем бейдж "Пройдено"
                const badge = document.createElement('div');
                badge.className = 'completed-badge';
                badge.textContent = 'Пройдено';
                card.appendChild(badge);
            } else if (!previousLessonCompleted) {
                // Урок заблокирован
                card.classList.add('locked');
                card.style.pointerEvents = 'none';
                const icon = card.querySelector('.lesson-meta i:last-child');
                icon.className = 'fas fa-lock';
                
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    showNotification('Сначала пройдите предыдущий урок', 'error');
                });
            } else if (!nextLessonFound) {
                // Следующий доступный урок
                nextLessonFound = true;
                const icon = card.querySelector('.lesson-meta i:last-child');
                icon.className = 'fas fa-play-circle';
                icon.style.color = 'var(--primary-color)';
            }
        });
    }

    // Функция обновления прогресс-бара
    function updateProgressBar() {
        const totalLessons = 15;
        const completedLessons = Object.values(htmlCssProgress).filter(value => value === true).length;
        const progressPercentage = (completedLessons / totalLessons) * 100;
        
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-card p');
        
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${completedLessons} из ${totalLessons} уроков пройдено`;
        
        // Обновляем кнопку "Начать курс"
        const startButton = document.querySelector('.start-course');
        if (completedLessons > 0) {
            startButton.textContent = 'Продолжить обучение';
            // Находим первый непройденный урок
            const nextLesson = document.querySelector('.lesson-card:not(.completed):not(.locked)');
            if (nextLesson) {
                startButton.href = nextLesson.href;
            }
        }
    }

    // Функция для показа уведомлений
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Стили уведомления
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '5px',
            backgroundColor: type === 'error' ? '#e74c3c' : '#2ecc71',
            color: 'white',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => notification.style.opacity = '1', 10);
        
        // Скрываем через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Обработчик завершения урока
    if (document.querySelector('.complete-lesson')) {
        document.querySelector('.complete-lesson').addEventListener('click', function() {
            const currentLesson = parseInt(this.dataset.lesson);
            
            // Сохраняем прогресс
            htmlCssProgress[`lesson${currentLesson}`] = true;
            progress['html-css'] = htmlCssProgress;
            localStorage.setItem('courseProgress', JSON.stringify(progress));
            
            // Обновляем UI
            this.textContent = 'Урок пройден ✓';
            this.classList.add('completed');
            this.disabled = true;
            
            // Показываем уведомление
            showNotification('Урок успешно завершен! 🎉');
            
            // Обновляем прогресс
            updateLessonsStatus();
            updateProgressBar();
            
            // Разблокируем следующий урок
            const nextLessonCard = document.querySelector(`.lesson-card[data-lesson="${currentLesson + 1}"]`);
            if (nextLessonCard) {
                nextLessonCard.classList.remove('locked');
                nextLessonCard.style.pointerEvents = 'auto';
                const icon = nextLessonCard.querySelector('.lesson-meta i:last-child');
                icon.className = 'fas fa-play-circle';
            }
        });
    }

    // Инициализация при загрузке страницы
    updateLessonsStatus();
    updateProgressBar();
});