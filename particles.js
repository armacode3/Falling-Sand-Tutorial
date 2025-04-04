import { checkBounds, moveParticle, getParticle, setParticle } from "./canvas.js";
import { getRandomInt } from "./util.js";

/**
 * Base particle class
 */
class Particle {
    constructor() {
        this.color = "";
        this.type = "";
    }

    /**
     * Returns true if the particle should swap with other when trying
     * to move onto the same grid location as {@link other}.
     * 
     * EX: Let sand sink below water
     * 
     * @param {Particle} other 
     * @returns {boolean} Should the particle swap
     */
    swap(other) {
        return false;
    }

    /**
     * Update the particle at location (row, col)
     * 
     * @param {number} row 
     * @param {number} col 
     */
    update(row, col) {

    }
}

/**
 * Sand particle
 */
export class Sand extends Particle {
    constructor() {
        super();
        this.color = "orange";
        this.type = "sand";
    }

    swap(other) {
        // TODO make sand fall under the water
        return other.type == "water";
    }

    update(row, col) {
        // TODO update sand
        let newRow = row + 1;
        if (!moveParticle(row, col, newRow, col)) {
            if(!moveParticle(row, col, newRow, col-1, this.swap)) {
                moveParticle(row, col, newRow, col+1, this.swap);
            }
        }
    }
}

/**
 * Create particle based on dropdown name
 * 
 * @param {string} value 
 * @returns 
 */
export function checkParticleType(value) {
    if (value == "Sand") {
        return new Sand();
    } else if (value == "Water") {
        return new Water();
    } else if (value == "Stone") {
        return new Stone();
    } else if (value == "Dirt") {
        return new Dirt();
    } else if (value == "Fire") {
        return new Fire();
    } else if (value == "Wood") {
        return new Wood();
    } else if (value == "Steam") {
        return new Steam();
    }
    return null;
}

export class Water extends Particle {
    constructor() {
        super();
        this.color = "blue";
        this.type = "water";
    }

    update(row, col) {
        // Make water turn dirt into grass when it touches it
        if (getParticle(row+1, col)?.type == "dirt") {
            // Remove water and change dirt to grass
            setParticle(row+1, col, new Grass());
            setParticle(row, col, null);
            return;
        } 

        if (getParticle(row+1, col)?.type == "wood") {
            setParticle(row+1, col, new WetWood());
            setParticle(row, col, null);
            return;
        }
        // Try to move down
        if (getRandomInt(0, 2) && !getParticle(row+1, col)) {
            moveParticle(row, col, row+1, col, super.swap);
        } 
        
        // Move left or right
        if (getRandomInt(0, 1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, super.swap);
        }
        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, super.swap);
        }
    }
}

export class Stone extends Particle {
    constructor () {
        super();
        this.color = "gray";
        this.type = "stone";
    }
}

export class Dirt extends Sand {
    constructor() {
        super();
        this.color = "brown";
        this.type = "dirt";
    }
}

export class Grass extends Sand {
    constructor() {
        super();
        this.color = "green";
        this.type = "grass";
    }
}

export class Fire extends Particle {
    constructor() {
        super();
        this.color = "yellow";
        this.type = "fire";
        this.maxDuration = 25;
        this.duration = 0;
    }

