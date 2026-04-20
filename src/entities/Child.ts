import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
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

  @Column()
  parentId: string;
}
