import { BaseEntity, type EntityConfig } from './base-entity';

export class CircleEntity extends BaseEntity {
  constructor(config: Omit<EntityConfig, 'shape'>) {
    super({ ...config, shape: 'circle' });
  }

  get radius(): number {
    return this.width / 2;
  }
}
