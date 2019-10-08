import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import { registerDotEnvFiles } from '../config/env';
import { getSettings } from "../config/settings";
import {$log} from "ts-log-debug";
import * as path from "path";
import * as fs from "fs";
registerDotEnvFiles();

const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, '../ssl/key.pem'), 'utf-8'),
    cert: fs.readFileSync(path.resolve(__dirname, '../ssl/certificate.pem'), 'utf-8'),
    passphrase:  process.env.PASSPHRASE
};
const settings = {
    ...getSettings().server,
    httpsOptions
};

@ServerSettings(settings)
export class Server extends ServerLoader {
  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void | Promise<any> {
    const cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      compress = require("compression"),
      methodOverride = require("method-override"),
      rfs = require('rotating-file-stream'),
      morgan = require("morgan");

    // create a rotating write stream for logging
    const accessLogStream = rfs('access.log', {
      interval: '1d', // rotate daily
      path: path.join(process.cwd(), '/../logs')
    });

    this
      .use(morgan('common', {stream: accessLogStream}))
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }

  $onReady() {
    $log.debug("Server initialized");
  }

  $onServerInitError(error): any {
    $log.error("Server encounter an error =>", error);
  }
}
