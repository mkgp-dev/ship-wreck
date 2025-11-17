import { Bus, Events } from "../controller";
import { generateGrid } from "../ui/render";

export default function Grid() {
    const frag = document.createDocumentFragment();

    const container = document.createElement('div');
    container.className = 'flex items-start justify-between gap-6';

    const player = document.createElement('div');
    player.className = 'flex flex-col space-y-4 w-full max-w-90 shrink-0';

    const playerBanner = document.createElement('div');
    playerBanner.className = 'w-full bg-blue-500/50 p-2 uppercase font-bold text-center rounded-xs pointer-events-none select-none';
    playerBanner.textContent = 'Your fleet';

    const playerGrid = document.createElement('div');
    playerGrid.id = 'player-grid';
    playerGrid.className = 'grid grid-cols-10 grid-flow-row gap-1 select-none touch-manipulation';
    Bus.addEventListener(Events.CONFIG_LOAD, (e) => {
        generateGrid(playerGrid, e.detail.player.board);
    });

    const playerText = document.createElement('div');
    playerText.className = 'flex flex-col text-sm bg-slate-900/80 p-2 rounded-md select-none space-y-2';
    playerText.innerHTML = `
        <p>Rotate your ship's orientation by pressing <span class="rounded-xs bg-slate-900 border border-gray-700 px-1">R</span></p>
        <div class="bg-slate-800 w-full h-px"></div>
        <span id="status" class="text-slate-400"></span>
    `;

    const divider = document.createElement('div');
    divider.className = 'w-px bg-slate-800 self-stretch';

    const cpu = document.createElement('div');
    cpu.className = 'flex flex-col space-y-4 w-full max-w-90 shrink-0';

    const cpuBanner = document.createElement('div');
    cpuBanner.className = 'w-full bg-rose-500/50 p-2 uppercase font-bold text-center rounded-xs pointer-events-none select-none';
    cpuBanner.textContent = 'Opponent';

    const cpuGrid = document.createElement('div');
    cpuGrid.id = 'cpu-grid';
    cpuGrid.className = 'grid grid-cols-10 grid-flow-row gap-1 select-none touch-manipulation';
    Bus.addEventListener(Events.CONFIG_LOAD, (e) => {
        generateGrid(cpuGrid, e.detail.cpu.board);
    });

    const cpuText = document.createElement('div');
    cpuText.className = 'flex items-start gap-2 text-sm bg-slate-900/80 p-2 rounded-md select-none';
    cpuText.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 shrink-0 fill-yellow-600">
            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
        </svg>

        <span class="leading-snug text-slate-400">Your opponent is a CPU that automatically positions its fleet and attacks using algorithm-based decision-making.</span>
    `;

    [cpuBanner, cpuGrid, cpuText].forEach(child => cpu.appendChild(child));
    [playerBanner, playerGrid, playerText].forEach(child => player.appendChild(child));
    [player, divider, cpu].forEach(child => container.appendChild(child));
    frag.appendChild(container);

    return frag;
}