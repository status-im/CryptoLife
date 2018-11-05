const log4js = require('log4js');
const conf = require('./config');

module.exports = (name = 'default') => {
    let logger = log4js.getLogger(name);
    logger.level = conf.log.level;

    return logger;
};