import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { logWithColor } from '../utils/default';
import { isDev } from './env';
import { services } from '../src/services';
// import { repositories } from '../src/repositories';
import { getConnectionSettings } from './connection';

const logSettings = ({ server, morgan }: { [key: string]: any }): void => {
    const boundaryLine = '----------------------------------------';
    console.log(chalk.green(boundaryLine));
    Object.keys(server).forEach((settingKey: string) => {
        if (settingKey === 'httpsOptions') {
            return;
        }
        const settingValue = server[settingKey];
        logWithColor(settingKey, settingValue);
    });
    logWithColor('morgan', morgan);
    console.log(chalk.green(boundaryLine));
};

export const getSettings = (rootDir: string): { [key: string]: any } => {
    const httpsOptions = {
        key: fs.readFileSync(path.resolve(rootDir, '../ssl/key.pem'), 'utf-8'),
        cert: fs.readFileSync(path.resolve(rootDir, '../ssl/certificate.pem'), 'utf-8'),
        passphrase: process.env.PASSPHRASE,
    };

    const settings = {
        server: {
            rootDir,
            mount: {
                '/rest': `${rootDir}/controllers/**/**.ts`,
            },
            componentsScan: [
                ...services,
                //...repositories
            ],
            port: process.env.PORT,
            httpPort: true,
            acceptMimes: ['application/json'],
            env: process.env.NODE_ENV,
        },
        connection: getConnectionSettings(rootDir),
        morgan: process.env.MORGAN_CONFIG,
    } as { [key: string]: any };

    // On prod env put nginx in front of the server for secure connections. In case of HTTP/2 on app level
    // production env should start a https connection too. However nginx level HTTP/2 support is recommended
    if (isDev()) {
        settings.server.httpsOptions = httpsOptions;
        settings.server.httpsPort = process.env.HTTPS_PORT;
        settings.server.httpPort = false;
    }

    logSettings(settings);
    return settings;
};
