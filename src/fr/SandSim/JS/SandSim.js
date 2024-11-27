const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 600;
const HEIGHT = 900;
const pixel = WIDTH / 100;

canvas.height = HEIGHT;
canvas.width = WIDTH;

function drawGrid() {
  ctx.beginPath();
  for (let i = 0; i <= WIDTH / pixel; i++) {
    ctx.moveTo(i * pixel, 0);
    ctx.lineTo(i * pixel, HEIGHT);
    ctx.stroke();
  }
  for (let i = 0; i <= HEIGHT / pixel; i++) {
    ctx.moveTo(0, i * pixel);
    ctx.lineTo(HEIGHT, i * pixel);
    ctx.stroke();
  }
  ctx.closePath();
}

function makeGrid() {
  const array = [];
  for (let i = 0; i < WIDTH / pixel; i++) {
    const row = [];
    for (let j = 0; j < HEIGHT / pixel; j++) {
      row.push(0);
    }
    array.push(row);
  }
  return array;
}

function scan() {
  for (let i = 0; i < WIDTH / pixel; i++) {
    for (let j = 0; j < HEIGHT / pixel; j++) {
      if (grid[i][j] == 1) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(i * pixel, j * pixel, pixel, 8);
        if (canFall(grid[i][j + 1])) {
          grid[i][j + 1] = 1;
          grid[i][j] = 0;
        }
      } else {
        ctx.fillStyle = "white";
        ctx.fillRect(i * pixel, j * pixel, pixel, 8);
      }
    }
  }
}

function canFall(value) {
  if (value == 1) {
    return false;
  } else {
    return true;
  }
}

function animate() {
  requestAnimationFrame(animate);
  scan();
}

const grid = makeGrid();
grid[50][88] = 1;
animate();
