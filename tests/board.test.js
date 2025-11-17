import Board from "../src/components/game/board";
import Ship from "../src/components/game/ship";

describe('Board', () => {
    test('verifyPlacement returns true for valid in-bounds placement', () => {
        const board = new Board();
        const bool = board.verifyPlacement([0, 0], 'H', 3);
        expect(bool).toBe(true);
    });

    test('verifyPlacement returns false when placement is out of bounds', () => {
        const board = new Board();
        const bool = board.verifyPlacement([0, 9], 'H', 3);
        expect(bool).toBe(false);
    });

    test('verifyPlacement respects adjacency rule when adjacency is set to true', () => {
        const board = new Board();
        const ship = new Ship(3);

        board.placeShip([0, 0], 'H', ship, true);

        const bool = board.verifyPlacement([0, 3], 'H', 3, true);
        expect(bool).toBe(false);
    });

    test('verifyPlacement ignores adjacency when adjacency is set to false', () => {
        const board = new Board();
        const ship = new Ship(3);

        board.placeShip([0, 0], 'H', ship, true);

        const bool = board.verifyPlacement([0, 3], 'H', 3, false);
        expect(bool).toBe(true);
    });

    test('placeShip occupies the correct cells and stores ship', () => {
        const board = new Board();
        const ship = new Ship(3);

        board.placeShip([1, 1], 'H', ship, true);

        expect(board.ships).toContain(ship);
        expect(board.occupied.has('1,1')).toBe(true);
        expect(board.occupied.has('1,2')).toBe(true);
        expect(board.occupied.has('1,3')).toBe(true);

        expect(board.location.get('1,1')).toBe(ship);
        expect(board.location.get('1,2')).toBe(ship);
        expect(board.location.get('1,3')).toBe(ship);
    });

    test('placeShip throws on invalid placement', () => {
        const board = new Board();
        const ship = new Ship(4);

        expect(() => board.placeShip([0, 9], 'H', ship, true)).toThrow();
    });

    test('receiveAttack on empty cell returns 0 and records miss', () => {
        const board = new Board();
        const result = board.receiveAttack([0, 0]);

        expect(result).toBe(0);
        expect(board.missed.has('0,0')).toBe(true);
        expect(board.shots.has('0,0')).toBe(true);
    });

    test('receiveAttack on ship cell returns 1, calls hit, and records shot', () => {
        const board = new Board();
        const ship = new Ship(2);

        board.placeShip([2, 2], 'V', ship, true);

        const result = board.receiveAttack([2, 2]);
        expect(result).toBe(1);
        expect(ship.hits).toBe(1);
        expect(board.shots.has('2,2')).toBe(true);
        expect(board.missed.has('2,2')).toBe(false);
    });

    test('receiveAttack on the same coordinate twice returns "repeat" and does not re-hit', () => {
        const board = new Board();
        const ship = new Ship(1);

        board.placeShip([4, 4], 'H', ship, true);

        const first = board.receiveAttack([4, 4]);
        const beforeHits = ship.hits;

        const second = board.receiveAttack([4, 4]);
        const afterHits = ship.hits;

        expect(first).toBe(1);
        expect(second).toBe('repeat');
        expect(afterHits).toBe(beforeHits);
    });

    test('playerShipStatus returns false when not all ships are sunk', () => {
        const board = new Board();
        const ship1 = new Ship(2);
        const ship2 = new Ship(3);

        board.placeShip([0, 0], 'H', ship1, true);
        board.placeShip([2, 0], 'H', ship2, true);

        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);

        expect(board.playerShipStatus()).toBe(false);
    });

    test('playerShipStatus returns true when all ships are sunk', () => {
        const board = new Board();
        const ship1 = new Ship(2);
        const ship2 = new Ship(3);

        board.placeShip([0, 0], 'H', ship1, true);
        board.placeShip([2, 0], 'H', ship2, true);

        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);
        board.receiveAttack([2, 0]);
        board.receiveAttack([2, 1]);
        board.receiveAttack([2, 2]);

        expect(board.playerShipStatus()).toBe(true);
    });

    test('resetAll clears board state', () => {
        const board = new Board();
        const ship = new Ship(2);

        board.placeShip([0, 0], 'H', ship, true);
        board.receiveAttack([0, 0]);
        board.receiveAttack([5, 5]);

        board.resetAll();

        expect(board.occupied.size).toBe(0);
        expect(board.location.size).toBe(0);
        expect(board.shots.size).toBe(0);
        expect(board.missed.size).toBe(0);
        expect(board.ships.length).toBe(0);
    });
});