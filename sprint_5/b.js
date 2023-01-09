// ID успешной посылки: 68549935

/*
-- ПРИНЦИП РАБОТЫ --
В своем решении я опиралась на пример из теоретичской части курса в Практикуме.
Когда удаляется вершина, каждое связанное с ней ребро указывает на несуществующий объект.
Алгоритм удаления ноды из бинарного деорева поиска подразумевает под собой объединение распадающихся поддеревьев.
Свой алгоритм я оптимировала таким образом, что поиск потомка производится в правом поддереве вместо левого.
Если поступающий на вход ключ не совпадает со значением ноды, то поиск спускается ниже по дереву.
Если значение ключа меньше, чем значение ноды, то поиск перемещается в левое поддерево.

-- ДОКАЗАТЕЛЬСТВО КОРРЕКТНОСТИ --
У нод бинарного дерева поиска может быть до трех ребер и соответственно 0 (лист), 1, 2 или 3 потомка.
При наивном решении задачи (удаление ноджы по ключу) дерево распадается.
Для того чтобы дерево не распалось, на место удалённой вершины надо поставить новую: самую левую вершину в левом поддереве или самую правую в левом.
Если на место удаляемой ноды перемещается лист, то такой узел можно сдвинуть на пустое место не опасаясь развала.
Если на место удаляемой ноды нужно переместить узел с потомками(УП), то УП должна "усыновить" предшествующая УП нода (прародитель).
Так дерево всегда остается целым.

-- ВРЕМЕННАЯ СЛОЖНОСТЬ --
Временная сложность алгоритма зависит от высоты дерева: O(n).

-- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --
Пространственная сложность дерева прямо пропорциональна количеству узлов в нем - О(N).
Пространственная сложность алгоритма - количество рекурсивных вызовов (стек) функции для поиска ключа.
В худшем случае сложность алгоритма составит О(n).
В среднем затраты на поиск ключа составят:
- О(log₂ N) при условии, что дерево сбалансировано,
- O(lg N), если дерево - отсортировнный связный список, и
- О(N) в худшем случае
*/

// class Node { 
//     constructor(value) { 
//         value = value; 
//         left = null; 
//         right = null; 
//     } 
// } 
function remove(node, key) {
    // базовый случай
    if (node === null) {
        return node
    }
    // поиск ноды, которую нужно удалить
    if (key === node.value) {
        // нода - лист
        if (node.left === null && node.right === null) {
            return null
        // у ноды один потомок
        } else if (node.left === null) {
            return node.right
        } else if (node.right === null) {
            return node.left
        } else { // у ноды два потомка
            // ищем крайнюю ноду
            let temp = rightMostLeft(node.right)
            // удаляем вершину со старого места. для этого удаляем ссылку на нее из родителя.
            node.value = temp.value
            // делаем ссылку на нового потомка (найденный потомок левого поддерева)
            node.right = remove(node.right, temp.value)
            return node
        }
    // спускаемся для поиска ниже по дереву
    } else if (key < node.value) {
        node.left = remove(node.left, key)
        return node
    } else {  
        node.right = remove(node.right, key)
        return node
    }
    // функция поиска самого левого значения в правом поддереве
    function rightMostLeft(node) {
        while(!node.left === null) {
            node = node.left
        }
        return node
    }
}