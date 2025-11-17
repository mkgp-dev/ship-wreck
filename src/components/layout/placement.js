import { Bus, Events } from "../controller";
import { generateShips, modifyGrid, rotateOrientation, shipDragDrop } from "../ui/render";
import Ship from "../game/ship";

export const previewBoundary = (board, start, orientation, length) => board.verifyPlacement(start, orientation, length, true);
export const enablePlace = (ships, board, start, orientation, length, draw = null, modify = null) => {
    try {
        const ship = new Ship(length);
        board.placeShip(start, orientation, ship, true);

        draw();
        modify();

        if (ships.childElementCount - 1 === 0) {
            const empty = document.createElement('div');
            empty.textContent = 'No more ships to place.';

            ships.prepend(empty);
            Bus.dispatchEvent(new CustomEvent(Events.SHIP_EMPTY))
        };

        if (board.ships.length === 5) Bus.dispatchEvent(new CustomEvent(Events.GAME_START));

        return true;
    } catch(_) {
        return false;
    }
};

export default function Placement() {
    const frag = document.createDocumentFragment();

    const container = document.createElement('div');
    container.className = 'flex flex-col gap-2 w-full rounded-md p-4 bg-slate-900 border border-slate-700 opacity-100 -translate-y-0 transition-all duration-500 ease-in-out';

    const ships = document.createElement('div');
    ships.id = 'ships';
    ships.className = 'flex gap-4';

    const rotation = document.createElement('div');
    rotation.className = 'text-sm text-slate-600 select-none';
    rotateOrientation(rotation);

    Bus.addEventListener(Events.CONFIG_LOAD, (e) => {
        generateShips(ships);
        shipDragDrop(e.detail.grid, ships, e.detail.player.board, previewBoundary, enablePlace, e.detail.draw, e.detail.modify);

        setTimeout(() => {
            e.detail.cpuRandom();
            e.detail.draw();
            e.detail.modify();
        }, 100);
    });

    Bus.addEventListener(Events.GAME_NEW, () => {
        generateShips(ships);

        container.classList.remove('hidden');
        ships.classList.remove('pointer-events-none');

        requestAnimationFrame(() => {
            container.classList.remove('opacity-0', '-translate-y-2');
            container.classList.add('opacity-100', '-translate-y-0');
        });
    });

    Bus.addEventListener(Events.RANDOM_GRID, () => {
        ships.classList.add('pointer-events-none');

        requestAnimationFrame(() => {
            container.classList.remove('opacity-100', '-translate-y-0');
            container.classList.add('opacity-0', '-translate-y-2');

            setTimeout(() => {
                container.classList.add('hidden');
            }, 500);
        });
    });

    Bus.addEventListener(Events.SHIP_EMPTY, () => {
        ships.classList.add('pointer-events-none');

        requestAnimationFrame(() => {
            container.classList.remove('opacity-100', '-translate-y-0');
            container.classList.add('opacity-0', '-translate-y-2');

            setTimeout(() => {
                container.classList.add('hidden');
            }, 500);
        });
    });

    [ships, rotation].forEach(child => container.appendChild(child));
    frag.appendChild(container);
    return frag;
}