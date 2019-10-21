import { Service } from '@tsed/di';
import { User } from '../models/user.model';

@Service()
export class UsersService {
    create(): void {
        console.log('user created');
    }

    findAll(): User[] {
        return [];
    }
}
