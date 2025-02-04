const testData = {
    html: {
        title: 'HTML & CSS Основы',
        questions: [
            {
                question: 'Что означает HTML?',
                answers: [
                    'Hyper Text Markup Language',
                    'High Tech Modern Language',
                    'Hyper Transfer Markup Language',
                    'Home Tool Markup Language'
                ],
                correct: 0,
                explanation: 'HTML (HyperText Markup Language) - это стандартный язык разметки для создания веб-страниц.'
            },
            {
                question: 'Какой тег используется для создания параграфа?',
                answers: [
                    '<paragraph>',
                    '<p>',
                    '<par>',
                    '<text>'
                ],
                correct: 1,
                explanation: 'Тег <p> является стандартным HTML-тегом для создания параграфов текста.'
            },
            {
                question: 'Как правильно подключить внешний CSS файл?',
                answers: [
                    '<style src="style.css">',
                    '<link rel="stylesheet" href="style.css">',
                    '<css href="style.css">',
                    '<stylesheet>style.css</stylesheet>'
                ],
                correct: 1,
                explanation: 'Для подключения внешнего CSS файла используется тег <link> с атрибутами rel="stylesheet" и href.'
            },
            {
                question: 'Какой тег используется для создания заголовка первого уровня?',
                answers: [
                    '<header>',
                    '<h1>',
                    '<heading1>',
                    '<title>'
                ],
                correct: 1,
                explanation: 'Тег <h1> используется для создания главного заголовка страницы.'
            },
            {
                question: 'Какое CSS свойство используется для изменения цвета текста?',
                answers: [
                    'text-color',
                    'font-color',
                    'color',
                    'text-style'
                ],
                correct: 2,
                explanation: 'Свойство color используется для задания цвета текста в CSS.'
            }
        ]
    },
    js: {
        title: 'JavaScript Основы',
        questions: [
            {
                question: 'Как объявить переменную в JavaScript?',
                answers: [
                    'var name',
                    'variable name',
                    'v name',
                    'name = v'
                ],
                correct: 0,
                explanation: 'В JavaScript переменные объявляются с помощью ключевых слов var, let или const.'
            },
            {
                question: 'Какой оператор используется для строгого сравнения?',
                answers: [
                    '==',
                    '===',
                    '=',
                    '!='
                ],
                correct: 1,
                explanation: 'Оператор === проверяет равенство значений и типов данных.'
            },
            {
                type: 'code',
                question: 'Напишите функцию, которая возвращает сумму двух чисел:',
                initialCode: 'function sum(a, b) {\n  // Ваш код здесь\n}',
                testCases: [
                    { input: [2, 3], expected: 5 },
                    { input: [-1, 1], expected: 0 }
                ],
                solution: 'function sum(a, b) {\n  return a + b;\n}',
                explanation: 'Функция должна принимать два параметра и возвращать их сумму используя оператор +.'
            },
            {
                question: 'Как получить длину массива в JavaScript?',
                answers: [
                    'array.length()',
                    'array.size',
                    'array.length',
                    'array.count'
                ],
                correct: 2,
                explanation: 'Свойство length возвращает количество элементов в массиве.'
            },
            {
                question: 'Какой метод используется для добавления элемента в конец массива?',
                answers: [
                    'push()',
                    'append()',
                    'add()',
                    'insert()'
                ],
                correct: 0,
                explanation: 'Метод push() добавляет один или несколько элементов в конец массива.'
            }
        ]
    },
    python: {
        title: 'Python Основы',
        questions: [
            {
                question: 'Как объявить список в Python?',
                answers: [
                    'array(1, 2, 3)',
                    '[1, 2, 3]',
                    'list(1, 2, 3)',
                    '{1, 2, 3}'
                ],
                correct: 1,
                explanation: 'В Python списки создаются с помощью квадратных скобок [].'
            },
            {
                question: 'Какой оператор используется для целочисленного деления?',
                answers: [
                    '/',
                    '//',
                    '%',
                    'div'
                ],
                correct: 1,
                explanation: 'Оператор // выполняет целочисленное деление в Python.'
            },
            {
                question: 'Как создать функцию в Python?',
                answers: [
                    'function myFunc():',
                    'def myFunc():',
                    'func myFunc():',
                    'define myFunc():'
                ],
                correct: 1,
                explanation: 'Ключевое слово def используется для определения функций в Python.'
            },
            {
                question: 'Какой тип данных используется для хранения уникальных значений?',
                answers: [
                    'list',
                    'tuple',
                    'set',
                    'dict'
                ],
                correct: 2,
                explanation: 'Set (множество) хранит только уникальные значения и создается с помощью фигурных скобок {}.'
            },
            {
                question: 'Как получить длину строки в Python?',
                answers: [
                    'str.length()',
                    'str.size()',
                    'length(str)',
                    'len(str)'
                ],
                correct: 3,
                explanation: 'Функция len() используется для получения длины строк, списков и других последовательностей.'
            }
        ]
    }
};