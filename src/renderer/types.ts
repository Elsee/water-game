import type { BaseEntity } from '../engine/entities/base-entity';

export interface GameRenderer {
  init(container: HTMLElement, width: number, height: number): void;
  render(entities: BaseEntity[]): void;
  resize(width: number, height: number): void;
  destroy(): void;
}
