//initialisation du canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//initialisation du bouton
const button = document.getElementById("particules");

//largeur et hauteur du canvas
const WIDTH = 600;
const HEIGHT = 900;

//taille du canvas
canvas.height = HEIGHT;
canvas.width = WIDTH;

//taille du grain de sable
const pixel = WIDTH / 300;

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

let floodSpeed = 6;

let eraserSize = 20;

let flood = true;

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
 * Mouse Listener du canvas pour détecter si la souris sort du canvas
 */
button.addEventListener("click", () => {
  changeSandFallingMethod();
  changeButtonBackground();
});

/**
 * Fonction qui change la couleur du bouton en fonction de la méthode de chute du sable
 */
function changeButtonBackground() {
  if (!flood) {
    button.style.backgroundColor = "#4CAF50";
  } else {
    button.style.backgroundColor = "#f44336";
  }
}

/**
 * Supprime les grains de sable à la avec un curseur d'une taille eraserSize x eraserSize ayant pour centre la souris
 *
 * @param {number} mouseX coordonnée x de la souris
 * @param {number} mouseY coordonnée y de la souris
 */
function mouseEraser(mouseX, mouseY) {
  for (let i = mouseX - 2; i <= mouseX + eraserSize - 2; i++) {
    for (let j = mouseY - 2; j <= mouseY + eraserSize - 2; j++) {
      eraseSand(i, j);
    }
  }
}

/**
 * Change la méthode de chute du sable
 */
function changeSandFallingMethod() {
  if (flood) {
    flood = false;
  } else {
    flood = true;
  }
}

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
  if (!isOutOfBound(x, y)) {
    ctx.fillStyle = "#000033";
    ctx.fillRect(x * pixel, y * pixel, pixel, pixel);
    grid[x][y] = 0;
  }
}

/**
 * Fonction qui dessine plusieurs grains de sable pour former un cercle
 *
 * @param {number} x coordonnée x du centre du cercle
 * @param {number} y coordonnée y du centre du cercle
 */
function drawSandBall(x, y) {
  for (let i = x - 2; i <= x + 2; i++) {
    for (let j = y - 2; j <= y + floodSpeed; j++) {
      drawSand(i, j);
    }
  }
}

/**
 * Fonction qui change de couleur à chaque appel de la fonction
 */
function nextColor() {
  if (g <= 150) {
    r = 255;
    g = 255;
  }
  color = `rgb(${(r -= 1)}, ${(g -= 4)}, 0)`;
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
 * Fonction qui traite le comportement d'un grain de sable à l'instant T
 *
 * @param {number} x coordonnée x
 * @param {number} y coordonnée y
 */
function gravity(x, y) {
  if (!flood) {
    if (Math.random() < 0.5) {
      if (x < ncol - 1 && canFall(x + 1, y + 1)) {
        drawSand(x + 1, y + 1);
        eraseSand(x, y);
      } else if (x > 0 && canFall(x - 1, y + 1)) {
        drawSand(x - 1, y + 1);
        eraseSand(x, y);
      }
    } else {
      if (x > 0 && canFall(x - 1, y + 1)) {
        drawSand(x - 1, y + 1);
        eraseSand(x, y);
      } else if (x < ncol - 1 && canFall(x + 1, y + 1)) {
        drawSand(x + 1, y + 1);
        eraseSand(x, y);
      }
    }
  } else {
    if (canFall(x, y + floodSpeed)) {
      drawSand(x, y + floodSpeed);
      eraseSand(x, y);
    } else {
      if (Math.random() < 0.5) {
        if (x < ncol - 1 && canFall(x + 1, y + 1)) {
          drawSand(x + 1, y + 1);
          eraseSand(x, y);
        } else if (x > 0 && canFall(x - 1, y + 1)) {
          drawSand(x - 1, y + 1);
          eraseSand(x, y);
        }
      } else {
        if (x > 0 && canFall(x - 1, y + 1)) {
          drawSand(x - 1, y + 1);
          eraseSand(x, y);
        } else if (x < ncol - 1 && canFall(x + 1, y + 1)) {
          drawSand(x + 1, y + 1);
          eraseSand(x, y);
        }
      }
    }
  }
}

/**
 * Fonction qui va scanner la grille de bas en haut pour mettre à jour la position des grains de sable
 */
function scan() {
  for (let i = ncol - 1; i >= 0; i--) {
    for (let j = nrow - 1; j >= 0; j--) {
      if (grid[i][j] == 1) {
        gravity(i, j);
        nextColor();
      }
    }
  }
}

/**
 * Fonction qui permet d'animer le canvas. Sert de boucle infinie
 */
function animate() {
  requestAnimationFrame(animate);
  scan();
  if (mouseDown) {
    drawSandBall(mouseX, mouseY);
  } else {
    mouseEraser(mouseX, mouseY);
  }
}

//lancement de l'animation
animate(grid);
