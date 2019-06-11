import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { ChangeRole } from '../entity/change-role.entity';
import { sendVerifyUserEmail, sendVerifyAdminUserEmail } from '../util/mailer';
import { IUserRole } from '../entity/user.entity';

@EventSubscriber()
export class ChangeRoleSubscriber implements EntitySubscriberInterface<ChangeRole> {

  listenTo() {
    return ChangeRole;
  }

  afterInsert(event: InsertEvent<ChangeRole>) {
    switch (event.entity.role) {
      case IUserRole.USER:
        sendVerifyUserEmail(event.entity.user.email, event.entity.token)
        break;
      case IUserRole.ADMIN_USER:
        sendVerifyAdminUserEmail(event.entity.user.email, event.entity.token)
        break;
      default:
        console.log('no match')
    }
  }

}
