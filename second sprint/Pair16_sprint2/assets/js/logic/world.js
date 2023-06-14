// const WorldCell = require('./worldcell')
// const Position = require('./position')
import { WorldCell } from './worldcell.js';
import { Position } from "../assembler/definitions.js";

export class World {
	constructor(xSize, ySize,map) {
		this.xSize = xSize;
		this.ySize = ySize;
		const worldMap = map.map(row => row.map(charToWorldCell))
		this.map = worldMap;
		// for(let i = 0; i < this.xSize; i++) {
		// 	this.map.push([]);
		// 	for (let j = 0; j < this.ySize; j++) {
		// 		this.map[i].push(new WorldCell(i,j));
		// 	}
		// }
		function charToWorldCell(char) {
			if (char === "#") {
			  return WorldCell.createObstacle();
			}
			if (char === ".") {
			  return WorldCell.createFree();
			}
			if (char >= "0" && char <= "9") {
			  return WorldCell.createWithFood(char - '0');
			}
			if (char === "+") {
			  return WorldCell.createWithRedBase();
			}
			if (char === "-") {
			  return WorldCell.createWithBlackBase();
			}
			throw WorldParseError("Invalid map character: " + char);
		}
	
		// for(let i=0;i<Simulation.world.ylen;i++){
		// 	for(let j=0;j<Simulation.world.xlen;j++){
		// 		console.log(Simulation.world.map[i][j].obstructed)
		// 	}
	
		// }
	}

	/* Color Enumeration */
	Color = {
		RED: "red",
		BLACK: "black",
	};


	/** 
	 * Delivers the cell immediately neighbouring p in direction d.
	 * 
	 * @param {Position} pos The set of coordinates serving as the middle point.
	 * @param {Integer} d The direction to deliver based on point p.
	 * @return {WorldCell} The coordinates of the cell neighbouring p in direction d.
	 */ 
	adjacent(pos, d) {
		let x = pos.x, y = pos.y;
		switch(d) {
			case 0: //right
				x += 1;
				break;
			case 1: //bottom-right
				x+=1;
				y+=1;
				break;
			case 2://bottom-left
				y+=1;
				break;
			case 3://left
				x-=1;
				break;
			case 4://top-left
				y-=1;
				x-=1;
				break;
			case 5://top-right
				y-=1;
				break;
			default:
				throw new Error("Invalid Direction");
		}
		
		return new Position(x,y); // Note: this function may return an out-of-bounds position. Check this with outOfBounds().
	}

	/**
	 * 
	 * @param {Integer} d 
	 * @param {Integer} turn 
	 * @return {Integer}
	 */
	turn(d,turn){}

	/**
	 * determines the target position from position p and absolute heading dir.
	 * 
	 * @param {Position} pos 
	 * @param {Integer} d 
	 * @return {WorldCell}
	 */
	sensedCell(pos,d){
		return this.cellAt(pos).adjacent(pos,d);
	}
	
	/**
	 * 
	 * @param {Position} pos 
	 * @return {Boolean}
	 */
	isObstructedAt(pos){
		this.cellAt(pos).isObstructed();
	}

	/**
	 * 
	 * @param {Position} pos 
	 * @return {Boolean}
	 */
	isOccupiedAt(pos){
		this.cellAt(pos).isOccupied();
	}

	/**  Places a bug at a position.
	 * 
	 * @param {Position} pos 
	 * @param {Bug} b 
	 * @return {Boolean}
	 */
	setBugAt(pos,b) {
		this.cellAt(pos).setBug(b);
	}

	/**Returns the bug of an occupied position. It is a checked run-time error to apply bug at to a cell an unoccupied cell.
	 * 
	 * @param {Position} pos
	 * @return {Bug} 
	 */
	getBugAt(pos){
		this.cellAt(pos).getBug()
	}

