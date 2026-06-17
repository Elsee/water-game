export type ShapeType = 'rect' | 'circle' | 'triangle';

export interface EntityConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  shape: ShapeType;
  velocity?: { x: number; y: number };
  tags?: string[];
}

export abstract class BaseEntity {
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: string;
  public shape: ShapeType;
  public velocity: { x: number; y: number };
  public tags: string[];
  public isAlive: boolean = true;

  constructor(config: EntityConfig) {
    this.id = crypto.randomUUID();
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.color = config.color;
    this.shape = config.shape;
    this.velocity = config.velocity ?? { x: 0, y: 0 };
    this.tags = config.tags ?? [];
  }

  hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  destroy(): void {
    this.isAlive = false;
  }

  update(_dt: number): void {
    // Override in subclasses for custom behavior
  }
}
