import Grid from "./grid";
import Header from "./header";
import Placement from "./placement";

export default function Main() {
    const frag = document.createDocumentFragment();

    const container = document.createElement('div');
    container.className = 'flex items-center justify-center h-screen';

    const body = document.createElement('div');
    body.className = 'w-full max-w-4xl space-y-4';

    [Header(), Placement(), Grid()].forEach(child => body.appendChild(child));

    container.appendChild(body);
    frag.appendChild(container);

    return frag;
}