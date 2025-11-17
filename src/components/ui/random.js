import Ship from "../game/ship";

const ORIENTATION = ['H', 'V'];

export function randomizePlacement(board) {
    board.resetAll();
    const maxAttempt = 600;
    const size = board.size;
    const length = [5, 4, 3, 3, 2];

    for (const len of length) {
        const ship = new Ship(len);
        let placed = false;

        for (let attempt = 0; attempt < maxAttempt && !placed; attempt++) {
            const orientation = ORIENTATION[Math.floor(Math.random() * ORIENTATION.length)];
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);

            try {
                board.placeShip([row, col], orientation, ship, true);
                placed = true;
            } catch(_) {}
        }

        if (!placed) throw new Error('Random placement failed.');
    }
}