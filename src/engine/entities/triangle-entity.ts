import { BaseEntity, type EntityConfig } from './base-entity';

export class TriangleEntity extends BaseEntity {
  constructor(config: Omit<EntityConfig, 'shape'>) {
    super({ ...config, shape: 'triangle' });
  }
}
