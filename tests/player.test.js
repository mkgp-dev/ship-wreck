import Player from "../src/components/game/player";
import Ship from "../src/components/game/ship";

describe('Player', () => {
    test('attack forwards to opponent board and returns result', () => {
        const attacker = new Player({ computer: false });
        const defender = new Player({ computer: false });

        const ship = new Ship(1);
        defender.board.placeShip([0, 0], 'H', ship, true);

        const result = attacker.attack(defender, [0, 0]);

        expect(result).toBe(1);
        expect(ship.hits).toBe(1);
        expect(defender.board.shots.has('0,0')).toBe(true);
    });

    test('cpuAttack throws when called on non-computer player', () => {
        const human = new Player({ computer: false });
        const opponent = new Player({ computer: false });
        
        expect(() => human.cpuAttack(opponent)).toThrow('CPU usage only.');
    });

    test('cpuAttack returns in-bounds coordinates', () => {
        const cpu = new Player({ computer: true });
        const opponent = new Player({ computer: false });
        const size = opponent.board.size;

        for (let i = 0; i < 50; i++) {
        const [row, col] = cpu.cpuAttack(opponent);
        expect(row).toBeGreaterThanOrEqual(0);
        expect(row).toBeLessThan(size);

        expect(col).toBeGreaterThanOrEqual(0);
        expect(col).toBeLessThan(size);
        }
    });

    test('cpuAttack does not return the same coordinate twice', () => {
        const cpu = new Player({ computer: true });
        const opponent = new Player({ computer: false });

        const tried = new Set();

        for (let i = 0; i < 50; i++) {
            const [row, col] = cpu.cpuAttack(opponent);
            const key = `${row},${col}`;
            expect(tried.has(key)).toBe(false);
            tried.add(key);
        }
    });
});