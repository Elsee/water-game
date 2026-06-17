import type { GameRenderer } from './types';
import type { BaseEntity } from '../engine/entities/base-entity';

export class Canvas2DRenderer implements GameRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private dpr: number = 1;

  init(container: HTMLElement, width: number, height: number): void {
    this.canvas = document.createElement('canvas');
    this.dpr = window.devicePixelRatio || 1;

    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.scale(this.dpr, this.dpr);
    }
  }

  render(entities: BaseEntity[]): void {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.width / this.dpr;
    const height = this.canvas.height / this.dpr;

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Render each entity
    for (const entity of entities) {
      this.ctx.fillStyle = entity.color;

      switch (entity.shape) {
        case 'rect':
          this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
          break;

        case 'circle':
          this.ctx.beginPath();
          this.ctx.arc(
            entity.x + entity.width / 2,
            entity.y + entity.height / 2,
            entity.width / 2,
            0,
            Math.PI * 2
          );
          this.ctx.fill();
          break;

        case 'triangle':
          this.ctx.beginPath();
          this.ctx.moveTo(entity.x + entity.width / 2, entity.y);
          this.ctx.lineTo(entity.x, entity.y + entity.height);
          this.ctx.lineTo(entity.x + entity.width, entity.y + entity.height);
          this.ctx.closePath();
          this.ctx.fill();
          break;
      }
    }
  }

  resize(width: number, height: number): void {
    if (!this.canvas || !this.ctx) return;

    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  destroy(): void {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }
}
