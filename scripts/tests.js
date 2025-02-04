class TestManager {
    constructor() {
        console.log('TestManager initialized');
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        console.log('Initializing event listeners');
        const categoryCards = document.querySelectorAll('.category-card');
        console.log('Found category cards:', categoryCards.length);

        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                console.log('Card clicked in TestManager');
                const category = card.dataset.category;
                this.startTest(category);
            });
        });

        document.getElementById('prevQuestion').addEventListener('click', () => this.navigateQuestion(-1));
        document.getElementById('nextQuestion').addEventListener('click', () => this.navigateQuestion(1));
        document.getElementById('submitTest').addEventListener('click', () => this.submitTest());

        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => this.closeModals());
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('retry-btn')) {
                this.closeModals();
                this.startTest(this.currentTest.category);
            }
        });
    }

    startTest(category) {
        console.log('Starting test for category:', category);
        this.currentTest = {
            category: category,
            data: testData[category]
        };
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.currentTest.data.questions.length).fill(null);
        this.startTime = new Date();
        
        document.getElementById('testTitle').textContent = this.currentTest.data.title;
        this.showQuestion();
        document.getElementById('testModal').style.display = 'block';
    }

    showQuestion() {
        const question = this.currentTest.data.questions[this.currentQuestionIndex];
        const totalQuestions = this.currentTest.data.questions.length;

        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = totalQuestions;
        document.getElementById('questionText').textContent = question.question;

        const answersContainer = document.getElementById('answersContainer');
        answersContainer.innerHTML = '';

        if (question.type === 'code') {
            const codeEditor = document.createElement('textarea');
            codeEditor.className = 'code-editor';
            codeEditor.value = question.initialCode;
            answersContainer.appendChild(codeEditor);

            const runButton = document.createElement('button');
            runButton.textContent = 'Запустить тесты';
            runButton.className = 'run-tests-btn';
            runButton.onclick = () => this.runCodeTests(codeEditor.value, question.testCases);
            answersContainer.appendChild(runButton);
        } else {
            question.answers.forEach((answer, index) => {
                const answerElement = document.createElement('div');
                answerElement.className = 'answer-option';
                if (this.userAnswers[this.currentQuestionIndex] === index) {
                    answerElement.classList.add('selected');
                }
                answerElement.textContent = answer;
                answerElement.addEventListener('click', () => this.selectAnswer(index));
                answersContainer.appendChild(answerElement);
            });
        }

        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const totalQuestions = this.currentTest.data.questions.length;
        document.getElementById('prevQuestion').style.display = 
            this.currentQuestionIndex === 0 ? 'none' : 'block';
        document.getElementById('nextQuestion').style.display = 
            this.currentQuestionIndex === totalQuestions - 1 ? 'none' : 'block';
        document.getElementById('submitTest').style.display = 
            this.currentQuestionIndex === totalQuestions - 1 ? 'block' : 'none';
    }

    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        
        const answers = document.querySelectorAll('.answer-option');
        answers.forEach((option, index) => {
            if (index === answerIndex) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    navigateQuestion(direction) {
        this.currentQuestionIndex += direction;
        this.showQuestion();
    }

    async runCodeTests(userCode, testCases) {
        try {
            const userFunction = new Function('return ' + userCode)();
            const results = testCases.map(test => {
                try {
                    const result = userFunction(...test.input);
                    return {
                        passed: result === test.expected,
                        input: test.input,
                        expected: test.expected,
                        actual: result
                    };
                } catch (e) {
                    return {
                        passed: false,
                        input: test.input,
                        error: e.message
                    };
                }
            });

            this.showTestResults(results);
        } catch (e) {
            this.showTestResults([{ passed: false, error: 'Ошибка в синтаксисе кода' }]);
        }
    }

    showTestResults(results) {
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'test-results';

        results.forEach((result, index) => {
            const resultElement = document.createElement('div');
            resultElement.className = `test-case ${result.passed ? 'passed' : 'failed'}`;
            
            if (result.error) {
                resultElement.textContent = `Тест ${index + 1}: Ошибка - ${result.error}`;
            } else {
                resultElement.textContent = `Тест ${index + 1}: ${result.passed ? 'Пройден' : 'Не пройден'}
                    Вход: ${JSON.stringify(result.input)}
                    Ожидалось: ${result.expected}
                    Получено: ${result.actual}`;
            }
            
            resultsContainer.appendChild(resultElement);
        });

        const answersContainer = document.getElementById('answersContainer');
        const existingResults = answersContainer.querySelector('.test-results');
        if (existingResults) {
            answersContainer.removeChild(existingResults);
        }
        answersContainer.appendChild(resultsContainer);
    }

    submitTest() {
        const totalQuestions = this.currentTest.data.questions.length;
        let correctAnswers = 0;
        const wrongAnswers = [];

        this.currentTest.data.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            
            if (question.type !== 'code') {
                if (userAnswer === question.correct) {
                    correctAnswers++;
                } else {
                    wrongAnswers.push({
                        index: index,
                        question: question.question,
                        userAnswer: userAnswer,
                        correctAnswer: question.correct,
                        explanation: question.explanation
                    });
                }
            }
        });

        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const timeSpent = Math.round((new Date() - this.startTime) / 1000);

        this.showResults(score, correctAnswers, totalQuestions, timeSpent, wrongAnswers);
    }

    showResults(score, correctAnswers, totalQuestions, timeSpent, wrongAnswers) {
        const resultsModal = document.getElementById('resultsModal');
        const resultsContainer = resultsModal.querySelector('.results-container');

        resultsContainer.innerHTML = `
            <div class="score">
                <h3>Ваш результат:</h3>
                <div class="score-number">${score}%</div>
            </div>
            <div class="results-details">
                <p>Правильных ответов: ${correctAnswers} из ${totalQuestions}</p>
                <p>Затраченное время: ${this.formatTime(timeSpent)}</p>
            </div>
            ${wrongAnswers.length > 0 ? `
                <div class="wrong-answers">
                    <h3>Неправильные ответы:</h3>
                    ${wrongAnswers.map(wrong => `
                        <div class="wrong-answer">
                            <p><strong>Вопрос:</strong> ${wrong.question}</p>
                            <p><strong>Ваш ответ:</strong> ${wrong.userAnswer !== null ? 
                                this.currentTest.data.questions[wrong.index].answers[wrong.userAnswer] : 
                                'Не отвечено'}</p>
                            <p><strong>Правильный ответ:</strong> ${
                                this.currentTest.data.questions[wrong.index].answers[wrong.correctAnswer]
                            }</p>
                            <p><strong>Объяснение:</strong> ${wrong.explanation || 'Объяснение отсутствует'}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <button class="retry-btn">Пройти заново</button>
        `;

        document.getElementById('testModal').style.display = 'none';
        resultsModal.style.display = 'block';
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    closeModals() {
        document.getElementById('testModal').style.display = 'none';
        document.getElementById('resultsModal').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    const testManager = new TestManager();
});