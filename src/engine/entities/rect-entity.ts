import { BaseEntity, type EntityConfig } from './base-entity';

export class RectEntity extends BaseEntity {
  constructor(config: Omit<EntityConfig, 'shape'>) {
    super({ ...config, shape: 'rect' });
  }
}
