import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Child } from './Child.js';
import { UserSettings } from './UserSettings.js';

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

  @Column()
  displayName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedOn: Date;

  @OneToMany(() => Child, (child) => child.parent)
  children: Child[];

  @OneToOne(() => UserSettings, (settings) => settings.user)
  @JoinColumn()
  settings: UserSettings;
}
