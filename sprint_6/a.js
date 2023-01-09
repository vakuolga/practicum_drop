// ID успешной посылки: 69379731

/*
-- ПРИНЦИП РАБОТЫ --
В своем решении я опиралась на алгоритм Прима с использованием кучи.
Сначала все ребра добавляются в граф по ключу вершины в readEdgesArray.
При этом происходит проверка на кратность ребер: если добавляется кратное ребро с весомтяжелее предыдущего, это ребро обновляется.

Функция runMST работает следующим образом: находится самое тяжелое ребро в графе.
Вершины этого ребра добавляются в visited - теперь они считаются посещенными.
Смежные с этими вершинами ребра добавляются в очередь.
Далее запускается цикл обзода графа/ создания максимального оствного дерева: каждый раз "забирается" самое "тяжелое" ребро,
вершина .from которого уже посещена. Вершина .add помечается посещенной, от нее мы снова добавялем в кучу смежные ребра.
Кицл идет, пока количество посещенных вершин не становится равно количеству вершин в графе.
В цикле существует проверка на связность: если в очереди остается меньше двух ребер и граф состоит хотя бы из 4х вершин,
то в графе существует несколько компонент связности - выводится ошибка.

-- ДОКАЗАТЕЛЬСТВО КОРРЕКТНОСТИ --
Из-за того, что куча - полное бинарное дерево, оно может быть представлено в виде массива. Однако этот массив не всегда отсортирован.
Из теории Практикума: "Выполнение свойства, при котором значение в родителе более приоритетно, чем значения в дочерних узлах, не гарантирует отсортированность."
При условии, что родительская нода находится в индексе i (начиная с 0), левый потомок находится в индексе 2 * i + 1, правый - в 2 * i + 2.

Алгоритм Прима работает гораздо быстрее засчет использования кучи: вместо того, чтобы каждый раз сортировать массив ребер в поисках
самого "тяжелого" ребра, ребра к этому моменту уже остортированы по признаку веса. При этом сохраняется принцип обхода
графа и создание максимального остовного дерева: проверка на связность и подсчет суммарного веса максимального остовного дерева.

-- ВРЕМЕННАЯ СЛОЖНОСТЬ --
O(E*logV), где E - количество рёбер в графе, а V - количество вершин.

-- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --
Хранение кучи - O(n).
Список смежности - O(E*V), где E - количество вершин, V - количество рёбер.

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

class MaxHeap {
    constructor() {
        this.values = [];
        this.visited = new Set;
    }
    // индекс родительской ноды
    parent(index) {
        return Math.floor((index - 1) / 2);
    }
    // индекс левого ребенка
    leftChild(index) {
        return (index * 2) + 1;
    }
    // индексп правого ребенка
    rightChild(index) {
        return (index * 2) + 2;
    }
    // возвращает true если нода - лист (не имеет детей)
    isLeaf(index) {
        return (
            index >= Math.floor(this.values.length / 2) && index <= this.values.length - 1
        )
    }
    // функция для обмена вершин местами
    swap(index1, index2) {
        [this.values[index1], this.values[index2]] = [this.values[index2], this.values[index1]];
    }
    // функция для передачи вершины вниз по дереву
    heapifyDown(index) {
        // если у вершины есть дети
        if (!this.isLeaf(index)) {
            // находим индексы детей
            let leftChildIndex = this.leftChild(index),
                rightChildIndex = this.rightChild(index),
                // присваиваем largestIndex = индекс родитльской вершины
                largestIndex = index;
            // если left child > parent
            if (this.values[leftChildIndex] && this.values[largestIndex] &&
                (this.values[leftChildIndex].weight > this.values[largestIndex].weight)) {
                // перезаписываем largestIndex
                largestIndex = leftChildIndex;
            }
            // аналогично справа
            if (this.values[rightChildIndex] && this.values[largestIndex] &&
                (this.values[rightChildIndex].weight >= this.values[largestIndex].weight)) {
                largestIndex = rightChildIndex;
            }
            // если largestIndex был перезаписан
            if (largestIndex !== index) {
                // swap
                this.swap(index, largestIndex);
                // вызываем рекурсивон до упора
                this.heapifyDown(largestIndex);
            }
        }
    }
    // при добавлении вершин в кучу номера вершин - это индексы в массиве
    // add + heapifyUp - функции для добавления вершины в дерево. добавляем в конец и бурим наверх
    heapifyUp(index) {
        let currentIndex = index,
            parentIndex = this.parent(currentIndex);
        // пока мы не достали до корня и пока родительская вершина меньше добавленной
        while (currentIndex > 0 && this.values[currentIndex].weight > this.values[parentIndex].weight) {
            // swap
            this.swap(currentIndex, parentIndex);
            // двигаемся вверх по дереву
            currentIndex = parentIndex;
            parentIndex = this.parent(parentIndex);
        }
    }
    add(element) {
        // добавляем элемент в конец кучи
        this.values.push(element);
        // двигаем вверх пока вершина не на своей позиции в куче
        this.heapifyUp(this.values.length - 1);
    }
    // удаляет и возвращает значение максимального элемента
    extractMax() {
        if (this.values.length < 1) return;
        let max = this.values[0];
        // получить максимальный + последний элемент
        max = this.values[0];
        const end = this.values.pop();
        // добавляем последний элемент в корень
        this.values[0] = end;
        // бурим корень вниз, пока он не встанет на свою позиции
        this.heapifyDown(0);
        // возвращаем максимум
        return max;
    }
}

function addConnections(arr, heap) {
    for (let i = 0; i < arr.length; i++) {
        if (heap.visited.has(arr[i].to)) {
            heap.add(arr[i])
        }
    }
}

function runMST(edgesArr, edgesCount, verticesCount) {
    let maxWeight = 0;
    if (edgesCount > 0) {
        if (verticesCount == 1) {
            return 0
        }
    } else {
        if (verticesCount == 1) {
            return 0
        } else {
            return 'Oops! I did it again'
        }
    }
    // сначала находим самое тяжелое ребро
    const toCompare = [];
    let heap = new MaxHeap();
    edgesArr.map(el => {
        if (el.length > 0) {
            toCompare.push(el.reduce((prev, current) => (prev.weight > current.weight) ? prev : current));
        }
    });
    const maxEdge = toCompare.reduce((prev, current) => (prev.weight > current.weight) ? prev : current);
    maxWeight += Number(maxEdge.weight); // добавляем вес ребра к результирующему
    // помечяаем обе вершины как посещенный старт
    heap.visited.add(maxEdge.from);
    heap.visited.add(maxEdge.to);
    // добавляем смежные ребра в очередь
    addConnections(edgesArr[maxEdge.from], heap);
    addConnections(edgesArr[maxEdge.to], heap);
    // пока в очереди есть элементы
    while (heap.visited.size < verticesCount) {
        // проверка на связность для графа из > 3 вершин
        // т.к. в таком графе и меньше в очереди может оказаться < 2 ребер
        if (heap.values.length < 2 && verticesCount > 3) return 'Oops! I did it again';
        let max = heap.extractMax(); // достаем максимальное значение
        if (!heap.visited.has(max.to) || !heap.visited.has(max.from)) {
            maxWeight += Number(max.weight); // добавляем вес ребра к общему весу
        }
        let notVisited;
        // проверяем, какую вершину от ребра нужно добавить в остов (какая не посещена)
        notVisited = max.to;
        heap.visited.add(notVisited);
        addConnections(edgesArr[notVisited], heap);
    }
    // возвращаем результирующий вес графа
    return maxWeight;
}

function solve() {
    const edgesCount = Number(_inputLines[0].split(' ')[1]);
    const verticesCount = Number(_inputLines[0].split(' ')[0]);
    let temp = Array(verticesCount + 1);
    for (let o = 0; o < temp.length; o++) {
        temp[o] = [];
    }
    const edgesArr = readEdgesArray(temp);
    process.stdout.write(`${runMST(edgesArr, edgesCount, verticesCount)}`);
}

function readEdgesArray(graph) {
    if (_inputLines.length > 1) {
        for (let i = 1; i < _inputLines.length; i++) {
            let line = _inputLines[i].split(' '),
                edgeToAdd;
            if (line[0] != line[1]) {
                edgeToAdd = {
                    from: line[0],
                    to: line[1],
                    weight: Number(line[2])
                };
                let key = line[0];
                let dest = line[1];
                let double = graph[key].find(edge => (edge.to == dest));
                if (double) { // кратное ребро 
                    if (edgeToAdd.weight > double.weight) {
                        let idx = graph[key].indexOf(double);
                        graph[key].splice(idx, 1);
                        graph[key].push(edgeToAdd);
                    }
                } else {
                    graph[key].push(edgeToAdd);
                }

                edgeToAdd = {
                    from: line[1],
                    to: line[0],
                    weight: Number(line[2])
                };
                key = line[1];
                dest = line[0];
                double = graph[key].find(edge => (edge.to == dest));
                if (double) { // кратное ребро
                    if (edgeToAdd.weight > double.weight) {
                        let idx = graph[key].indexOf(double);
                        graph[key].splice(idx, 1);
                        graph[key].push(edgeToAdd);
                    }
                } else {
                    graph[key].push(edgeToAdd);
                }
            }
        }
    }
    return graph;
}