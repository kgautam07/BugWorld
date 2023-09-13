/**
 * Returns an array of all neighbors of a cel
 * as string representations of their coordinates.
 * @param {int} col - x coordinate
 * @param {int} row - y coordinate
 * @returns {set} - coordinates of the neighbors
 */
export function neighbors(col, row) {
  // Since shape is hexagonal the neighbors are different for even and odd rows
  // shift is used to determine if the row is even or odd and change the neighbors accordingly
  const shift = row % 2 === 0 ? 1 : -1;
  const n = [];
  n.push(`${col + 1},${row}`);
  n.push(`${col - 1},${row}`);
  n.push(`${col},${row + 1}`);
  n.push(`${col},${row - 1}`);
  n.push(`${col + shift},${row + 1}`);
  n.push(`${col + shift},${row - 1}`);
  return n;
}

/**
 * Add all cells that are part of the nest to the set nest recursively
 * @param {array} lines - array of strings representing the world
 * @param {set} nest - set of cells that are part of the nest
 * @param {int} col - x coordinate
 * @param {int} row - y coordinate
 * @param {string} pm - '+' or '-' depending on the nest
 */
export function findNest(lines, nest, col, row, pm) {
  const neib = neighbors(col, row);
  for (let i = 0; i < neib.length; i++) {
    const n = neib[i];
    if (!nest.has(n)) {
      const [nx, ny] = n.split(',');
      if (lines[ny].charAt(nx) === pm) {
        nest.add(n);
        findNest(lines, nest, parseInt(nx, 10), parseInt(ny, 10), pm);
      }
    }
  }
}

/**
 * Check if the world file contains only legal characters
 * and if the nests are connected
 * @param {array} lines - array of strings representing the world
 * @param {int} nCols - number of columns in the map
 * @param {int} nRows - number of rows in the map
 * @returns {boolean} - world file contains only legal characters the nests are connected
 */
export function checkChars(lines, nCols, nRows) {
  let a = '';
  let foundP = false;
  let foundM = false;
  const nestP = new Set();
  const nestM = new Set();

  for (let row = 2; row < nRows + 2; row++) {
    // check if the number of characters in each line is equal to x
    if (lines[row].length !== nCols) {
      return { success: false, message: `The number of characters in line ${row + 2} is incorrect` };
    }

    // for all characters check if they are legal
    for (let col = 0; col < nCols; col++) {
      a = lines[row].charAt(col);

      if (col === 0 || col === nCols - 1 || row === 2 || row === nRows + 1) {
        // check if the border is closed
        if (a !== '#') {
          return { success: false, message: 'The border in the world file is not closed' };
        }
      } else if (a !== '#' && a !== '.' && a !== '-' && a !== '+' && Number.isNaN(parseInt(a, 10))) {
        // check if the character is legal
        return { success: false, message: 'The world file contains invalid characters' };
      }
      if (a === '+') {
        // check if the nests are connected.
        if (foundP && !nestP.has(`${col},${row}`)) {
          return { success: false, message: 'The nests are not connected' };
        } if (!foundP) {
          foundP = true;
          nestP.add(`${col},${row}`);
          foundP = true;
          // find all adjacent cells that are part of the nest
          findNest(lines, nestP, col, row, '+');
        }
      } else if (a === '-') {
        if (foundM && !nestM.has(`${col},${row}`)) {
          return { success: false, message: 'The nests are not connected' };
        } if (!foundM) {
          foundM = true;
          nestM.add(`${col},${row}`);
          foundM = true;
          // find all adjacent cells that are part of the nest
          findNest(lines, nestM, col, row, '-');
        }
      }
    }
  }
  if (!foundP || !foundM) {
    return { success: false, message: 'The world file does not contain both nests' };
  }
  return { success: true, message: 'Ok' };
}

/**
 * Check if the string represents a valid world map
 * @param {string} world - string representing the world
 * @returns {boolean} - true if the world file is correct
 */
export function checkWorld(world) {
  const lines = world.split(/\r\n|\n/);
  const nCols = parseInt(lines[0], 10);
  const nRows = parseInt(lines[1], 10);
  if (Number.isNaN(nCols) || Number.isNaN(nRows)) {
    return { success: false, message: 'The first two lines of the world file must be numbers' };
  }
  // check if number of lines is equal to 2 + nRows
  if (lines.length !== 2 + nRows) {
    return { success: false, message: 'The number of lines in the world file is incorrect' };
  }
  return checkChars(lines, nCols, nRows);
}
