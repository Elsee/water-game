import type { BaseEntity } from '../entities/base-entity';

export class World {
  private entities: Map<string, BaseEntity> = new Map();

  addEntity(entity: BaseEntity): void {
    this.entities.set(entity.id, entity);
  }

  removeEntity(id: string): void {
    this.entities.delete(id);
  }

  getEntity(id: string): BaseEntity | undefined {
    return this.entities.get(id);
  }

  getAllEntities(): BaseEntity[] {
    return Array.from(this.entities.values());
  }

  getByTag(tag: string): BaseEntity[] {
    return Array.from(this.entities.values()).filter((entity) =>
      entity.hasTag(tag)
    );
  }

  cleanup(): void {
    for (const entity of this.entities.values()) {
      if (!entity.isAlive) {
        this.entities.delete(entity.id);
      }
    }
  }

  clear(): void {
    this.entities.clear();
  }

  get count(): number {
    return this.entities.size;
  }
}
