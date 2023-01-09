// ID успешной посылки: 65033571

/*
-- ПРИНЦИП РАБОТЫ --
Для решения задачи я реализовала очередь на стеке. В стек добавляются поступающие на вход числа и знаки.
Принцип работы такой: если на вход поступает число, то записываем его в стек.
Если на вход поступает знак, то применяем его к предыдущим числам и
перезаписываем результат в стек на место этих чисел. В качестве результата выводится
результат последней операции.

-- ДОКАЗАТЕЛЬСТВО КОРРЕКТНОСТИ --
Из описания алгоритма следует, что чем раньше элемент добавился в очередь,
тем позже он будет из неё извлечён по принципу LIFO.

Таким образом, мы можем добавлять числа в стек до тех пор, пока на вход не поступит знак следущей операции.
Операция будет произведена над последними 2.

-- ВРЕМЕННАЯ СЛОЖНОСТЬ --
Добавление в очередь стоит O(1), потому что добавление в стек стоит O(1).

Произведение операции над последними 2 числами стоит О(n), потому что
из стека нужно извлечь последние два числа + проихвести над ними операцию.

-- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --
Если очередь содержит n элементов, то входной стек содержит n элементов и занимает O(n) памяти.
*/


const _readline = require('readline');

const _reader = _readline.createInterface({
    input: process.stdin
});

let _inputLine = '';

_reader.on('line', line => {
    _inputLine = line;
});

process.stdin.on('end', solve);

class Stack {
    constructor(expression) {
        this.stack = expression.split(" ");
        this.head = 0;
    }
    size() {
        return this.stack.length;
    }
    transform() {
        const match = {
            '+': function(x, y) {
                return x + y
            },
            '-': function(x, y) {
                return x - y
            },
            '*': function(x, y) {
                return x * y
            },
            '/': function(x, y) {
                return x / y
            },
        }
        let trial = this.stack;
        let polishNotation = [];
        for (let i = 0; i < trial.length; i++) {
            if (!isNaN(Number(trial[i]))) {
                polishNotation.push(Number(this.stack[i]));
            } else {
                let x = polishNotation[polishNotation.length - 2];
                let y = polishNotation[polishNotation.length - 1];
                polishNotation.splice(polishNotation.length - 2, polishNotation.length - 1);
                polishNotation.push(Math.floor(match[this.stack[i]](x, y)));
            }
        }

        return polishNotation[polishNotation.length - 1];
    }
}

function applyStack(expression) {
    let stack = new Stack(expression);
    return stack.transform();
}

function solve() {
    const expression = _inputLine;
    process.stdout.write(`${applyStack(expression)}`);
}