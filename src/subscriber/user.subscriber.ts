import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent } from 'typeorm';
import { User } from '../entity/user.entity';
import { sendWelcomeEmail, sendFarewellEmail } from '../util/mailer';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {

  listenTo() {
    return User;
  }

  afterInsert(event: InsertEvent<User>) {
    sendWelcomeEmail(event.entity.email);
  }

  afterRemove(event: RemoveEvent<User>) {
    sendFarewellEmail(event.entity.email);
  }

}
