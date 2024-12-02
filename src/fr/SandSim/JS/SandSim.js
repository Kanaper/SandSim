const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 600;
const HEIGHT = 900;

//modifie la taille du canvas
canvas.height = HEIGHT;
canvas.width = WIDTH;

const pixel = WIDTH / 200;
const nrow = HEIGHT / pixel;
const ncol = WIDTH / pixel;

const grid = makeGrid();

let mouseDown = false;
let mouseX = 0;
let mouseY = 0;
let r = 255,
  g = 255;
let color;

canvas.addEventListener("mousedown", function (event) {
  nextColor();
  mouseDown = true;
});

canvas.addEventListener("mouseup", function (event) {
  mouseDown = false;
});

canvas.addEventListener("mousemove", function (event) {
  mouseX = Math.floor(event.offsetX / pixel);
  mouseY = Math.floor(event.offsetY / pixel);
});

function makeGrid() {
  const array = [];
  for (let i = 0; i < ncol; i++) {
    const row = [];
    for (let j = 0; j < nrow; j++) {
      row.push(0);
    }
    array.push(row);
  }
  return array;
}

function canFall(x, y) {
  return grid[x][y] == 0;
}

function drawSand(x, y) {
  if (!isOutOfBound(x, y)) {
    if (isEmpty(x, y)) {
      ctx.fillStyle = color;
      ctx.fillRect(x * pixel, y * pixel, pixel, pixel);
      grid[x][y] = 1;
    }
  }
}

function eraseSand(x, y) {
  ctx.fillStyle = "#000033";
  ctx.fillRect(x * pixel, y * pixel, pixel, pixel);
  grid[x][y] = 0;
}

function animate(grid) {
  requestAnimationFrame(animate);
  scan();
  if (mouseDown) {
    drawSandBall(mouseX, mouseY);
  }
}

function drawSandBall(x, y) {
  for (let i = x - 2; i <= x + 2; i++) {
    for (let j = y - 2; j <= y + 2; j++) {
      drawSand(i, j);
    }
  }
}

function nextColor() {
  if (g <= 170) {
    r = 255;
    g = 255;
  }
  color = `rgb(${(r -= 1)}, ${(g -= 12)}, 0)`;
}

function isEmpty(x, y) {
  return grid[x][y] == 0;
}

function isOutOfBound(x, y) {
  return x < 0 || x >= ncol || y < 0 || y >= nrow;
}

function scan() {
  for (let i = ncol - 1; i >= 0; i--) {
    for (let j = nrow - 1; j >= 0; j--) {
      if (grid[i][j] == 1) {
        if (canFall(i, j + 1)) {
          eraseSand(i, j);
          drawSand(i, j + 1);
        } else {
          if (Math.random() < 0.5) {
            if (i < ncol - 1 && canFall(i + 1, j + 1)) {
              eraseSand(i, j);
              drawSand(i + 1, j + 1);
            } else if (i > 0 && canFall(i - 1, j + 1)) {
              eraseSand(i, j);
              drawSand(i - 1, j + 1);
            }
          } else {
            if (i > 0 && canFall(i - 1, j + 1)) {
              eraseSand(i, j);
              drawSand(i - 1, j + 1);
            } else if (i < ncol - 1 && canFall(i + 1, j + 1)) {
              eraseSand(i, j);
              drawSand(i + 1, j + 1);
            }
          }
        }
      }
    }
  }
}

animate(grid);
