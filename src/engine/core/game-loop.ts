const FIXED_TIMESTEP = 1000 / 60; // 60 updates per second

export type UpdateCallback = (dt: number) => void;
export type RenderCallback = (interpolation: number) => void;

export class GameLoop {
  private rafId: number = 0;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private running: boolean = false;

  constructor(
    private onUpdate: UpdateCallback,
    private onRender: RenderCallback
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  isRunning(): boolean {
    return this.running;
  }

  private tick = (currentTime: number): void => {
    if (!this.running) return;

    const frameTime = Math.min(currentTime - this.lastTime, 250); // cap to avoid spiral of death
    this.lastTime = currentTime;
    this.accumulator += frameTime;

    while (this.accumulator >= FIXED_TIMESTEP) {
      this.onUpdate(FIXED_TIMESTEP / 1000); // pass dt in seconds
      this.accumulator -= FIXED_TIMESTEP;
    }

    this.onRender(this.accumulator / FIXED_TIMESTEP);
    this.rafId = requestAnimationFrame(this.tick);
  };
}
