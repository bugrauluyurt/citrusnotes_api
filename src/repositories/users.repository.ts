/* eslint-disable @typescript-eslint/no-empty-function */
import { Service } from '@tsed/di';
import { Connection } from 'typeorm';
import { AfterRoutesInit } from '@tsed/common';
import { TypeORMService } from '@tsed/typeorm';
import { ConnectionBuilder } from '../../config/connection';

@Service()
export class UsersRepository implements AfterRoutesInit {
    private connection: Connection;

    constructor(private typeORMService: TypeORMService) {}

    $afterRoutesInit(): void {
        this.connection = this.typeORMService.get(ConnectionBuilder.DB_NAME_POSTGRES)!; // get connection by name
    }

    getConnection(): Connection {
        return this.connection;
    }
}
