const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 600;
const HEIGHT = 900;

canvas.height = HEIGHT;
canvas.width = WIDTH;

const pixel = WIDTH / 200;
const nrow = HEIGHT / pixel;
const ncol = WIDTH / pixel;

const grid = makeGrid();

let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousedown", function (event) {
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
  ctx.fillStyle = "yellow";
  ctx.fillRect(x * pixel, y * pixel, pixel, pixel);
  grid[x][y] = 1;
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
    drawSand(mouseX, mouseY);
  }
}

function scan() {
  for (let i = 0; i < ncol; i++) {
    for (let j = 0; j < nrow; j++) {
      if (grid[i][j] == 1) {
        if (canFall(i, j + 1)) {
          eraseSand(i, j);
          drawSand(i, j + 1);
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

animate(grid);
