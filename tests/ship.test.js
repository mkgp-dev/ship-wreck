import Ship from "../src/components/game/ship";

describe('Ship', () => {
    test('create a new ship', () => {
        const ship = new Ship(3);
        expect(ship.length).toBe(3);
        expect(ship.hits).toBe(0);
    });

    test('check if hit increment works', () => {
        const ship = new Ship(4);
        ship.hit();
        expect(ship.hits).toBe(1);
        ship.hit();
        expect(ship.hits).toBe(2);
    });

    test('check if hit does not past with its given ship length', () => {
        const ship = new Ship(2);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.hits).toBe(2);
    });

    test('check if isSunk works', () => {
        const ship = new Ship(3);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });

    test('check if isSunk works', () => {
        const ship = new Ship(3);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });

    test('constructor throws on non-positive or non-integer length', () => {
        expect(() => new Ship(0)).toThrow();
        expect(() => new Ship(-1)).toThrow();
        expect(() => new Ship(2.5)).toThrow();
        expect(() => new Ship('3')).toThrow();
    });
});