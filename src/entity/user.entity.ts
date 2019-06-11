import {
  BeforeInsert,
  Column,
  ColumnOptions,
  Entity
} from 'typeorm';
import { hashPassword } from '../util/encryption';
import { normalizeEmail } from '../util/utilities';
import { Common } from './common.entity';
import { IsEmail } from 'class-validator';


export enum IUserRole {
  USER = 'user',
  ADMIN_USER = 'admin',
  INACTIVE_USER = 'inactive'
}

@Entity()
export class User extends Common {

  @IsEmail()
  @Column(<ColumnOptions>{
    unique: true,
    nullable: false
  })
  email: string;

  @Column(<ColumnOptions>{ 
    nullable: false
  })
  password: string;

  @Column(<ColumnOptions>{
    type: 'enum',
    enum: IUserRole,
    default: IUserRole.INACTIVE_USER
  })
  role: IUserRole;

  @BeforeInsert()
  async hashNewPassword() {
    this.password = await hashPassword(this.password);
  }

  @BeforeInsert()
  normalizeEmail() {
    this.email = normalizeEmail(this.email);
  }

  public isUser() {
    return this.role === IUserRole.USER;
  }

  public isAdminUser() {
    return this.role === IUserRole.ADMIN_USER;
  }

  public isInactiveUser() {
    return this.role === IUserRole.INACTIVE_USER;
  }

}

