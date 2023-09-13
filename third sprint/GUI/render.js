import Color from '../logic/Color.js';
import World from '../logic/World.js';
import Position from '../logic/Position.js';

/* global chai */
const { expect, assert } = chai;

function getCellProperties(col, row, world) {
  const cell = world.cellAt(new Position(col, row));
  const free = !cell.isObstructed();
  const bug = cell.bug ? cell.bug.color : null;
  const { base } = cell;
  const bugDirection = cell.bug ? cell.bug.direction : null;
  const bugFood = cell.bug ? cell.bug.hasFood : null;
  const cellFood = cell.food;
  return {
    free,
    bug,
    bugDirection,
    bugFood,
    base,
    cellFood,
  };
}

export default function renderMap() {
  const world = World.deserialize(sessionStorage.getItem('world'));

  // Set up the canvas element
  const canvas = document.getElementById('map');
  const context = canvas.getContext('2d');

  // Select the size of canvas and the of its rendering
  const screenWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
  const screenHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
  const displayWidth = 0.8 * screenWidth;
  const displayHeight = 0.8 * screenHeight;
  const scale = 1;
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;
  canvas.width = displayWidth * scale;
  canvas.height = displayHeight * scale;

  // Some constants defining the map geometry
  const R = 40;
  const numCols = world.nCols;
  const numRows = world.nRows;
  const stepX = Math.sqrt(3) * R; // sqrt(3) = 2 sin(PI / 3)
  const stepY = 1.5 * R; // 1.5 = sin(PI / 2) + sin(PI / 6)

  function centerCoordinates(col, row) {
    return [(col + (row % 2) / 2 + 1) * stepX, (row + 1) * stepY];
  }

  // Color scheme
  const freeColor = '#A5D936';
  const foodColor = '#F2E205';
  const redBaseColor = '#F28585';
  const redBugColor = '#D11C00';
  const blackBaseColor = '#91E0F2';
  const blackBugColor = '#000000';
  const blockedColor = '#6D7E8C';

  function drawHex(coords, size, fillColor) {
    context.strokeStyle = '#000';
    context.lineWidth = 1;
    const [x, y] = coords;
    context.beginPath();
    for (let j = 0; j < 6; j++) {
      const angleRad = Math.PI * (1 / 2 + j / 3);
      const pointX = x + size * Math.cos(angleRad);
      const pointY = y + size * Math.sin(angleRad);
      if (j === 0) {
        context.moveTo(pointX, pointY);
      } else {
        context.lineTo(pointX, pointY);
      }
    }
    context.closePath();
    context.stroke();
    context.fillStyle = fillColor;
    context.fill();
  }

  function drawBug(coords, hasFood, direction, fillColor) {
    const bodySize = 0.3 * R;
    const headSize = 0.15 * R;
    const foodSize = 0.1 * R;
    drawHex(coords, bodySize, fillColor);
    const angle = direction * (Math.PI / 3);
    const headCoords = [
      coords[0] + bodySize * Math.cos(angle),
      coords[1] + bodySize * Math.sin(angle),
    ];
    drawHex(headCoords, headSize, fillColor);
    if (hasFood) {
      drawHex(coords, foodSize, foodColor);
    }
  }

  function drawFoodPieces(coords, count) {
    const foodSize = 0.4 * R;
    for (let i = 0; i < count; i++) {
      // Using these instead of Math.random to make it the same on each call
      const angle = (Math.cos(i) * 100) % (2 * Math.PI);
      const foodCoords = [
        coords[0] + 0.1 * R * Math.cos(angle),
        coords[1] + 0.1 * R * Math.sin(angle),
      ];
      drawHex(foodCoords, foodSize, foodColor);
    }
  }

  const hexCoords = [];
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      const cell = getCellProperties(i, j, world);
      let cellColor = blockedColor;
      if (cell.free) {
        cellColor = freeColor;
        if (cell.base != null) {
          cellColor = cell.base === Color.Red ? redBaseColor : blackBaseColor;
        }
      }
      const coords = centerCoordinates(i, j);
      drawHex(coords, R, cellColor);
      drawFoodPieces(coords, cell.cellFood);
      if (cell.bug != null) {
        const bugColor = cell.bug === Color.Red ? redBugColor : blackBugColor;
        drawBug(coords, cell.bugFood, cell.bugDirection, bugColor);
      }
    }
  }
}
