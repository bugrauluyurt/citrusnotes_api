import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';
import { registerDotEnvFiles } from '../config/env';
import '@tsed/typeorm'; // import typeorm ts.ed module
import { getSettings } from '../config/settings';
import { $log } from 'ts-log-debug';
import * as path from 'path';

const rootDir = path.resolve(__dirname);
registerDotEnvFiles();

const { server: serverSettings } = getSettings(rootDir);

@ServerSettings(serverSettings)
export class Server extends ServerLoader {
    /**
     * This method let you configure the express middleware required by your application to works.
     * @returns {Server}
     */
    public $beforeRoutesInit(): void | Promise<any> {
        /*eslint-disable */
        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override'),
            rfs = require('rotating-file-stream'),
            morgan = require('morgan');
        /*eslint-enable */

        // create a rotating write stream for logging
        const accessLogStream = rfs('access.log', {
            interval: '1d', // rotate daily
            path: path.resolve(__dirname, '../logs'),
        });

        this.use(morgan('common', { stream: accessLogStream }))
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(
                bodyParser.urlencoded({
                    extended: true,
                }),
            );
    }

    $onReady() {
        $log.debug('Server initialized');
    }

    $onServerInitError(error): any {
        $log.error('Server encounter an error =>', error);
    }
}
