import * as _ from 'lodash';
import { isDev } from './env';

export class ConnectionPaths {
    entities: string[] = [];
    migrations: string[] = [];
    subscribers: string[] = [];
}

export class ConnectionBuilder {
    static readonly DB_TYPE_POSTGRES: string = 'postgres';
    static readonly DB_TYPE_MONGODB: string = 'mongodb';

    private readonly name: string;
    private readonly type: string;
    private readonly rootPath: string;

    private connectionPaths: ConnectionPaths = new ConnectionPaths();

    constructor(rootPath: string, name: string, type: string) {
        this.rootPath = rootPath;
        this.name = name;
        this.type = type;
        this.init();
    }
    private init(): void {
        _.map(_.keys(this.connectionPaths), (connectionAssetType: string) => {
            this.setConnectionFolder(connectionAssetType);
        });
    }
    getConnectionPaths(): ConnectionPaths {
        return this.connectionPaths;
    }
    getDBTypeBasedSetting(): object {
        switch (this.type) {
            case ConnectionBuilder.DB_TYPE_POSTGRES:
                const setting = {
                    host: isDev() ? 'localhost' : process.env.PG_HOST,
                    port: process.env.PG_PORT,
                    username: process.env.PG_USERNAME,
                    password: process.env.PG_PASSWORD,
                    database: process.env.PG_DATABASE,
                    synchronize: true,
                    logging: false,
                    ...this.getConnectionPaths(),
                };
                if (_.isEmpty(setting.username)) {
                    delete setting.username;
                }
                if (_.isEmpty(setting.password)) {
                    delete setting.password;
                }
                return setting;
            case ConnectionBuilder.DB_TYPE_MONGODB:
                return {};
        }
        return {};
    }
    getSetting(): object {
        return {
            name: this.name,
            type: this.type,
            ...this.getDBTypeBasedSetting(),
        };
    }
    setConnectionFolder(connectionAssetType: string, folderName?: string): void {
        const constructedPath = `${this.rootPath}/${folderName || connectionAssetType}/*{.ts,.js}`;
        this.connectionPaths[connectionAssetType] = [constructedPath];
    }
    addConnectionPath(connectionAssetType: string, path: string): void {
        this.connectionPaths[connectionAssetType].push(path);
    }
}

export const getConnectionSettings = (serverRoot: string): { [key: string]: any } => {
    const pg = new ConnectionBuilder(serverRoot, 'default', 'postgres');
    pg.setConnectionFolder('entities', 'models');
    return {
        typeorm: [pg.getSetting()],
    };
};
