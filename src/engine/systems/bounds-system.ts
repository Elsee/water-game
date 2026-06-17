import type { BaseEntity } from '../entities/base-entity';

export type BoundsMode = 'clamp' | 'wrap' | 'bounce' | 'destroy';

export interface BoundsConfig {
  mode: BoundsMode;
  width: number;
  height: number;
}

export class BoundsSystem {
  constructor(private config: BoundsConfig) {}

  update(entities: BaseEntity[]): void {
    for (const entity of entities) {
      this.handleBounds(entity);
    }
  }

  private handleBounds(entity: BaseEntity): void {
    switch (this.config.mode) {
      case 'clamp':
        this.clamp(entity);
        break;
      case 'wrap':
        this.wrap(entity);
        break;
      case 'bounce':
        this.bounce(entity);
        break;
      case 'destroy':
        this.destroyIfOutOfBounds(entity);
        break;
    }
  }

  private clamp(entity: BaseEntity): void {
    entity.x = Math.max(0, Math.min(entity.x, this.config.width - entity.width));
    entity.y = Math.max(0, Math.min(entity.y, this.config.height - entity.height));
  }

  private wrap(entity: BaseEntity): void {
    if (entity.x + entity.width < 0) entity.x = this.config.width;
    if (entity.x > this.config.width) entity.x = -entity.width;
    if (entity.y + entity.height < 0) entity.y = this.config.height;
    if (entity.y > this.config.height) entity.y = -entity.height;
  }

  private bounce(entity: BaseEntity): void {
    if (entity.x <= 0 || entity.x + entity.width >= this.config.width) {
      entity.velocity.x *= -1;
      entity.x = Math.max(0, Math.min(entity.x, this.config.width - entity.width));
    }
    if (entity.y <= 0 || entity.y + entity.height >= this.config.height) {
      entity.velocity.y *= -1;
      entity.y = Math.max(0, Math.min(entity.y, this.config.height - entity.height));
    }
  }

  private destroyIfOutOfBounds(entity: BaseEntity): void {
    if (
      entity.x + entity.width < 0 ||
      entity.x > this.config.width ||
      entity.y + entity.height < 0 ||
      entity.y > this.config.height
    ) {
      entity.destroy();
    }
  }
}
