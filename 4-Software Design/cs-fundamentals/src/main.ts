import { EditHistory } from "./edit-history.ts";

function getElement<T extends Element>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) {
        throw new Error(`Missing element: ${selector}`);
    }
    return element;
}

const input = getElement<HTMLInputElement>("#text");
const undoButton = getElement<HTMLButtonElement>("#undo");
const redoButton = getElement<HTMLButtonElement>("#redo");

const history = new EditHistory(input.value);

function updateButtons(): void {
    undoButton.disabled = !history.canUndo;
    redoButton.disabled = !history.canRedo;
}

input.addEventListener("input", () => {
    console.log('input')
    console.log(input)
    console.log('history')
    console.log(history)
    history.record(input.value);
    updateButtons();
});

undoButton.addEventListener("click", () => {
    history.undo();
    input.value = history.current;
    updateButtons();
});

redoButton.addEventListener("click", () => {
    history.redo();
    input.value = history.current;
    updateButtons();
});

updateButtons();
