export class InputSystem {
  private keys: Set<string> = new Set();
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseDown: boolean = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.setupListeners();
  }

  private setupListeners(): void {
    this.canvas.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      e.preventDefault();
    });

    this.canvas.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    });

    this.canvas.addEventListener('mousedown', () => {
      this.mouseDown = true;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });
  }

  isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }

  isKeyPressed(code: string): boolean {
    const pressed = this.keys.has(code);
    if (pressed) {
      this.keys.delete(code);
    }
    return pressed;
  }

  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  isMouseDown(): boolean {
    return this.mouseDown;
  }

  destroy(): void {
    this.canvas.removeEventListener('keydown', () => {});
    this.canvas.removeEventListener('keyup', () => {});
    this.canvas.removeEventListener('mousemove', () => {});
    this.canvas.removeEventListener('mousedown', () => {});
    this.canvas.removeEventListener('mouseup', () => {});
  }
}
