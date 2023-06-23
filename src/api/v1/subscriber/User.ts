// Typeorm
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
// Entities
import User from '../entity/User';
import Balance from '../entity/Balance';
// Constants, Helpers & Types
import { openingBalance } from '../constants';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }
  async afterInsert(event: InsertEvent<User>) {
    const user = event.entity as User;
     // add initial balance on account creation
     const balance = new Balance({ createdBy: { id: user.id }, amount: openingBalance });
     await event.manager.save(balance);
     user.balance = balance;}
}
