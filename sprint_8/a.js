// ID успешной посылки: 68548807

/*
-- ПРИНЦИП РАБОТЫ --
В своем решении я опиралась на алгоритм пирамидной сортировки и его описание в Практикуме.
Для решения конкретной задачи создается пустая убывающая куча (max-heap).
В нее по одному вставляются элементы входящего массива, сохраняя сортировку от большего к меньшему.
Таким образом на вершине пирамиды оказывается самый "большой" элемент.
Затем наиболее приоритетные элементы извлекаются из кучи.
На этом этапе в вершине может оказаться элемент, нарушающий свойства пирамиды. Их нужно восстановить перед тем, как продолжить извлечение.

-- ДОКАЗАТЕЛЬСТВО КОРРЕКТНОСТИ --
Из-за того, что куча - полное бинарное дерево, оно может быть представлено в виде массивва. Однако этот массив не всегда отсортирован.
Из теории Практикума: "Выполнение свойства, при котором значение в родителе более приоритетно, чем значения в дочерних узлах, не гарантирует отсортированность."
При условии, что родительская нода находится в индексе i (начиная с 0), левый потомок находится в индексе 2 * i + 1, правый - в 2 * i + 2.
В решении используется компаратор из финальной задачи третьего спринта, т.к. условия сравнения участником в задачах аналогичные.

-- ВРЕМЕННАЯ СЛОЖНОСТЬ --
В худшем случае алгоритм работает за O(nlogn): 
-- создание бинарной кучи - О(1) и
-- вставка жлементов в бинарную кучу O(log1)+O(log2)+...+O(logn)

-- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --
Для такой реализациинужно выделить память под массив, пространственная сложность - О(n).

*/

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

function sortStudents(studentsArr) {
    function comparator(prevStudent, nextStudent) {
        // количество решенных задач
        if (prevStudent[1] > nextStudent[1]) {
            return true
        } else if (prevStudent[1] == nextStudent[1]) {
            // количество ошибок
            if (prevStudent[2] < nextStudent[2]) {
                return true
            } else if (prevStudent[2] == nextStudent[2]) {
                // логины
                if (prevStudent[0] < nextStudent[0]) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }
 
    // восстанавление кучи (перестановка)
    function sort(studentsArr) {
        let n = studentsArr.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            // создаем кучу (перестановка)
            heapify(studentsArr, n, i);
        }
        // достаем элементы по одному из кучи
        for (let i = n - 1; i > 0; i--) {
            // сдвигаем корень в конец
            let temp = studentsArr[0];
            studentsArr[0] = studentsArr[i];
            studentsArr[i] = temp;
            // вызываем heapify на куче (в порядке убывания)
            heapify(studentsArr, i, 0);
        }
        return studentsArr
    }
 
    // главная функция для сортировки кучи
    function heapify(studentsArr, n, i) {
        let largest = i; // изначально largest - корень дерева. сортируем по убыванию.
        let l = 2 * i + 1; // индекс слева = 2*i + 1
        let r = 2 * i + 2; // индекс справа = 2*i + 2
        // largest - элемент массива, для которого выполняются условие компаратора
        if (l < n && comparator(studentsArr[largest], studentsArr[l])) {
            largest = l;
        }
        if (r < n && comparator(studentsArr[largest], studentsArr[r])) {
            largest = r;
        }
        // если largest - не корень дерева, то меняем largest местами с корнем.
        if (largest != i) {
            let swap = studentsArr[i];
            studentsArr[i] = studentsArr[largest];
            studentsArr[largest] = swap;
            // вызываем heapify рекурсивно на поддереве
            heapify(studentsArr, n, largest);
        }
    }
    let result = sort(studentsArr);
    // вернуть логины участников
    let res = [];
    for (let x = 0; x < result.length; x++) {
        res.push(studentsArr[x][0]);
    }
    return res.join('\r\n');
}
    

function solve() {
    const num = readInt();
    const students = readStudents(num);
    process.stdout.write(`${sortStudents(students)}`);
}

function readInt() {
    const n = Number(_inputLines[0]);
    return n;
}

function readLine() {
    const line = _inputLines[_curLine + 1].split(" ");
    line[1] = Number(line[1]);
    line[2] = Number(line[2])
    _curLine++;
    return line;
}

function readStudents(num) {
    let arr = [];
    for (let i = 0; i < num; i++) {
        arr.push(readLine())
    }
    return arr;
}