    update(row, col) {
        // Update duration
        this.duration++;

        const life = this.duration / this.maxDuration;
        if (life < 0.3) {
            this.color = "rgb(255, 200, 0)";
        } else if (life < 0.6) {
            this.color = "rgb(255, 100, 0)";
        } else {
            this.color = "rgb(200, 0, 0)";
        }

        // Burns wood
        if (getParticle(row+1, col)?.type == "wood") {
            // Remove wood and change to fire
            setParticle(row+1, col, new Fire());
            setParticle(row, col, null);
            return;
        } else if (getParticle(row-1, col)?.type == "wood") {
            setParticle(row-1, col, new Fire());
            setParticle(row, col, null);
            return;
        } else if (getParticle(row, col+1)?.type == "wood") {
            setParticle(row, col+1, new Fire());
            setParticle(row, col, null);
            return;
        } else if (getParticle(row, col-1)?.type == "wood") {
            setParticle(row, col-1, new Fire());
            setParticle(row, col, null);
            return;
        }

        // Turns water into steam
        if (getParticle(row+1, col)?.type == "water") {
            // Remove water and turns into steam
            setParticle(row+1, col, new Steam());
            setParticle(row, col, null);
            return;
        } else if (getParticle(row-1, col)?.type == "water") {
            setParticle(row-1, col, new Steam());
            setParticle(row, col, null);
            return;
        } else if (getParticle(row, col+1)?.type == "water") {
            setParticle(row, col+1, new Steam());
            setParticle(row, col, null);
            return;
        } else if (getParticle(row, col-1)?.type == "water") {
            setParticle(row, col-1, new Steam());
            setParticle(row, col, null);
            return;
        }

        // Burns wet wood
        if (getParticle(row+1, col)?.type == "wet wood") {
            // Remove wet wood and turn to fire
            if (getRandomInt(0, 100) < 5) {
                setParticle(row+1, col, new Fire());
                setParticle(row, col, null);
                return;
            }
        } else if (getParticle(row-1, col)?.type == "wet wood") {
            if (getRandomInt(0, 100) < 5) {
                setParticle(row-1, col, new Fire());
                setParticle(row, col, null);
                return;
            }
        }   else if (getParticle(row, col+1)?.type == "wet wood") {
            if (getRandomInt(0, 100) < 5) {
                setParticle(row, col+1, new Fire());
                setParticle(row, col, null);
                return;
            }
        } else if (getParticle(row, col-1)?.type == "wet wood") {
            if (getRandomInt(0, 100) < 5) {
                setParticle(row, col-1, new Fire());
                setParticle(row, col, null);
                return;
            }
        }

        // Try to move up
        if (getRandomInt(0, 2) && !getParticle(row-1, col)) {
            moveParticle(row, col, row-1, col, super.swap);
        } 
        
        // Move left or right
        if (getRandomInt(0, 1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, super.swap);
        }
        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, super.swap);
        }

        // Check fire duration
        if (this.duration >= this.maxDuration) {
            setParticle(row, col, null);
        }
    }
}

export class Wood extends Stone {
    constructor() {
        super();
        this.color = "rgb(150, 75, 0)";
        this.type = "wood";
    }
}

export class WetWood extends Wood {
    constructor() {
        super();
        this.color = "rgb(157, 108, 60)";
        this.type = "wet wood";
        this.spreadTime = 5
    }

    update(row, col) {
        // Turn wood into wet wood
        if (getParticle(row+1, col)?.type == "wood") {
            if (getRandomInt(0, 100) < this.spreadTime) {
                setParticle(row+1, col, new WetWood());
                return;
            }
        } else if (getParticle(row-1, col)?.type == "wood") {
            if (getRandomInt(0, 100) < this.spreadTime) {
                setParticle(row-1, col, new WetWood());
                return;
            }
        } else if (getParticle(row, col+1)?.type == "wood") {
            if (getRandomInt(0, 100) < this.spreadTime) {
                setParticle(row, col+1, new WetWood());
                return;
            }
        } else if (getParticle(row, col-1)?.type == "wood") {
            if (getRandomInt(0, 100) < this.spreadTime) {
                setParticle(row, col-1, new WetWood());
                return;
            }
        }
    }
}

export class Steam extends Particle {
    constructor() {
        super();
        this.color = "rgb(240, 240, 240)";
        this.type = "steam";
        this.maxDuration = 200;
        this.duration = 0;
    }

    update(row, col) {
        this.duration++;

        const life = this.duration / this.maxDuration;
        if (life < 0.3 ) {
            this.color = "rgb(230, 230, 235)"
        } else if (life < 0.6) {
            this.color = "rgb(220, 220, 225)"
        } else {
            this.color = "rgb(190, 200, 210)"
        }
        // Moves up
        if (getRandomInt(0, 2) && !getParticle(row-1, col)) {
            moveParticle(row, col, row-1, col, super.swap);
        } 
        
        // Move left or right
        if (getRandomInt(0, 1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, super.swap);
        }
        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, super.swap);
        }

        // Check steam duration
        if (this.duration >= this.maxDuration) {
            setParticle(row, col, null);
        }

        if (getRandomInt(0, 1000) < 1) {
            setParticle(row, col, new Water());
        }
    }
}