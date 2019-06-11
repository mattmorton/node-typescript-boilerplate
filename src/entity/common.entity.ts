import {
  AfterUpdate,
  AfterRemove,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { validateEntity } from '../util/validator'

@Entity()
export abstract class Common {
  
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  deleted?: boolean;
  updated?: boolean;

  @BeforeInsert()
  async validateInsert() {
    await validateEntity(this)
  }

  @BeforeUpdate()
  async validateUpdate() {
    await validateEntity(this)
  }

  @AfterUpdate()
  setUpdatedProperty() {
    this.updated = true;
  }

  @AfterRemove()
  setDeletedProperty() {
    this.deleted = true;
  }

}
