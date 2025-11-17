import Board from "./board";

export default class Player {
    constructor({ computer = false } = {}) {
        this.board = new Board();
        this.computer = computer;
        this.against = new WeakMap();
        this.targets = new WeakMap();
        this.seen = new WeakMap();
        this.cluster = new WeakMap();
    }

    #key(r, c) {
        return `${r},${c}`;
    }

    #get(board) {
        if (!this.against.has(board)) this.against.set(board, new Set());
        return this.against.get(board);
    }

    #queue(board) {
        if (!this.targets.has(board)) this.targets.set(board, []);
        return this.targets.get(board);
    }

    #seen(board) {
        if (!this.seen.has(board)) this.seen.set(board, new Set());
        return this.seen.get(board);
    }

    #cluster(board) {
        if (!this.cluster.has(board)) this.cluster.set(board, new Map());
        return this.cluster.get(board);
    }

    #adjacent(a, b) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
    }

    #seed(opponent, origin) {
        const [r, c] = origin;
        const board = opponent.board;
        const queue = this.#queue(board);
        const seen = this.#seen(board);
        
        for (const p of [[r-1,c],[r+1,c],[r,c-1],[r,c+1]]) {
            const key = this.#key(p[0], p[1]);
            if (!seen.has(key)) {
                queue.push(p);
                seen.add(key);
            }
        }
    }

    #push(board, array) {
        const key = this.#key(array[0], array[1]);
        const queue = this.#queue(board);
        const seen = this.#seen(board);
        if (!seen.has(key)) {
            queue.push(array);
            seen.add(key);
        }
    }

    attack(opponent, coordinate) {
        return opponent.board.receiveAttack(coordinate);
    }

    cpuAttack(opponent) {
        if (!this.computer) throw new Error('CPU usage only.');

        const board = opponent.board;
        const size = board.size;
        const tried = this.#get(board);

        const queue = this.#queue(board);
        while (queue.length) {
            const [r, c] = queue.shift();
            if (r < 0 || r >= size || c < 0 || c >= size) continue;
            
            const key = this.#key(r, c);
            if (tried.has(key)) continue;
            tried.add(key);
            return [r, c];
        }

        const hunt = [];
        const fallback = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const key = this.#key(r, c);
                if (tried.has(key)) continue;
                ((r + c) % 2 === 0 ? hunt : fallback).push([r, c]);
            }
        }

        const pool = hunt.length ? hunt : fallback;
        if (!pool.length) throw new Error('No moves remaining');
        const pick = pool[Math.floor(Math.random() * pool.length)];
        tried.add(this.#key(pick[0], pick[1]));

        return pick;
    }

    cpuAnalyzeAttack(opponent, coordinate, result) {
        if (result !== 1) return;
        const board = opponent.board;
        const cluster = this.#cluster(board);

        let chosen = null;
        for (const [id, data] of cluster.entries()) {
            for (const h of data.hits) {
                const [r, c] = h.split(',').map(Number);
                if (this.#adjacent([r, c], coordinate)) {
                    chosen = id;
                    break;
                }
            }
            if (chosen) break;
        }

        if (!chosen) {
            chosen = `c${cluster.size + 1}`;
            cluster.set(chosen, {
                hits: new Set(),
                direction: null,
                front: coordinate,
                back: coordinate
            });
        }

        const data = cluster.get(chosen);
        data.hits.add(this.#key(coordinate[0], coordinate[1]));

        if (data.hits.size >= 2 && data.direction === null) {
            const array = Array.from(data.hits).map(str => str.split(',').map(Number));
            const [a, b] = array.slice(0, 2);
            data.direction = a[0] === b[0] ? 'H' : (a[1] === b[1] ? 'V' : null);
        }

        if (data.direction) {
            const points = Array.from(data.hits).map(str => str.split(',').map(Number));

            if (data.direction === 'H') {
                points.sort((p, q) => p[1] - q[1]);
                const left = [points[0][0], points[0][1]-1];
                const right = [points[points.length-1][0], points[points.length-1][1]+1];
                data.front = left;
                data.back = right;
                this.#push(board, left);
                this.#push(board, right);
            } else {
                points.sort((p, q) => p[0] - q[0]);
                const up = [points[0][0]-1, points[0][1]];
                const down = [points[points.length-1][0]+1, points[points.length-1][1]];
                data.front = up;
                data.back = down;
                this.#push(board, up);
                this.#push(board, down);
            }
        } else {
            this.#seed(opponent, coordinate);
        }
    }
}