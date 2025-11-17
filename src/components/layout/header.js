import { Bus, Events } from "../controller";

export default function Header() {
    const frag = document.createDocumentFragment();

    const container = document.createElement('div');
    container.className = 'flex items-center justify-between';
    
    const logo = document.createElement('div');
    logo.className = 'text-3xl text-blue-300';
    logo.textContent = 'Ship';

    const span = document.createElement('span');
    span.className = 'text-blue-500 font-bold';
    span.textContent = 'Wreck';

    const action = document.createElement('div');
    action.className = 'inline-flex gap-2';

    const btnNew = document.createElement('button');
    btnNew.className = 'rounded-md text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-auto disabled:bg-blue-700';
    btnNew.textContent = 'New game';
    btnNew.addEventListener('click', () => {
        btnNew.disabled = true;

        Bus.dispatchEvent(new CustomEvent(Events.GAME_NEW));

        setTimeout(() => {
            btnNew.disabled = false;
        }, 300);
    });

    const btnRand = document.createElement('button');
    btnRand.className = 'rounded-md text-sm text-sky-900 px-4 py-2 bg-blue-400 hover:bg-blue-500 hover:text-slate-300 cursor-pointer disabled:opacity-50 disabled:cursor-auto disabled:bg-blue-500 disabled:text-slate-300';
    btnRand.textContent = 'Randomizer';
    btnRand.addEventListener('click', () => {
        btnRand.disabled = true;

        Bus.dispatchEvent(new CustomEvent(Events.RANDOM_GRID));

        setTimeout(() => {
            btnRand.disabled = false;
        }, 300);
    });

    Bus.addEventListener(Events.GAME_TURN, () => {
        btnRand.disabled = true;
    });

    Bus.addEventListener(Events.GAME_RESET, () => {
        btnRand.disabled = false;
    });

    Bus.addEventListener(Events.GAME_NEW, () => {
        btnRand.disabled = false;
    });

    [btnNew, btnRand].forEach(child => action.appendChild(child));
    logo.appendChild(span);
    [logo, action].forEach(child => container.appendChild(child));

    frag.appendChild(container);

    return frag;
}