import { EditHistory } from "./edit-history.ts";

const history = new EditHistory("");
history.record("a");
history.record("ab");
history.record("abc");

history.undo();
history.undo();
console.log(history.current, history.canUndo, history.canRedo);

history.redo();
console.log(history.current);

history.record("abx");
console.log(history.current, history.canRedo);
