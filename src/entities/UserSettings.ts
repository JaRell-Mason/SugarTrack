import { BeforeInsert, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from './User.js';

@Entity()
export class UserSettings {
  @PrimaryColumn()
  userSettingsId: string;

  @BeforeInsert()
  generateId(): void {
    this.userSettingsId = uuidv7();
  }

  @Column({ default: 'light' })
  theme: string;

  @Column({ default: true })
  notificationsEnabled: boolean;

  @OneToOne(() => User, (user) => user.settings)
  user: User;
}
