import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Caregiver } from './Caregiver.js';
import { FoodEntry } from './FoodEntry.js';
import { SugarThreshold } from './SugarThreshold.js';
import { User } from './User.js';

@Entity()
export class Child {
  @PrimaryColumn()
  childId: string;

  @BeforeInsert()
  generateId(): void {
    this.childId = uuidv7();
  }

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: User;

  @ManyToOne(() => Caregiver, (cg) => cg.child)
  caregivers: Caregiver[];

  @Column()
  parentId: string;

  @OneToMany(() => FoodEntry, (entry) => entry.child)
  foodEnteries: FoodEntry[];

  @OneToMany(() => SugarThreshold, (threshold) => threshold.child)
  thresholds: SugarThreshold[];
}
