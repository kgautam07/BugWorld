import { World } from "../logic/world.js";
import { WorldCell } from '../logic/worldcell.js'
import { WorldParseError } from "../error/error.js";

export const worldtest = function(map){

    const lines = map.split('\n');
    if (lines.length < 2) {
      return new WorldParseError("At least 2 lines containing width and height expected.")
    }
    const width = parseInt(lines[0]);
    const height = parseInt(lines[1]);
    if (isNaN(width) || isNaN(height)) {
      return new WorldParseError("Width and height must be integers. Got " + lines[0] + " and " + lines[1] + ".")
    }
    const map2 = lines
                    .slice(2)
                    .map(line => line.replace(/\r/g, ''))
                    .map(line => line.split(''));

    let err = null
    if ((err = checkMapDimensions(map2, width, height)) && err instanceof Error) {
      return new WorldParseError("Invalid dimensions. " + err.message)
    }

    if ((err = checkBugSwarms(map2, width, height)) && err instanceof Error) {
      return new WorldParseError("Invalid bug nest. " + err.message)
    }

    if ((err = checkOuterBorder(map2, width, height)) && err instanceof Error) {
      return new WorldParseError("Invalid outer border. " + err.message)
    }

    try {
      //  const worldMap = map2.map(row => row.map(charToWorldCell))
       return new World(width, height,map2)
    } catch (err) {
      if (err instanceof WorldParseError) {
        return new WorldParseError("Invalid map. " + err.message)
      }
      return new Error("Unexpected error when parsing map. " + err.message)
    }
}

function checkMapDimensions(map, width, height) {
    // Check if the map has the expected number of rows
    if (map.length !== height) {
      return new WorldParseError("Expected " + height + " rows, but got " + map.length);
    } 
   
    for (let i = 0; i < height; i++) {
      if (map[i].length !== width) {
        return new WorldParseError("Expected " + width + " columns, but got " + map[i].length + " on row " + i)
      }
    }
   
    return true;
  }

  function checkBugSwarms(map,exactwidth,height) {
    let hasRedSwarm = false;
    let hasBlackSwarm = false;
  
   
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < map[i].length; j++) {
        const cell = map[i][j];
  
       
        if (cell === "+") {
          hasRedSwarm = true;
        } else if (cell === "-") {
          hasBlackSwarm = true;
        }
      }
    }
  
    if (!hasRedSwarm) {
      return new WorldParseError("Missing red bug swarm");
    }
   
    if (!hasBlackSwarm) {
      return new WorldParseError("Missing black bug swarm");
    }
   
    return true;
  }

  function checkOuterBorder(map,width,height) {
  
    // Check top and bottom borders
    for (let i = 0; i < width; i++) {
        if(i%2==0){
          if (map[0][i] !== "#") {
            return new WorldParseError("Border must be obstructed, instead got " + map[0][i]);
          } 
          if (map[height - 1][i] !== "#") {
            return new WorldParseError("Border must be obstructed, instead got " + map[height - 1][i]);
          }
        }
    }
  
    // Check left and right borders
    for (let i = 0; i < height; i++) {
        if (map[i][0] !== "#") {
          return new WorldParseError("Border must be obstructed, instead got " + map[i][0]);
        }
        if (map[i][width - 1] !== "#") {
          return new WorldParseError("Border must be obstructed, instead got " + map[i][width - 1]);
        }
    }
  
    
    return true;
  }



// function checkSwarmLink(arr) {
//     const height = arr.length;
//     const width = arr[0].length;
  
//     // Find the first "+" or "-" character
//     let startX, startY;
//     for (let i = 0; i < height; i++) {
//       for (let j = 0; j < width; j++) {
//         const char = arr[i][j];
//         if (char === "+" || char === "-") {
//           startX = j;
//           startY = i;
//           break;
//         }
//       }
//       if (startX !== undefined) {
//         break;
//       }
//     }
  
//     // Check if all adjacent "+" and "-" characters are next to each other
//     const visited = Array(height).fill().map(() => Array(width).fill(false));
//     const queue = [{ x: startX, y: startY }];
//     visited[startY][startX] = true;
  
//     while (queue.length > 0) {
//       const { x, y } = queue.shift();
  
//       const dx = [0, 0, 1, -1];
//       const dy = [1, -1, 0, 0];
  
//       for (let i = 0; i < 4; i++) {
//         const newX = x + dx[i];
//         const newY = y + dy[i];
  
//         if (
//           newX >= 0 &&
//           newX < width &&
//           newY >= 0 &&
//           newY < height &&
//           !visited[newY][newX]
//         ) {
//           const char = arr[newY][newX];
//           if (char === "+" || char === "-") {
//             queue.push({ x: newX, y: newY });
//             visited[newY][newX] = true;
//           } else {
//             return false;
//           }
//         }
//       }
//     }
  
//     return true;
//   }
  
  