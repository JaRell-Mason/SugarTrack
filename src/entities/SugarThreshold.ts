import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Child } from './Child.js';

@Entity()
export class SugarThreshold {
  @PrimaryColumn('uuid')
  thresholdId!: string;

  @ManyToOne(() => Child, (child) => child.thresholds, { nullable: false })
  @JoinColumn()
  child!: any; // temporary 'any' to break cycle

  @Column('decimal', { precision: 6, scale: 2 })
  maxDailyGrams: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean = true;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
