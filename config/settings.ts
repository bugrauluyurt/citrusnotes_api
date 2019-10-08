const path = require('path');
const rootDir = path.join(process.cwd(), '/../src');

export const getSettings = (): {[key: string]: any} => {
    const settings = {
        server: {
            rootDir,
            mount: {
                "/rest": `${rootDir}/controllers/**/**.js`
            },
            port: process.env.PORT,
            acceptMimes: ["application/json"],
            env: process.env.NODE_ENV,
            httpPort: false,
            httpsPort: process.env.HTTPS_PORT,
        },
        morgan: process.env.MORGAN_CONFIG
    };
    console.log("Settings: \n", settings);
    return settings;

};
