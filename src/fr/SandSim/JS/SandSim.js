const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let grid = [600][800];

function drawGrid() {
  ctx.beginPath();
  for (let i = 1; i <= 100; i++) {
    ctx.moveTo(i * 6, 0);
    ctx.lineTo(i * 6, 800);
    ctx.stroke();
  }
  for (let i = 1; i <= 100; i++) {
    ctx.moveTo(0, i * 8);
    ctx.lineTo(800, i * 8);
    ctx.stroke();
  }
  ctx.closePath();
}
