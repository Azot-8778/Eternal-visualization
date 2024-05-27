     // Получаем ссылку на холст
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");



    // Задаем связи между вершинами графа


    // Начальная вершина игрока
    var currentPlayer = "A";

    // Начальная вершина игрока
    var allVertexCount = 11;

    // Количество зеленых вершин
    var greenVertexCount = 0;

    // Количество красных вершин
    var redVertexCount = 0;

    // Максимальное количество зеленых вершин
    var maxGreenVertexCount = 4;

    // Обработчик нажатия клавиш
    document.addEventListener("keydown", keyDownHandler, false);

    // Обработчик кликов мыши
    canvas.addEventListener("click", mouseClickHandler, false);

    // Счетчик нажатий клавиши Enter
    var enterKeyPressCount = 0;

    var currentStage = 'placement'; // 'placement', 'attack', или 'selectDefender'
    var currentDefender = 1; // Текущий номер защитника
    var currentAttackedVertex = null; // Текущая атакованная вершина
var graph = {
        A: { x: 250, y: 40, color: "#000000", marked: false },
        B: { x: 200, y:75, color: "#000000", marked: false },
        C: { x: 50, y: 100, color: "#000000", marked: false },
        D: { x: 350, y: 100, color: "#000000", marked: false },
        E: { x: 400, y: 110, color: "#000000", marked: false },
        F: { x: 275, y: 170, color: "#000000", marked: false },
        G: { x: 100, y: 200, color: "#000000", marked: false },
        H: { x: 330, y: 200, color: "#000000", marked: false },
        I: { x: 450, y: 300, color: "#000000", marked: false },
        J: { x: 150, y: 350, color: "#000000", marked: false },
        K: { x: 400, y: 350, color: "#000000", marked: false },

};

// Задаем связи между вершинами графа короны

graph.A.up = "B";
graph.A.right = "D";
graph.A.down = "F";
graph.A.left = "С";

graph.B.up = "A";
graph.B.right = "D";
graph.B.left = "G";
graph.B.down = "F";

graph.C.up = "A";
graph.C.right = "D";
graph.C.left = "G";
graph.C.down = "J";

graph.D.right = "E";
graph.D.down = "K";
graph.D.left = "G";
graph.D.up = "A";

graph.E.up = "D";
graph.E.down = "I";
graph.E.right = "F";
graph.E.left = "K";

graph.F.left = "C";
graph.F.down = "J";
graph.F.up = "B";
graph.F.right = "I";

graph.G.up = "E";
graph.G.down = "J";
graph.G.right = "H";
graph.G.left = "C";

graph.H.up = "A";
graph.H.right = "D";
graph.H.left = "G";
graph.H.down = "K";

graph.J.up = "F";
graph.J.right = "H";
graph.J.left = "I";
graph.J.down = "K";

graph.K.up = "F";
graph.K.right = "E";
graph.K.left = "J";
graph.K.down = "I";

