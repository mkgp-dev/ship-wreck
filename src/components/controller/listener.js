import { Bus, Events } from ".";
import { generateGrid, modifyGrid } from "../ui/render";
import { randomizePlacement } from "../ui/random";
import Player from "../game/player";

export default function Listener() {
    let turn = 'placement';
    let player, cpu;

    player = new Player({ computer: false });
    cpu = new Player({ computer: true });

    const playerGrid = document.getElementById('player-grid');
    const cpuGrid = document.getElementById('cpu-grid');

    const status = document.getElementById('status');
    const setStatus = (text) => status.textContent = text;
    setStatus('Place your ships, be wise.');

    const attack = ([row, col]) => {
        if (player.board.playerShipStatus()) return;

        const result = player.attack(cpu, [row, col]);

        if (result === 1) setStatus('You hit a part of it.');
        else setStatus('Sorry, you missed.');

        turn = 'cpu';
        setTimeout(cpuAttack, 1000);
        Bus.dispatchEvent(new CustomEvent(Events.GAME_TURN));
    };

    const cpuAttack = () => {
        if (cpu.board.playerShipStatus()) return;

        const coordinate = cpu.cpuAttack(player);
        const result = cpu.attack(player, coordinate);

        if (result === 1) {
            cpu.cpuAnalyzeAttack(player, coordinate, result);
            setStatus('Enemy got a hit!');
        } else setStatus('Enemy missed, boohoo.');

        turn = 'player';
        Bus.dispatchEvent(new CustomEvent(Events.GAME_TURN));
    };

    const draw = () => {
        generateGrid(playerGrid, player.board);
        generateGrid(cpuGrid, cpu.board);
    };

    const modify = () => {
        const click = turn === 'player' && !cpu.board.playerShipStatus() && !player.board.playerShipStatus();

        modifyGrid(playerGrid, player.board, true);
        modifyGrid(cpuGrid, cpu.board, false, click ? attack : null);
    }

    const randomizer = () => {
        randomizePlacement(player.board);
        randomizePlacement(cpu.board);
    };

    const cpuRandom = () => randomizePlacement(cpu.board);

    Bus.addEventListener(Events.GAME_NEW, () => {
        turn = 'placement';

        player.board.resetAll();
        cpu.board.resetAll();

        cpuRandom();

        draw();
        modify();

        setStatus('Place your ships, be wise.');
    });

    Bus.addEventListener(Events.RANDOM_GRID, () => {
        player.board.resetAll();
        cpu.board.resetAll();
        
        turn = 'player';
        randomizer();
        draw();
        modify();

        setStatus('Boards randomized, attack!');
    });

    Bus.addEventListener(Events.GAME_START, () => {
        turn = 'player';
        draw();
        modify();

        setStatus('All ships are in placed, attack!');
    });

    Bus.addEventListener(Events.GAME_TURN, () => {
        if (turn === 'placement') return;

        draw();
        modify();

        if (player.board.playerShipStatus()) {
            turn = 'placement';
            setStatus('You got defeated by your opponent.');
            Bus.dispatchEvent(new CustomEvent(Events.GAME_RESET));
        }

        if (cpu.board.playerShipStatus()) {
            turn = 'placement';
            setStatus('You won the game!');
            Bus.dispatchEvent(new CustomEvent(Events.GAME_RESET));
        }
    });

    Bus.dispatchEvent(new CustomEvent(Events.CONFIG_LOAD, { detail: { player, cpu, grid: playerGrid, draw, modify, cpuRandom } }));
}