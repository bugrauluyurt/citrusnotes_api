import chalk from 'chalk';
import moment from 'moment';

export const firstLetterUpperCase = (str: string): string => {
    const firstLetter = str.substring(0, 1).toUpperCase();
    const remainingLetters = str.substring(1, str.length);
    return `${firstLetter}${remainingLetters}`;
};

export const logWithColor = (key, value): void => {
    const colorDefaultLog = chalk.green;
    const colorBold = chalk.bold;
    const timeStamp = moment().format('YYYY-MM-DDTHH:MM:SS.SSS');

    const keyLogMessage = colorBold(firstLetterUpperCase(key));
    const valueLogMessage = JSON.stringify(value);

    const defaultLogMessage = colorDefaultLog(`[${timeStamp}] [INFO ] [ULOG] -`);
    console.log(`${defaultLogMessage} ${keyLogMessage} ${valueLogMessage}`);
};
