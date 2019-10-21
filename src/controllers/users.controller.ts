import { Controller, Get } from '@tsed/common';

@Controller('/users')
export class UsersController {
    @Get()
    findOne(): string {
        return 'This action returns the user';
    }
}
