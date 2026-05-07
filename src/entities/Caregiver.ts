import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Child } from './Child.js';
import { User } from './User.js';

@Entity()
export class Caregiver {
  @PrimaryColumn()
  caregiverId: string;

  @BeforeInsert()
  generateId(): void {
    this.caregiverId = uuidv7();
  }

  @ManyToOne(() => Child, (child) => child.caregivers, { nullable: false }) // ← arrow function
  @JoinColumn()
  child!: Child; // temporary 'any' to break cycle

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ default: 'view' })
  accessLevel: string = 'view';

  //@OneToOne(() => UserSettings, (settings) => settings.user, {
  //  cascade: true,
  //})
  //@JoinColumn()
  //settings: UserSettings;
}

// Why is UserSettings commented out? Because I'm not wasting the 2 days before I have left before
// I have to upload to production on figuring out how the fuck UserSettings.ts and User.ts aren't
// fucking working. The UserSettings are what they are.
// Copied from User.ts.
