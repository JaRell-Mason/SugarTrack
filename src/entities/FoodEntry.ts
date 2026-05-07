import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Child } from './Child.js';

@Entity()
export class FoodEntry {
  @PrimaryColumn()
  entryId: string;

  @BeforeInsert()
  generateId(): void {
    this.entryId = uuidv7();
  }

  @Column()
  foodItem: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  unit: string; // grams, ml, servings, pieces, etc.

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  recordedAt: Date;

  @ManyToOne(() => Child, 'foodEnteries', { nullable: false })
  @JoinColumn()
  child!: any;
}
