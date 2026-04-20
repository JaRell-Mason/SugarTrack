import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Child } from './Child.js';

@Entity()
export class User {
  @PrimaryColumn()
  userId: string;

  @BeforeInsert()
  generateId(): void {
    this.userId = uuidv7();
  }

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @OneToMany(() => Child, (child) => child.parent)
  children: Child[];
}
