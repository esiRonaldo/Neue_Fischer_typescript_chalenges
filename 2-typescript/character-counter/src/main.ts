const textarea = document.getElementById("message");
const charCount = document.getElementById("char-count");
const sendButton = document.getElementById("send-button");

if (!(textarea instanceof HTMLTextAreaElement)) {
    throw new Error("Element #message not found");
}
if (!(charCount instanceof HTMLParagraphElement)) {
    throw new Error("Element #char-count not found");
}
if (!(sendButton instanceof HTMLButtonElement)) {
    throw new Error("Element #send-button not found");
}
const MAX_LENGTH = 140;

const handleInput = (event: InputEvent): void => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) {
        return;
    }
    const length = target.value.length;
    charCount.textContent = `${length} / ${MAX_LENGTH}`;
    sendButton.disabled = length > MAX_LENGTH;
};

textarea.addEventListener("input", handleInput);