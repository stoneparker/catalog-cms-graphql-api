import { User } from './dtos/models/user';

export class Storage {
  static users: User[] = [];

  static getUsers() { return Storage.users };
  static setUsers(users: User[]) { Storage.users = users };
}
