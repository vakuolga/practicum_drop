// ID успешной посылки: 69409552 

/* 
-- ПРИНЦИП РАБОТЫ -- 
Алгоритм представляет из себя решение задачи по поиску расстояния Левенштейна с помощью алгоритма Вагнера-Фишера.
В алгоритме используется мемоизация - таким образом ускоряется подсчет следующего результата,
а кеширование промежуточного результата в массиве размера 2 х (N+1) обеспечивает минимальный расход дополнительной памяти.

В массиве dp хранится промежуточный результат подсчета стоимости операций по модификации одной из строк.
Базовый случай в задаче - наличие пред-подсчитаного результата в кеше. В таком случае просто возвращаем результат.
Рекуррентная формула алгоритма:
https://ru.wikipedia.org/wiki/Расстояние_Левенштейна#Формула
(4. Формула)
Ответ на исходный вопрос будет располагаться в dp[m-1][n-1] с учетом индексации с единицы.
Подробное описание алгоритма - https://ru.wikipedia.org/wiki/Расстояние_Левенштейна 

-- ДОКАЗАТЕЛЬСТВО КОРРЕКТНОСТИ -- 
Доказательство алгоритма - https://ru.wikipedia.org/wiki/Расстояние_Левенштейна 

-- ВРЕМЕННАЯ СЛОЖНОСТЬ -- 
O(n*m), где n и m — длины строк. 

-- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ -- 
O(n), где n - длина наименьшей строки. 
*/
const _readline = require('readline');
const _reader = _readline.createInterface({
    input: process.stdin
});
const _inputLines = [];
_reader.on('line', line => {
    _inputLines.push(line);
});
process.stdin.on('end', solve);

function levenshteinDistance([str1, str2] = _inputLines) {
    let n = str1.length;
    let m = str2.length;

    // здесь будем кешировать результат
    let dp = new Array(2);
    for (let i = 0; i < 2; i++) {
        dp[i] = new Array(n + 1);
        for (let j = 0; j < n + 1; j++)
            dp[i][j] = 0;
    }
    // базовый случай: вторая строка пустая
    // и в нее можно только скопировать все из первой
    for (let i = 0; i <= n; i++) {
        dp[0][i] = i;
    }

    // заполняем кеш
    // проходимся циклом по второй строке
    for (let i = 1; i <= m; i++) {
        // этот цикл сравнивает буквы второй строки с первой
        for (let j = 0; j <= n; j++) {
            // если первая строка пустая, добавляем в нее букву из второй
            if (j == 0) dp[i % 2][j] = i;
            // если буквы совпадают - не делаем ничего
            // i % 2 нужно, чтобы попасть в нужную строку
            else if (str1[j - 1] == str2[i - 1]) {
                dp[i % 2][j] = dp[(i - 1) % 2][j - 1];
            }
            // если буквы не совпадают - берем результат минимальной по стоимости операции
            else {
                dp[i % 2][j] = 1 + Math.min(
                    dp[(i - 1) % 2][j],
                    Math.min(dp[i % 2][j - 1],
                        dp[(i - 1) % 2][j - 1])
                );
            }
        }
    }
    // если после подсчета длинна второй строки четная,
    // то мы оказываемся в нулевой строке. иначе - в первой.
    // поэтому возвращаем m % 2
    return dp[m % 2][n];
}

function solve() {
    process.stdout.write(`${levenshteinDistance(_inputLines)}`);
}