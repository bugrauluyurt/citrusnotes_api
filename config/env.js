const paths = require('./paths');
const fs = require('fs');

const registerDotEnvFiles = () => {
    const dotenvFiles = [
        `${paths.dotenv}.${process.env.NODE_ENV}.local`,
        `${paths.dotenv}.${process.env.NODE_ENV}`,
        process.env.NODE_ENV !== 'test' && `${paths.dotenv}.local`,
        paths.dotenv,
    ].filter(Boolean);

    dotenvFiles.forEach((dotenvFile) => {
        if (fs.existsSync(dotenvFile)) {
            require('dotenv').config({
                path: dotenvFile,
            });
        }
    });
};

module.exports = {
    registerDotEnvFiles
};
