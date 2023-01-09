// ID успешной посылки: 68353868

/*
-- ПРИНЦИП РАБОТЫ --
Для решения задачи я создала индекс.
Индекс - особая структуру, которая позволяет выполнять запросы быстрее.

-- ДОКАЗАТЕЛЬСТВО КОРРЕКТНОСТИ --
Релевантность документа оценивается следующим образом: для каждого уникального слова из запроса берётся число его вхождений в документ, полученные числа для всех слов из запроса суммируются.
Индекс - это хеш-мапа из слов в массивы пар (номер документа, количество вхождений в документ).
Например, если дано три документа:
0. foo bar xyz bar
1. bar bar
2. xyz foo

то индекс будет выглядеть так:

{
  foo: { 0: 1, 2: 1},
  bar: { 0: 2, 1: 2 },
  xyz: { 2: 1 }
}

Каждый запрос разбивается на слова. Для того, чтобы считать релевантность запроса заводится хэш-мапу из индексов документов
в "количество очков". Используя индекс, заполняется хеш-мапа. По этой хеш-мапе считается релевантность.

-- ВРЕМЕННАЯ СЛОЖНОСТЬ --
Временная сложность алгоритма оценивается в два этапа.
Первого этап равен O(n*k), где k - количество слов в документе. (один цикл)
Второй этап равен O(m * k * n * nlog(n)), где m - число запросов, k - число уникальных слов в запросе, n - число документов.

-- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --
Пространственная сложность алгоритма оценивается в два этапа.
Первый этап равен O(n*k).
Второй этап равен О(n) - выделяется дополнительная память для хранения релевантности запросов в разрезе документов.
*/
const { read } = require('fs');
const _readline = require('readline');

const _reader = _readline.createInterface({
    input: process.stdin
});

const _inputLines = [];
let _curLine = 0;

_reader.on('line', line => {
    _inputLines.push(line);
});

process.stdin.on('end', solve);

function runSearch(docArr, reqArr) {
    // хеш-таблица для слов из документов (индекс)
    let docHashTable = new Map();
    let doc;
    for (let i = 0; i < docArr.length; i++) {
        doc = docArr[i].split(' ');
        for (let j = 0; j < doc.length; j++) {
            let word = doc[j];
            if (docHashTable.has(word)) {
                let obj = docHashTable.get(word);
                if (obj[i]) {
                    docHashTable.set(word, {...obj, [i]: obj[i] +=1});
                } else {
                    docHashTable.set(word, {...obj, [i]: 1});
                }
            } else {
                docHashTable.set(word, {[i]: 1});
            }
        }
    }
    // console.log(docHashTable)
    // разбиваем запрос на слова
    let score = {};
    function emptyRes() {
        docArr.forEach((doc, i) => {
            score[i] = 0
        });
    }
    emptyRes();
    reqArr.forEach(req => {
        let req_words = [];
        req.split(' ').forEach((word, i) => {
            !req_words.includes(word) ? req_words.push(word) : null;
        });
        // записываем счет
        let keys = [];
        req_words.forEach(word => {
            if (docHashTable.has(word)) {
                // console.log(word)
                keys = Object.keys(docHashTable.get(word))
                keys.forEach(key => {
                    score[key] += docHashTable.get(word)[key]
                });
                // console.log(score)
            }
        });
        // console.log('score', score)
        keys = Object.keys(score);
        let res = [];
        for (let i = 0; i < keys.length; i++) {
            res.push([i+1, score[i]]);
        }
        // console.log('res', res)
        let result = res.sort((prevPoints, nextPoints) => nextPoints[1] - prevPoints[1]).filter(points => points[1] != 0).splice(0, 5);
        let printArr = [];
        result.forEach((element, i) => {
            printArr[i] = element[0];
        })
        console.log(printArr.join(' '))
        emptyRes();
    });
    return ''
}

function solve() {
    const doc_length = readInt();
    const docs = readArray(doc_length);
    const req_length = readInt();
    const requests = readArray(req_length);
    process.stdout.write(`${runSearch(docs, requests)}`);
}


function readInt() {
    const n = Number(_inputLines[_curLine]);
    _curLine++;
    return n;
}
function readLine() {
    const line = _inputLines[_curLine];
    _curLine++;
    return line;
}
function readArray(num) {
    var arr = [];
    for (let i = 0; i !== num; i++) {
        arr[i] = readLine();
    }
    return arr;
}