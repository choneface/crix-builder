export class UndoStack {
  private undoStack: Uint8ClampedArray[] = [];
  private redoStack: Uint8ClampedArray[] = [];
  private maxSize: number;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  push(state: Uint8ClampedArray): void {
    // Clone the state before pushing
    this.undoStack.push(new Uint8ClampedArray(state));
    // Clear redo stack on new action
    this.redoStack = [];
    // Limit stack size
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
  }

  undo(currentState: Uint8ClampedArray): Uint8ClampedArray | null {
    if (this.undoStack.length === 0) return null;

    // Save current state to redo stack
    this.redoStack.push(new Uint8ClampedArray(currentState));

    // Return the previous state
    return this.undoStack.pop()!;
  }

  redo(currentState: Uint8ClampedArray): Uint8ClampedArray | null {
    if (this.redoStack.length === 0) return null;

    // Save current state to undo stack
    this.undoStack.push(new Uint8ClampedArray(currentState));

    // Return the redo state
    return this.redoStack.pop()!;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  get undoCount(): number {
    return this.undoStack.length;
  }

  get redoCount(): number {
    return this.redoStack.length;
  }
}
