import { Column,
  ColumnOptions,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Common } from './common.entity';
import { User } from './user.entity';

@Entity()
export class ChangePassword extends Common {

  @Column(<ColumnOptions>{
    unique: true,
    nullable: false
  })
  token: string;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

}

