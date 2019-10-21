import { Controller, Get } from '@tsed/common';

@Controller('/user')
export class UsersController {
    @Get()
    findOne(): string {
        return 'This action returns the user';
    }
}