graph.I.up = "F";
graph.I.right = "D";
graph.I.left = "J";
graph.I.down = "K";


    // Функция для обработки нажатия клавиш
    function keyDownHandler(event) {
        var nextPlayer = null;

        if (event.keyCode === 39) {
            // Клавиша вправо
            nextPlayer = graph[currentPlayer].right;
        } else if (event.keyCode === 37) {
            // Клавиша влево
            nextPlayer = graph[currentPlayer].left;
        } else if (event.keyCode === 38) {
            // Клавиша вверх
            nextPlayer = graph[currentPlayer].up;
        } else if (event.keyCode === 40) {
            // Клавиша вниз
            nextPlayer = graph[currentPlayer].down;
        } else if (event.keyCode === 32) {
            // Клавиша пробел
            changeColor();
        } else if (event.keyCode === 13) {
            // Клавиша Enter
            enterKeyPressCount++;
            markRandomVertex();
          if (enterKeyPressCount > 1 && redVertexCount > 1) {
            showMessage("Вы проиграли");
          }
            else if (enterKeyPressCount > allVertexCount && redVertexCount < 2) {
                    showMessage("Вы выиграли");
                  }
            else  {
                var vision = enterKeyPressCount - 1;
                showMessage("Вы отразили " + vision + " из " + allVertexCount + " атак");
            }
        }

        if (nextPlayer) {
            // Перемещаем игрока на следующую вершину
            currentPlayer = nextPlayer;
        }
    }

    // Функция для обработки кликов мыши
    function mouseClickHandler(event) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        for (var vertex in graph) {
            var distance = Math.sqrt(Math.pow(mouseX - graph[vertex].x, 2) + Math.pow(mouseY - graph[vertex].y, 2));
            if (distance <= 10) {
                currentPlayer = vertex;
                changeColor();
                break;
            }
        }
    }

    function changeColor() {
         if (!graph[currentPlayer].marked && greenVertexCount < maxGreenVertexCount) {
             graph[currentPlayer].color = "#00FF00";
             graph[currentPlayer].marked = true;
             greenVertexCount++;
         } else if (graph[currentPlayer].marked && graph[currentPlayer].color === "#00FF00") {
             graph[currentPlayer].color = "#000000";
             graph[currentPlayer].marked = false;
             greenVertexCount--;
         } else if (graph[currentPlayer].marked && graph[currentPlayer].color === "#FF0000") {
             var neighborVertex = findNeighborVertex();
             if (neighborVertex) {
                 graph[neighborVertex].color = "#00FF00"; 
                 graph[neighborVertex].marked = true;
                 graph[currentPlayer].color = "#000000"; // Черный
                 graph[currentPlayer].marked = false;
                 redVertexCount--; // Уменьшаем счетчик красных вершин
             }
         }
         updateCounter();
     }

function markRandomVertex() {
    if (greenVertexCount === maxGreenVertexCount) {
        var unmarkedVertices = [];
        for (var vertex in graph) {
            if (!graph[vertex].marked) {
                unmarkedVertices.push(vertex);
            }
        }
        if (unmarkedVertices.length > 0) {
            var randomIndex = Math.floor(Math.random() * unmarkedVertices.length);
            var randomVertex = unmarkedVertices[randomIndex];
            graph[randomVertex].color = "#FF0000"; // Красный цвет
            graph[randomVertex].marked = true;
            redVertexCount++;
            currentAttackedVertex = randomVertex;
            currentStage = 'attack'; // Переходим к этапу атаки
            updateHints(); // Обновляем подсказки
        }
    }
}

function selectDefender() {
    if (currentStage === 'attack') {
        currentStage = 'selectDefender'; // Переходим к выбору защитника
        updateHints(); // Обновляем подсказки
    }
}   

