import * as fs from 'fs';
import * as path from 'path';
import moment from 'moment';
import chalk from 'chalk';
import { firstLetterUpperCase } from '../utils/default';

const logWithColor = (key, value): void => {
    const colorDefaultLog = chalk.green;
    const colorBold = chalk.bold;
    const timeStamp = moment().format('YYYY-MM-DDTHH:MM:SS.SSS');

    const keyLogMessage = colorBold(firstLetterUpperCase(key));
    const valueLogMessage = JSON.stringify(value);

    const defaultLogMessage = colorDefaultLog(`[${timeStamp}] [INFO ] [ULOG] -`);
    console.log(`${defaultLogMessage} ${keyLogMessage} ${valueLogMessage}`);
};

const logSettings = ({ server }: { [key: string]: any }): void => {
    const boundaryLine = '----------------------------------------';
    console.log(chalk.green(boundaryLine));
    Object.keys(server).forEach((settingKey: string) => {
        if (settingKey === 'httpsOptions') {
            return;
        }
        const settingValue = server[settingKey];
        logWithColor(settingKey, settingValue);
    });
    console.log(chalk.green(boundaryLine));
};

export const getSettings = (rootDir: string): { [key: string]: any } => {
    const settings = {
        server: {
            rootDir,
            mount: {
                '/rest': `${rootDir}/controllers/**/**.ts`,
            },
            port: process.env.PORT,
            acceptMimes: ['application/json'],
            env: process.env.NODE_ENV,
            httpPort: false,
            httpsPort: process.env.HTTPS_PORT,
            httpsOptions: {
                key: fs.readFileSync(path.resolve(rootDir, '../ssl/key.pem'), 'utf-8'),
                cert: fs.readFileSync(path.resolve(rootDir, '../ssl/certificate.pem'), 'utf-8'),
                passphrase: process.env.PASSPHRASE,
            },
        },
        morgan: process.env.MORGAN_CONFIG,
    };
    logSettings(settings);
    return settings;
};
