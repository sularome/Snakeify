function Snakeify(table) {
    var trs = table.querySelectorAll("tr")
    var matrix = Array.prototype.map.call(trs, function (tr) {
        return Array.prototype.map.call(tr.querySelectorAll("td"), function (td) {
            return td;
        })
    });
    var timeoutId = 0;
    var snakePosition = [0, 0];
    var foodPosition = [];
    var direction = [1,0];
    var snake = [[0,0]];

    setupListeners();
    placeFood();
    render();

    function render() {
        moveSnake();
        if(!isGameOver()){
            clearTable();
            renderSnake();
            timeoutId = setTimeout(render, 500 - snake.length * 20);
        } else {
            alert("Game Over!");
        }
    }

    function foodColision () {
        return isSamePoint(snakePosition, foodPosition);
    }

    function pointIsInSnake (point) {
        return snake.some(function (snakePoint) {
            return isSamePoint(snakePoint, point);
        });
    }

    function rerender() {
        clearTimeout(timeoutId);
        render();
    }

    function isSamePoint(p1, p2) {
        return (p1[0] === p2[0] && p1[1] === p2[1]);
    }

    function moveSnake() {
        snakePosition = [snakePosition[0] + direction[0], snakePosition[1] + direction[1]];
        snake.push([snakePosition[0], snakePosition[1]]);
        if(foodColision()){
            placeFood();
        } else {
            snake.shift();
        }
    }

    function placeFood() {
        foodPosition = snake[0];
        while(pointIsInSnake(foodPosition)) {
            var x = Math.floor(Math.random() * matrix[0].length);
            var y = Math.floor(Math.random() * matrix.length);
            foodPosition = [x, y];
        }

    }

    function isGameOver() {
        if(matrix[0].length <= snakePosition[0] || snakePosition[0] < 0) {
            return true;
        }
        if(matrix.length <= snakePosition[1] || snakePosition[1] < 0) {
            return true;
        }
        false;
    }

    function clearTable() {
        matrix.forEach(function (row) {
            row.forEach(function (cell) {
                cell.style.backgroundColor = "";
            });
        });
    }

    function renderSnake() {
        snake.forEach(function (cell) {
            matrix[cell[1]][cell[0]].style.backgroundColor = "yellow";
        });
        matrix[foodPosition[1]][foodPosition[0]].style.backgroundColor = "yellow";
    }

    function setupListeners() {
        document.addEventListener("keydown", onKeyDown);
    }

    function dispose() {
        document.removeEventListener("keydown", onKeyDown);
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
    }

    function onKeyDown(e) {
        var hasChanges = false;
        var previousValue = null;
        if(e.which === 37 || e.which === 39) {
            previousValue = direction[0];
            direction[0] = (e.which === 37) ? -1 : 1;
            direction[1] = 0;
            hasChanges = previousValue !== direction[0];
        }

        if(e.which === 40 || e.which === 38) {
            previousValue = direction[1];
            direction[1] = (e.which === 38) ? -1 : 1;
            direction[0] = 0;
            hasChanges = previousValue !== direction[1];
        }

        if(hasChanges) {
            rerender();
        }
    }

    return dispose;
}