function placeDefender() {
    if (currentStage === 'placement') {
        if (!graph[currentPlayer].marked && greenVertexCount < maxGreenVertexCount) {
            graph[currentPlayer].color = "#00FF00"; // Зеленый
            graph[currentPlayer].marked = true;
            greenVertexCount++;
            currentDefender++;
            updateHints(); // Обновляем подсказки
            updateCounter(); // Обновляем счетчики
        }
    }
}

    // Функция для замены красной вершины на зеленую
    function replaceRedWithGreen(vertex) {
        if (greenVertexCount < maxGreenVertexCount) {
            graph[vertex].color = "#00FF00"; // Зеленый цвет
            graph[vertex].marked = true;
            greenVertexCount++;
            updateCounter();
        }
    }


    // Функция для поиска соседней вершины с зеленым цветом
    function findNeighborVertex() {
        var neighbors = graph[currentPlayer];
        for (var direction in neighbors) {
            var neighborVertex = neighbors[direction];
            if (graph[neighborVertex] && graph[neighborVertex].marked && graph[neighborVertex].color === "#00FF00") {
                return neighborVertex;
            }
        }
        return null;
    }

    function updateHints() {
        var messageElement = document.getElementById("message");
        if (currentStage === 'attack') {
            messageElement.textContent = "Произошла атака на вершину " + currentAttackedVertex + ", нажмите на нее, если рядом есть защитник, а затем переместите туда защитника";
        }
    }


    function drawGame() {
        // Очищаем холст
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем ребра графа
        for (var vertex in graph) {
            var connections = graph[vertex];
            for (var direction in connections) {
                var connectedVertex = connections[direction];
                if (graph[connectedVertex]) {
                    context.beginPath();
                    context.moveTo(graph[vertex].x, graph[vertex].y);
                    context.lineTo(graph[connectedVertex].x, graph[connectedVertex].y);
                    context.strokeStyle = "#000000";
                    context.stroke();
                    context.closePath();
                }
            }
        }

        // Рисуем вершины графа
        for (var vertex in graph) {
            context.beginPath();
            context.arc(graph[vertex].x, graph[vertex].y, 10, 0, Math.PI * 2);
            context.fillStyle = graph[vertex].color;
            context.fill();
            context.closePath();

            // Подписи вершин
            context.font = "12px Arial";
            context.fillStyle = "#000000";
            context.textAlign = "center";
            context.fillText(vertex, graph[vertex].x, graph[vertex].y - 15);
        }

        // Рисуем синий круг для текущей вершины
        context.beginPath();
        context.arc(graph[currentPlayer].x, graph[currentPlayer].y, 7, 0, Math.PI * 2); // Смещаем круг на 5 пикселей вправо и вниз, уменьшаем радиус до 7
        context.fillStyle = "#0000FF";
        context.fill();
        context.closePath();
    }
        

      // Функция для анимации ребер графа
      function animateEdges() {
          for (var vertex in graph) {
              var connections = graph[vertex];
              for (var direction in connections) {
                  var connectedVertex = connections[direction];
                  if (graph[connectedVertex]) {
                      var startX = graph[vertex].x;
                      var startY = graph[vertex].y;
                      var endX = graph[connectedVertex].x;
                      var endY = graph[connectedVertex].y;

                      var progress = Math.min(1, (Date.now() - startTime) / animationDuration);
                      var currentX = startX + (endX - startX) * progress;
                      var currentY = startY + (endY - startY) * progress;

                      context.beginPath();
                      context.moveTo(startX, startY);
                      context.lineTo(currentX, currentY);
                      context.strokeStyle = "#000000";
                      context.stroke();
                      context.closePath();
                  }
              }
          }
      }

        // Рисуем ребра графа
        for (var vertex in graph) {
            var connections = graph[vertex];
            for (var direction in connections) {
                var connectedVertex = connections[direction];
                if (graph[connectedVertex]) {
                    context.beginPath();
                    context.moveTo(graph[vertex].x, graph[vertex].y);
                    context.lineTo(graph[connectedVertex].x, graph[connectedVertex].y);
                    context.strokeStyle = "#000000";
                    context.stroke();
                    context.closePath();
                }
            }
        }

        // Рисуем вершины графа
        for (var vertex in graph) {
            context.beginPath();
            context.arc(graph[vertex].x, graph[vertex].y, 10, 0, Math.PI * 2);
            context.fillStyle = (vertex === currentPlayer) ? "#0000FF" : graph[vertex].color;
            context.fill();
            context.closePath();

            // Подписи вершин
            context.font = "12px Arial";
            context.fillStyle = "#000000";
            context.textAlign = "center";
            context.fillText(vertex, graph[vertex].x, graph[vertex].y - 15);
        }


    // Обновление счетчика зеленых и красных вершин
function updateCounter() {
    var counterElement = document.getElementById("counter");
    counterElement.textContent = "Разместите: " + (maxGreenVertexCount - greenVertexCount) + " защитников";

    var redCounterElement = document.getElementById("redCounter");
    redCounterElement.textContent = "Атакованных вершин: " + redVertexCount;

}

    // Подсчет количества красных вершин
    function countRedVertices() {
        var count = 0;
        for (var vertex in graph) {
            if (graph[vertex].marked && graph[vertex].color === "#FF0000") {
                count++;
            }
        }
        return count;
    }

    // Функция для отображения сообщения
    function showMessage(message) {
        var messageElement = document.getElementById("message");
        messageElement.textContent = message;
    }

  // Главный игровой цикл
  function gameLoop() {
      // Отрисовываем игру
      drawGame();

      // Запускаем следующий цикл анимации
      requestAnimationFrame(gameLoop);
  }


  // Запускаем игровой цикл
  var animationDuration = 1000; // Длительность анимации ребер (в миллисекундах)
  var startTime = Date.now(); // Время начала анимации
  gameLoop();
    updateHints(); // Инициализируем подсказки при старте игры
    // Запускаем игровой цикл
    gameLoop();
