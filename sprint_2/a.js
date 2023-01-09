// ID успешной посылки: 65033601

/*
-- ПРИНЦИП РАБОТЫ --
Для решения задачи я реализовала структуру данных дек.
Это двусторонняя очередь: элементы можно добавлять и удалять из начала и конца очереди.
В решении не использовала связный список.

Если на момент извлечения из очереди дек пуст,
то программа выдает "error". То же самое происходит,
если пытаться добавить элемент в полный дек.

-- ДОКАЗАТЕЛЬСТВО КОРРЕКТНОСТИ --
Принцип работы такой: если элементы добавляются в голову (начало массива),
то увеличивается размер дека и индекс головы - начального значения массива.
Если индекс головы - 0, то значение запишется в эту позицию, следующие - "за него".

Этого можно добиться, считая индекс головы по формуле this.head = (this.head + this.max_n - 1) % this.max_n,
где max_n - максимальный размер массива. Получается, что элемент с индексом 0 всегда окажется в позиции точно за 0 слева,
а следующтие значения будут следовать за ним в направлении справа налево. Выглядит это так:
(0+максимум-предпоследний)%максимум=делитель
На примере 10:
голова в 0: (0+10-1)%10 = 9%10 = 9 (максимальный индекс);
голова в 9: (9+10-1)%10 = 18%10 = 8;
...
голова в 1: (1+10-1)%10 = 10%10 = 0;

А так считается хвост дека: this.tail = (this.tail + 1) % this.max_n
Получается, что элеемент с индексом 0 всегда помещается в 1 позицию ((0+1)%максимум = 1), а следующие записываются
слева направо:
((1+1)%максимум = 2, (2+1)%максимум=3, ..., (максимум-1)%максимум=предпоследний, максимум%максимум=0 - перебрасывается.)

-- ВРЕМЕННАЯ СЛОЖНОСТЬ --
И добавление, и извлечение в/ из дека стоит O(1), потому что всегда существует указатель на предполагаемый индекс.
В противном случае дек либо полон, либо пуст. В этих ситуациях за О(1) выводится ошибка - размер дека всегда известен.

-- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --
Пространственная сложность равна О(n), то есть входной длинне массива.
*/

const _readline = require('readline');
const {
    threadId
} = require('worker_threads');

const _reader = _readline.createInterface({
    input: process.stdin
});

const _inputLines = [];
let _curLine = 0;

_reader.on('line', line => {
    _inputLines.push(line);
});

process.stdin.on('end', solve);

class Deque {	
    constructor(m) {
        this.queue = new Array(m);
        this.head = m - 1;
        this.tail = 0;
        this.size = 0;
        this.max_n = m;
    }
    isfull() {
        return this.size === this.max_n;
    }
    isempty() {
        return this.size === 0;
    }
    push_front(value) {
        if (this.isfull()) {
            return 'error';
        } else {
            ++this.size;
			this.queue[this.head] = value;
			this.head = (this.head + this.max_n - 1) % this.max_n;
        }
    }
    push_back(value) {
        if (this.isfull()) {
            return 'error'
        } else {
            ++this.size;
			this.queue[this.tail] = value;
			this.tail = (this.tail + 1) % this.max_n;
        }
    }
    pop_front() {
        if (this.isempty()) {
            return 'error';
        } else {
            --this.size;
            this.head = (this.head + 1) % this.max_n;
            return this.queue[this.head];
        }
    }
    pop_back() {
        if (this.isempty()) {
            return 'error';
        } else {
            --this.size;
            this.tail = (this.tail + this.max_n - 1) % this.max_n;
            return this.queue[this.tail];
        }
    }
}

function applyDeque(m, actions) {
    let deque = new Deque(m);
    let res = []
    for (let i = 0; i < actions.length; i++) {
        if (actions[i].length > 1) {
            let foo = deque[actions[i][0]](actions[i][1]);
            if (foo !== undefined) {
                res.push(foo);
            }
        } else {
            res.push(deque[actions[i][0]]());
        }
    }
    return res.join('\r\n')
}

function solve() {
    const n = readInt();
    const m = readInt();
    const actions = readActionArray(n);

    process.stdout.write(`${applyDeque(m, actions)}`);
}

function readInt() {
    const n = Number(_inputLines[_curLine]);
    _curLine++;
    return n;
}

function readAction() {
    var line = _inputLines[_curLine].trim(" ").split(" ");
    _curLine++;
    return line;
}

function readActionArray(count) {
    var arr = [];
    for (let i = 0; i !== count; i++) {
        arr.push(readAction())
    }
    return arr;
}