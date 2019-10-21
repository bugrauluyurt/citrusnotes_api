import * as _ from 'lodash';
import { isDev } from './env';

export class ConnectionPaths {
    entities: string[] = [];
    migrations: string[] = [];
    subscribers: string[] = [];
}

export class ConnectionBuilder {
    static readonly DB_TYPE_POSTGRES: string = 'postgres';
    static readonly DB_TYPE_MONGO: string = 'mongodb';

    // DB_NAMES
    static readonly DB_NAME_POSTGRES: string = 'dbPostgres';
    static readonly DB_NAME_MONGO: string = 'dbMongo';
    static readonly DB_NAME_SEED_POSTGRES: string = 'seed';

    private readonly name: string;
    private readonly type: string;
    private readonly rootPath: string;

    private connectionFolders: ConnectionPaths = new ConnectionPaths();
    private additionalSettings: object = {};

    constructor(rootPath: string, name: string, type: string) {
        this.rootPath = rootPath;
        this.name = name;
        this.type = type;
        this.init();
    }
    private init(): void {
        _.map(_.keys(this.connectionFolders), (connectionAssetType: string) => {
            this.setConnectionFolder(connectionAssetType);
        });
    }
    static getConstructedPath(rootDir: string, subDir: string): string {
        return `${rootDir}/${subDir}/*{.ts,.js}`;
    }
    getConnectionFolders(): ConnectionPaths {
        return this.connectionFolders;
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
                    ...this.getConnectionFolders(),
                };
                if (_.isEmpty(setting.username)) {
                    delete setting.username;
                }
                if (_.isEmpty(setting.password)) {
                    delete setting.password;
                }
                return setting;
            case ConnectionBuilder.DB_TYPE_MONGO:
                return {};
        }
        return {};
    }
    private getAdditionalSettings(): object {
        return this.additionalSettings;
    }
    getSetting(): object {
        return {
            name: this.name,
            type: this.type,
            ...this.getDBTypeBasedSetting(),
            ...this.getAdditionalSettings(),
        };
    }
    setConnectionFolder(connectionAssetType: string, folderName?: string): ConnectionBuilder {
        const folder = folderName || (connectionAssetType === 'entities' ? 'models' : connectionAssetType);
        const constructedPath = ConnectionBuilder.getConstructedPath(this.rootPath, folder);
        this.connectionFolders[connectionAssetType] = [constructedPath];
        return this;
    }
    setAdditionalSettings(settingKey: any, settingValue: any): void {
        this.additionalSettings[settingKey] = settingValue;
    }
    addConnectionPath(connectionAssetType: string, path: string): ConnectionBuilder {
        this.connectionFolders[connectionAssetType].push(path);
        return this;
    }
}

export const getSeedConnectionSettings = (serverRoot: string): { [key: string]: any } | undefined => {
    if (!isDev()) {
        return undefined;
    }
    const pgSeed = new ConnectionBuilder(
        serverRoot,
        ConnectionBuilder.DB_NAME_SEED_POSTGRES,
        ConnectionBuilder.DB_TYPE_POSTGRES,
    );
    pgSeed.setConnectionFolder('migrations', 'seeds');
    pgSeed.setAdditionalSettings('cli', { migrationsDir: ConnectionBuilder.getConstructedPath(serverRoot, 'seeds') });
    return pgSeed.getSetting();
};

export const getConnectionSettings = (serverRoot: string): { [key: string]: any } => {
    const pg = new ConnectionBuilder(
        serverRoot,
        ConnectionBuilder.DB_NAME_POSTGRES,
        ConnectionBuilder.DB_TYPE_POSTGRES,
    );
    return {
        typeorm: [pg.getSetting(), getSeedConnectionSettings(serverRoot)].filter(setting => !_.isUndefined(setting)),
    };
};
