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

// canvas.addEventListener("mousedown", function (event) {
//   console.log("test");
// });

canvas.addEventListener("mousedown", function (event) {
  const x = Math.floor(event.offsetX / pixel);
  const y = Math.floor(event.offsetY / pixel);
  drawSand(x, y);
});

function drawGrid() {
  ctx.beginPath();
  for (let i = 0; i <= ncol; i++) {
    ctx.moveTo(i * pixel, 0);
    ctx.lineTo(i * pixel, HEIGHT);
    ctx.stroke();
  }
  for (let i = 0; i <= nrow; i++) {
    ctx.moveTo(0, i * pixel);
    ctx.lineTo(HEIGHT, i * pixel);
    ctx.stroke();
  }
  ctx.closePath();
}

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
  ctx.fillStyle = "white";
  ctx.fillRect(x * pixel, y * pixel, pixel, pixel);
  grid[x][y] = 0;
}

function animate(grid) {
  requestAnimationFrame(animate);
  scan();
}

function scan() {
  for (let i = 0; i < ncol; i++) {
    for (let j = 0; j < nrow; j++) {
      if (grid[i][j] == 1) {
        if (canFall(i, j + 1)) {
          eraseSand(i, j);
          drawSand(i, j + 1);
        }
      }
    }
  }
}

animate(grid);
