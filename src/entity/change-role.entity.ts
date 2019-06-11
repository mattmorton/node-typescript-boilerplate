import {
  Column,
  ColumnOptions,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Common } from './common.entity';
import { User, IUserRole } from './user.entity';
import { generateRandomToken } from '../util/encryption';

@Entity()
export class ChangeRole extends Common {

  @Column(<ColumnOptions>{
    unique: true,
    nullable: false
  })
  token: string;

  @Column(<ColumnOptions>{
    type: 'enum',
    enum: IUserRole
  })
  role: IUserRole;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;
  
  public async setUserRole(user: User) {
    this.token = await generateRandomToken();
    this.role = IUserRole.USER;
    this.user = user;
    return;
  }

  public async setAdminUserRole(user: User) {
    this.token = await generateRandomToken();
    this.role = IUserRole.ADMIN_USER;
    this.user = user;
    return;
  }

  public async setInactiveUserRole(user: User) {
    this.token = await generateRandomToken();
    this.role = IUserRole.INACTIVE_USER;
    this.user = user;
    return;
  }
}



