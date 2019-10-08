const paths = require('./paths');
const fs = require('fs');

const isDev = () => process.env.NODE_ENV === "development";
const isProd = () => process.env.NODE_ENV === "production";

const registerDotEnvFiles = () => {
    const dotenvFiles = [].filter(Boolean);

    if (isDev()) {
        dotenvFiles.push(paths.dotenv.dev);
    } else if (isProd()) {
        dotenvFiles.push(paths.dotenv.prod);
    }

    dotenvFiles.forEach((dotenvFile) => {
        if (fs.existsSync(dotenvFile)) {
            require('dotenv').config({
                path: dotenvFile,
            });
        }
    });
};

module.exports = {
    registerDotEnvFiles,
    isDev,
    isProd
};
