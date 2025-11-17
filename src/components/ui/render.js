import Main from "../layout";

let currentOrientation = 'H';

const countHits = (board) => {
    const hits = new Set();
    board.shots.forEach(key => {
       if (board.occupied.has(key)) hits.add(key); 
    });

    return hits;
};

const clearPreview = (array) => {
    for (const list of array) {
        list.classList.remove('border-emerald-600', 'border-rose-600', 'bg-emerald-900', 'bg-rose-900');

        if (!list.classList.contains('bg-slate-900')) list.classList.add('bg-slate-900');
        if (!list.classList.contains('border-slate-700')) list.classList.add('border-slate-700');
    }

    return array = [];
};

export function initializeLayout() {
    const app = document.getElementById('app');
    app.appendChild(Main());
}

export function generateGrid(root, board) {
    const size = board.size;

    const frag = document.createDocumentFragment();
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.className = 'w-8 h-8 place-items-center bg-slate-900 border border-slate-700 rounded-sm';
            cell.dataset.type = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            frag.appendChild(cell);
        }
    }

    root.replaceChildren(frag);
}

export function modifyGrid(root, board, reveal = true, click = null) {
    const missed = board.missed;
    const hits = countHits(board);

    for (const child of root.children) {
        const key = `${child.dataset.row},${child.dataset.col}`;
        
        if (hits.has(key)) {
            child.classList.replace('bg-slate-900', 'bg-rose-900');
            child.classList.replace('border-slate-700', 'border-rose-700');
        } else if (missed.has(key)) {
            child.classList.replace('bg-slate-900', 'bg-slate-600');
            child.classList.replace('border-slate-700', 'border-gray-700');
        } else if (reveal && board.occupied.has(key)) {
            child.classList.replace('bg-slate-900', 'bg-blue-900/70');
        }

        if (click && !hits.has(key) && !missed.has(key)) {
            child.classList.add('cursor-pointer', 'hover:border-blue-500');
            child.addEventListener('click', () => click([child.dataset.row, child.dataset.col]));
        }
    }
}

export function generateShips(root) {
    const ships = [5, 4, 3, 3, 2];
    root.replaceChildren();

    ships.forEach((length, index) => {
        const ship = document.createElement('div');
        ship.className = 'bg-slate-800/30 border border-gray-700/50 rounded-sm p-2 flex items-center gap-2 cursor-grab active:cursor-grabbing';
        ship.draggable = true;
        ship.dataset.length = length;
        ship.dataset.orientation = 'H';
        ship.dataset.id = `ship-${index}`;

        const label = document.createElement('div');
        label.textContent = `Length ${length}`;

        const pill = document.createElement('div');
        pill.className ='flex gap-1';
        for (let i = 0; i < length; i++) {
            const cell = document.createElement('div');
            cell.className = 'w-4 h-4 rounded-xs bg-slate-900 border border-gray-700';
            pill.appendChild(cell);
        }

        [label, pill].forEach(child => ship.appendChild(child));
        root.appendChild(ship);
    });
}

export function rotateOrientation(root) {
    root.textContent = `Your ship placement orientation is ${currentOrientation === 'H' ? 'Horizontal' : 'Vertical'}`;
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'r') {
            currentOrientation = currentOrientation === 'H' ? 'V' : 'H';
            root.textContent = `Your ship placement orientation is ${currentOrientation === 'H' ? 'Horizontal' : 'Vertical'}`;
        }
    });
}

export function shipDragDrop(grid, root, board, preview = null, place = null, draw = null, modify = null) {
    if (root.dataset.dnd === 'true') return;
    root.dataset.dnd = 'true';

    let drag = null;
    let previewShip = [];

    root.addEventListener('dragstart', (e) => {
        const ship = e.target.closest('[data-id]');
        if (!ship) return;

        drag = {
            length: Number(ship.dataset.length),
            orientation: currentOrientation,
            id: ship.dataset.id,
            ship
        };

        e.dataTransfer.setData('text/plain', drag.id);
    });

    grid.addEventListener('dragover', (e) => {
        if (!drag) return;
        e.preventDefault();

        const size = board.size;
        const cell = e.target.closest('[data-type="cell"]');
        if (!cell) return;

        clearPreview(previewShip);

        const row = Number(cell.dataset?.row ?? -1);
        const col = Number(cell.dataset?.col ?? -1);

        const cells = [];
        let boundary = true;

        for (let i = 0; i < drag.length; i++) {
            const currentRow = drag.orientation === 'H' ? row : row + i;
            const currentCol = drag.orientation === 'H' ? col + i : col;

            if (currentRow < 0 || currentRow >= size || currentCol < 0 || currentCol >= size) {
                boundary = false;
                break;
            }

            const index = currentRow * size + currentCol;
            const child = grid.children[index];
            if (!child) {
                boundary = false;
                break;
            }

            if (child.classList.contains('bg-blue-900/70')) {
                boundary = false;
                break;
            }

            cells.push(child);
        }

        if (!boundary) {
            previewShip = [];
            return;
        }

        previewShip = cells;

        const valid = preview(board, [row, col], drag.orientation, drag.length);
        cells.forEach(child => {
            child.classList.replace('border-slate-700', valid ? 'border-emerald-600' : 'border-rose-600');
            child.classList.replace('bg-slate-900', valid ? 'bg-emerald-900' : 'bg-rose-900')
        });
    });

    grid.addEventListener('dragleave', () => clearPreview(previewShip));

    grid.addEventListener('drop', (e) => {
        if (!drag) return;
        e.preventDefault();

        const cell = e.target.closest('[data-type="cell"]');
        if (!cell) return;

        const row = Number(cell.dataset?.row ?? -1);
        const col = Number(cell.dataset?.col ?? -1);

        const valid = preview(board, [row, col], drag.orientation, drag.length);
        if (!valid) {
            clearPreview(previewShip);
            return;
        }

        const placement = place(root, board, [row, col], drag.orientation, drag.length, draw, modify);
        if (placement) {
            drag.ship.remove();
            drag = null;
            clearPreview(previewShip);
        } else {
            clearPreview(previewShip);
        }
    });
}