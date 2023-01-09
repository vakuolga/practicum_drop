// ID успешной посылки: 68353868

/*
-- ПРИНЦИП РАБОТЫ --
Для решения задачи я реализовала структуру данных хеш-таблица на основе массива.
Ключи распределяются в таблице и доступны по значениям О -- n.
Хеш-таблица поддерживатет следующие операции: 
put(key value) —– добавление пары ключ-значение. Если заданный ключ уже есть в таблице, то соответствующее ему значение обновляется. 
get(key) –— получение значения по ключу. Если ключа нет в таблице, выводится «None». Иначе выводится найденное значение. 
delete(key) –— удаление ключа из таблицы. Если такого ключа нет, то выводится «None». Иначе выводистя хранимое по данному ключу значение, и ключ удаляется.

Коллизии разрешаются с помощью метода цепочек.

-- ДОКАЗАТЕЛЬСТВО КОРРЕКТНОСТИ --
Хешированное значение - остаток деления входного ключа на число М.
В качествве числа М взято большое простое число - такое, которое делится только на себя и на 1.
Благодаря этому принципу количетсово колизий минимальное.

Добавляемые на уже существующие позиции значения обновляются. Поэтому по аналогичрым ключам после их обновления доступны новые значения.

-- ВРЕМЕННАЯ СЛОЖНОСТЬ --
Благодаре вывбранной структуре данных все операции выполняются в среднем за O(1).

-- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --
Пространственная сложность равна О(n) - в зависимости от размера вхводных данных. 
*/
class Node {	
    constructor(key, value) {
        this[key] = value;  
        this.next = null;
    }
}

class List {
    constructor(node) {
        this.head = node;
    }
}

class HashTable {
    constructor(size) {
        this.table = Array.from(size);
        this.size = size;
    }
    hash(key) {
        return key % 7279111111333111
    }
    get(key) {
        let id = this.hash(key);
        let bucket = this.table[id];
        if (!bucket || bucket.head == undefined || !bucket.head[key]) {
            return 'None';
        } else {
            return bucket.head[key];
        }
    }
    // Если заданный ключ уже есть в таблице, то соответствующее ему значение обновляется
    put(key, value) {
        let id = this.hash(key);
        let bucket = this.table[id];
        let item = new Node(key, value);
        if(!bucket) {
            bucket = new List(item);
            this.table[id] = bucket;
        }
        bucket.head = item;
    }
    // Удаление ключа из таблицы
    remove(key) {
        let id = this.hash(key);
        let bucket = this.table[id];
        if (!bucket || bucket.head == undefined || !bucket.head[key]) {
            return 'None';
        } else {
            let res = bucket.head[key];
            delete bucket.head
            return res;
        }
    }
}

function runHashFunc(size, actions) {
    let res = [];
    let hashTable = new HashTable(size);
    actions.forEach(action => {
        let temp = action.split(' ');
        if (temp[0] == 'get') {
            res.push(hashTable.get(temp[1]))
        } else if (temp[0] == 'put') {
            hashTable.put(temp[1], temp[2]);
        } else {
            res.push(hashTable.remove(temp[1]));
        }
    });
    return res.join('\r\n');
}

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

function solve() {
    const size = readInt();
    const actions = readArray(size);
    process.stdout.write(`${runHashFunc(size, actions)}`);
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
        arr.push(readLine());
    }
    return arr;
}