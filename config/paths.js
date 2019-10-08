const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const paths = {
    dotenv: {
        dev: resolveApp('.env/dev.env'),
        prod: resolveApp('.env/prod.env')
    },
};

module.exports = paths;
