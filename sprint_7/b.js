// ID успешной посылки: 69333485

/*
-- ПРИНЦИП РАБОТЫ --
Подробное описание алгоритма - https://ru.wikipedia.org/wiki/Задача_разбиения_множества_чисел

-- ДОКАЗАТЕЛЬСТВО КОРРЕКТНОСТИ --
Доказательство алгоритма - https://ru.wikipedia.org/wiki/Задача_разбиения_множества_чисел

-- ВРЕМЕННАЯ СЛОЖНОСТЬ --
O(n*s), где n - количество элементов массива, s - размер суммы.

-- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --
O(s), где s - размер суммы.

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

// всп. функция для нахождения полу-суммы
function isSubsetSum(arr, n, sum, dp) {
    // базовые случаи
    if (sum == 0)
        return true;
    if (n == 0 && sum != 0) {
        return false;
    }

    // вернуть решение (находится в dp[n][sum])
    if (dp[n][sum] != -1) {
        return dp[n][sum];
    }

    // если последний элемент массива больше суммы, отбрасываем его
    if (arr[n - 1] > sum) {
        return isSubsetSum(arr, n - 1, sum, dp);
    }

    // иначе проверяем, можно ли получить сумму вкл. или исключая последний элемент массива из суммы
    // записываем результат в матрицу dp
    return dp[n][sum] = isSubsetSum(arr, n - 1, sum, dp) || isSubsetSum(arr, n - 1, sum - arr[n - 1], dp);
}

// возвращает true, если массив делится на дые равные подсуммы
function findPartion(arr, n) {
    // считаем сумму всех элементов в массиве
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += arr[i];
    }
    // если сумма нечетная, то найти подсуммы нельзя -> false 
    if (sum % 2 != 0) {
        return 'False';
    }
    // создаем матрицу для хранения результата
    let dp = new Array(n + 1).fill(new Array(sum + 1).fill(-1));
    // проверяем, существует ли подсумма равная sum / 2
    return (isSubsetSum(arr, n, sum / 2, dp) ? 'True' : 'False');
}

function solve() {
    const n = Number(_inputLines[0]);
    const arr = _inputLines[1].trim(" ").split(" ").map(num => Number(num));
    process.stdout.write(`${findPartion(arr, n)}`);
}