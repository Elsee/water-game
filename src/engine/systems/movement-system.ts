import type { BaseEntity } from '../entities/base-entity';

export class MovementSystem {
  update(entities: BaseEntity[], dt: number): void {
    for (const entity of entities) {
      entity.x += entity.velocity.x * dt;
      entity.y += entity.velocity.y * dt;
    }
  }
}
