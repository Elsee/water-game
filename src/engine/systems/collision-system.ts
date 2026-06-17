import type { BaseEntity } from '../entities/base-entity';
import type { EventBus } from '../core/event-bus';

interface CollisionEvent {
  entity1: string;
  entity2: string;
}

export class CollisionSystem {
  constructor(private eventBus: EventBus) {}

  update(entities: BaseEntity[]): void {
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const a = entities[i];
        const b = entities[j];

        if (this.checkCollision(a, b)) {
          this.eventBus.emit<CollisionEvent>('collision', {
            entity1: a.id,
            entity2: b.id,
          });
        }
      }
    }
  }

  private checkCollision(a: BaseEntity, b: BaseEntity): boolean {
    // AABB collision detection for all shapes (using bounding boxes)
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  checkCircleCollision(
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number }
  ): boolean {
    // Circle collision (using width as diameter)
    const dx = (a.x + a.width / 2) - (b.x + b.width / 2);
    const dy = (a.y + a.height / 2) - (b.y + b.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = a.width / 2 + b.width / 2;
    return distance < minDistance;
  }
}
