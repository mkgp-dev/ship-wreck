export default class Board {
    constructor() {
        this.size = 10;
        this.occupied = new Set();
        this.location = new Map();
        this.shots = new Set();
        this.missed = new Set();
        this.ships = [];
    }

    #inbound([r, c]) {
        return r >= 0 && c >= 0 && r < this.size && c < this.size;
    }

    #key([r, c]) {
        return `${r},${c}`;
    }

    #placement([row, col], orientation, length) {
        const cells = [];
        if (orientation === 'H') for (let i = 0; i < length; i++) cells.push([row, col + i]);
        else if (orientation === 'V') for (let i = 0; i < length; i++) cells.push([row + i, col]);
        else throw new Error('Invalid orientation.');

        return cells;
    }

    #limit([r, c]) {
        const outOfBounds = [];
        for (let row = -1; row <= 1; row++) {
            for (let col = -1; col <= 1; col++) {
                const currRow = r + row;
                const currCol = c + col;
                if (this.#inbound([currRow, currCol])) outOfBounds.push([currRow, currCol]);
            }
        }

        return outOfBounds;
    }

    #validate(start, orientation, length, adjacency = true) {
        const cells = this.#placement(start, orientation, length);
        if (!cells.every((p) => this.#inbound(p))) return false;

        for (const [row, col] of cells) {
            const key = this.#key([row, col]);

            if (this.occupied.has(key)) return false;
            if (adjacency) {
                const area = this.#limit([row, col]);
                for (const a of area) {
                    const key = this.#key(a);
                    if (this.occupied.has(key)) return false;
                }
            }
        }

        return true;
    }

    verifyPlacement(start, orientation, ship, adjacency = true) {
        const length = typeof ship === 'number' ? ship : ship.length;
        return this.#validate(start, orientation, length, adjacency);
    }

    placeShip(start, orientation, ship, adjacency) {
        if (!this.#validate(start, orientation, ship.length, adjacency)) throw new Error('Cannot be placed here.');

        const cell = this.#placement(start, orientation, ship.length);

        cell.forEach(p => {
            const key = this.#key(p);
            this.occupied.add(key);
            this.location.set(key, ship);
        });

        this.ships.push(ship);
    }

    receiveAttack(coordinate) {
        const key = this.#key(coordinate);
        if (!this.#inbound(coordinate)) throw new Error('Out of bounds.');
        if (this.shots.has(key)) return 'repeat';

        this.shots.add(key);

        if (this.occupied.has(key)) {
            const ship = this.location.get(key);
            ship.hit();
            return 1;
        } else {
            this.missed.add(key);
            return 0;
        }
    }

    playerShipStatus() {
        return this.ships.length > 0 && this.ships.every(ship => ship.isSunk());
    }

    resetAll() {
        this.occupied.clear();
        this.location.clear();
        this.shots.clear();
        this.missed.clear();
        this.ships = [];
    }
}