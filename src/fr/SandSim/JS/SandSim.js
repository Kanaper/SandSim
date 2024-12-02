//initialisation du canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//largeur et hauteur du canvas
const WIDTH = 600;
const HEIGHT = 900;

//taille du canvas
canvas.height = HEIGHT;
canvas.width = WIDTH;

//taille du grain de sable
const pixel = WIDTH / 200;

//nombre de colonnes et de lignes
const nrow = HEIGHT / pixel;
const ncol = WIDTH / pixel;

//initialisation de la variable de la grille théorique
const grid = makeGrid();

//bouton de la souris pressé
let mouseDown = false;

//initialisation des coordonnées x et y du curseur de la souris
let mouseX = 0;
let mouseY = 0;

//initialisation des variables pour la couleur du sable
let r = 255,
  g = 255;
let color;

/**
 * Mouse Listener du canvas pour détecter si le bouton de la souris est pressée
 */
canvas.addEventListener("mousedown", function (event) {
  nextColor();
  mouseDown = true;
});

/**
 * Mouse Listener du canvas pour détecter si le bouton de la souris est relachée
 */
canvas.addEventListener("mouseup", function (event) {
  mouseDown = false;
});

/**
 * Mouse Listener du canvas pour détecter si la souris bouge
 */
canvas.addEventListener("mousemove", function (event) {
  mouseX = Math.floor(event.offsetX / pixel);
  mouseY = Math.floor(event.offsetY / pixel);
});

/**
 * Fonction pour créer la grille théorique
 *
 * @returns une grille de ncol x nrow
 */
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

/**
 * Fonction qui vérifie si un grain de sable peut tomber
 *
 * @param {number} x coordonnée x du grain de sable
 * @param {number} y coordonnée y du grain de sable
 * @returns true si le grain de sable peut tomber, false sinon
 */
function canFall(x, y) {
  return grid[x][y] == 0;
}

/**
 * Fonction qui dessine un grain de sable à une position donnée
 *
 * @param {number} x coordonnée x du grain de sable
 * @param {number} y coordonnée y du grain de sable
 */
function drawSand(x, y) {
  if (!isOutOfBound(x, y)) {
    if (canFall(x, y)) {
      ctx.fillStyle = color;
      ctx.fillRect(x * pixel, y * pixel, pixel, pixel);
      grid[x][y] = 1;
    }
  }
}

/**
 * Fonction qui dessine le fond à une position donnée
 *
 * @param {number} x coordonnée x du fond
 * @param {number} y coordonnée y du fond
 */
function eraseSand(x, y) {
  ctx.fillStyle = "#000033";
  ctx.fillRect(x * pixel, y * pixel, pixel, pixel);
  grid[x][y] = 0;
}

/**
 * Fonction qui permet d'animer le canvas. Sert de boucle infinie
 */
function animate() {
  requestAnimationFrame(animate);
  scan();
  if (mouseDown) {
    drawSandBall(mouseX, mouseY);
  }
}

/**
 * Fonction qui dessine plusieurs grains de sable pour former un cercle
 *
 * @param {number} x coordonnée x du centre du cercle
 * @param {number} y coordonnée y du centre du cercle
 */
function drawSandBall(x, y) {
  for (let i = -3; i <= 3; i += 6) {
    for (let j = -1; j < 2; j++) {
      drawSand(x + j, y + i);
    }
  }
  for (let i = x - 2; i <= x + 2; i++) {
    for (let j = y - 2; j <= y + 2; j++) {
      drawSand(i, j);
    }
  }
  for (let i = y - 2; i <= y + 2; i++) {
    for (let j = x - 3; j <= x + 3; j += 6) {
      drawSand(j, i);
    }
  }
}

/**
 * Fonction qui change de couleur à chaque appel de la fonction
 */
function nextColor() {
  if (g <= 170) {
    r = 255;
    g = 255;
  }
  color = `rgb(${(r -= 1)}, ${(g -= 12)}, 0)`;
}

/**
 * Fonction qui vérifie si la souris est en dehors du canvas
 *
 * @param {number} x coordonnée x de la souris
 * @param {number} y coordonnée y de la souris
 * @returns true si la souris est en dehors du canvas, false sinon
 */
function isOutOfBound(x, y) {
  return x < 0 || x >= ncol || y < 0 || y >= nrow;
}

/**
 * Fonction qui va scanner la grille de bas en haut pour mettre à jour la position des grains de sable
 */
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

//lancement de l'animation
animate(grid);
