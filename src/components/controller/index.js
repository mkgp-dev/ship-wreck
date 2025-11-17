export const Bus = new EventTarget();

export const Events = {
    CONFIG_LOAD: 'game:load',
    GAME_TURN: 'game:turn',
    GAME_RESET: 'game:reset',
    GAME_NEW: 'game:new',
    GAME_START: 'game:start',
    SHIP_EMPTY: 'ship:empty',
    RANDOM_GRID: 'game:random'
};