	/**
	 * Removes a bug from a position; this does not affect the liveness of the bug.
	 * 
	 * @param {Position} pos 
	 * @return {Boolean}
	 */
	removeBugAt(pos){
		this.cellAt(pos).removeBug()
	}

	/**
	 * 
	 * @param {Position} pos 
	 * @param {Integer} num 
	 */
	setFoodAt(pos,num){
		this.cellAt(pos).setFood(num);
	}

	/**
	 * 
	 * @param {Position} pos 
	 * @param {Integer} num 
	 * @return {Integer}
	 */
	getFoodAt(pos,num){
		return this.cellAt(pos).food;
	}

	/** Is true if a position belongs to bug of a given color.
	 * 
	 * @param {Position} pos 
	 * @param {Color} c 
	 * @return {Boolean}
	 */
	isFriendlyBaseAt(pos,c){
		this.cellAt(pos).isFriendlyBase(c);
	}

	/**Is true if a base of a different color is at a position.
	 * 
	 * @param {Position} pos 
	 * @param {Color} c 
	 * @return {Boolean}
	 */
	isEnemyBaseAt(pos,c){
		this.cellAt(pos).isEnemyBase(c);
	}

	/**
	 *  Set marker i at position pos for swarm of color c.
	 * 
	 * @param {Position} pos The set of coordinates serving as the reference position.
	 * @param {Color} c The color of the swarm.
	 * @param {Integer} i The marker number.
	 */
	setMarkerAt(pos, c, i) {
		this.cellAt(pos).setMarker(c,pos);
	}

	/**
	 *  Delete marker i at position pos for swarm of color c
	 * 
	 * @param {Position} pos The set of coordinates serving as the reference position.
	 * @param {Color} c The color of the swarm.
	 * @param {Integer} i The marker number.
	 */
	clearMarkerAt(pos, c, i) {
		this.cellAt(pos).clearMarker(c,pos);
	}

	/**
	 *  Return true if marker i is set at position p for color c
	 * 
	 * @param {Position} pos The set of coordinates serving as the reference position.
	 * @param {Color} c The color of the swarm.
	 * @param {Integer} i The marker number.
	 */
	isFriendlyMarkerAt(pos, c, i) {
		return this.cellAt(pos).isFriendlyMarker(c,pos);
	}

	/**
	 *  Return true if at position pos any marker is set by the adversarial swarm
	 * 
	 * @param {Position} pos The set of coordinates serving as the reference position.
	 * @param {Color} c The color of the swarm.
	 * @param {Integer} i The marker number.
	 */
	isEnemyMarkerAt(pos, c, i) {
		return this.cellAt(pos).isEnemyMarker(c,pos);
	}

	/**
	 * @return {String}
	 */
	toString(){}

	/* Below are Custom Functions to support implementation */

	/** 
	 * Checks if a position is within valid map bounds.
	 * 
	 * @param {vector} p A set of coordinates.
	 * @return {boolean} true/false within map bounds.
	 */ 
	outOfBounds(p) { //not sure if mapsize should be a global variable or passed through the function.
		//(grab) board params
		let xlen = parseInt(sessionStorage.getItem("xlen"));
		let ylen = parseInt(sessionStorage.getItem("ylen"));
		
		//check boundaries
		if (p.x >= 0 && p.x < xlen && p.y >= 0 && p.y < ylen)
		{
			return true;
		}
		return false;
	}

	/** returns the WorldCell of the given Position
	 * 
	 * @param {Position} pos 
	 * @returns {WorldCell}
	 */
	cellAt(pos){
		return this.map[pos.x][pos.y];
	}

	redNestPositions() {
        const positions = [];
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                if (this.map[x][y].base == Color.Swarm1) {
                    positions.push(new Position(x, y));
                }
            }
        }
        return positions;
    }

    blackNestPositions() {
        const positions = [];
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                if (this.map[x][y].base == Color.Swarm2) {
                    positions.push(new Position(x, y));
                }
            }
        }
        return positions;
    }
}


// const world = new World(10,10)
// console.log(world);