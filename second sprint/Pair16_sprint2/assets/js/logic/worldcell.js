// const Bug = require('./bug');
// const Position = require('./position')
import {Color} from '../assembler/definitions.js'

export class WorldCell {
	constructor (obstructed,food,base){
		// this.Pos = Position(x,y);
		this.obstructed = obstructed;
		this.bug = null;
		this.food = food;
		this.base = base;
        this.markers = {
			[Color.Swarm1]: new Map(),
			[Color.Swarm2]: new Map(),
		  }
	}

	/* BugCondition Enumeration */
	Condition ={
		FRIEND : 'friend',
		FOE : 'foe',
		FRIENDWITHFOOD : 'friendWithFood',
		FOEWITHFOOD : 'foeWithFood',
		FOOD : 'food',
		ROCK : 'rock',
		MARKER : 'marker',
		FOEMARKER : 'foeMarker',
		HOME : 'home',
		FOEHOME : 'foeHome',
	};

	static createObstacle() {
        return new WorldCell(true, 0, null);
    }

    static createFree() {
        return new WorldCell(false, 0, null);
    }

    static createWithFood(food) {
        return new WorldCell(false, food, null);
    }

    static createWithRedBase() {
        return new WorldCell(false, 0, Color.Red);
    }

    static createWithBlackBase() {
        return new WorldCell(false, 0, Color.Black);
    }


	/**
	 * is true if obstructed.
	 * @return {Boolean}
	 */
	isObstructed(){
		if (this.obstructed == true) {
			return 1;
		}
		return 0;
	}

	
	/**
	 * is true if obstructed.
	 * @return {Boolean}
	 */

	isfood(){
		if (this.food == 0) {
			return 0;
		}
		return 1;
	}

	isbase(){
		if (this.base == Color.Red) {
			return 'Red';
		}
		else if(this.base == Color.Black){
			return 'Black';
		}
		return '0';
		
	}

	/**
	 * is true if it is holding a bug.
	 * @return {Boolean}
	 */
	isOccupied(){
		if (this.bug != null){
			return 1;
		}
		return 0;
	}

	/**
	 * sets the WorldCell to be occupied by Bug b.
	 * 
	 * @param {Bug} b 
	 * @return {Boolean}
	 */
	setBug(b){
		this.bug = b;
		b.cell=this;
		return 1;
	}

	/**
	 * returns the bug of an occupied position. It is a checked run-time error to apply bug at to a cell an unoccupied cell.
	 * @return {Bug}
	 */
	getBug(){
		return this.bug;
	}

	/**
	 * removes a bug from a position; this does not affect the liveness of the bug.
	 * @return {Boolean}
	 */
	removeBug(){
		this.bug = null;
		return 1;
	}
	
	/**
	 * places food (bits) at a position.
	 * 
	 * @param {Integer} num 
	 */
	setFood(num){
		this.food = num;
	}

	/**
	 *  is true if a position belongs to bug of a given color.
	 * 
	 * @param {Color} c 
	 * @return {Boolean}
	 */
	isFriendlyBase(c){
		if (this.Color = c){
			return 1;
		}
		return 0;
	}

	/**
	 * is true if a base of a different color is at a position.
	 * 
	 * @param {Color} c
	 * @return {Boolean} 
	 */
	isEnemyBase(Color){
		if (this.Color != c) {
			return 1;
		}
		return 0;
	}

	/**
	 * Set marker at position pos for swarm of color c.
	 * 
	 * @param {Color} c
	 * @param {Position} pos 
	 */
	setMarkerAt(pos, color, markerIndex) {
		const swarmMarkers = this.markers[color];
		swarmMarkers.set(markerIndex, pos);
	  }


	clearMarkerAt(pos, color, markerIndex) {
		const swarmMarkers = this.markers[color];
		const existingPos = swarmMarkers.get(markerIndex);
		if (existingPos && existingPos.x === pos.x && existingPos.y === pos.y) {
		  swarmMarkers.delete(markerIndex);
		}
	}

	/**
	 *  is true if a position holds markers for a given color of bugs.
	 * 
	 * @param {Color} c
	 * @param {Position} pos 
	 * @return {Boolean}
	 */
	isFriendlyMarkerAt(pos, color, markerIndex) {
		const swarmMarkers = this.markers[color];
		const existingPos = swarmMarkers.get(markerIndex);
		return existingPos && existingPos.x === pos.x && existingPos.y === pos.y;
	  }
	
	  isEnemyMarkerAt(pos, color, markerIndex) {
		const enemyColor = color === Color.Swarm1 ? Color.Swarm2 : Color.Swarm1;
		const enemyMarkers = this.markers[enemyColor];
		const existingPos = enemyMarkers.get(markerIndex);
		return existingPos && existingPos.x === pos.x && existingPos.y === pos.y;
	  }
	/**
	 *  if a cell matches a condition cond for a bug of color.
	 * @param {Position} pos 
	 * @param {BugCondition} cond
	 * @param {Color} c
	 */
	cellMatches(pos, cond, c){
		if (this.cond == cond && this.Color == c) {
			return 1;
		}
		return 0;
	}

	/**
	 * @return {String}
	 */
	toString(){}
}


