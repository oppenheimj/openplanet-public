const { transports, createLogger, format } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(info => `${info.timestamp} [${info.level}]: ${info.message}`);

const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
    ),
    transports: [
        new transports.Console()
    ],
});

Object.assign(module.exports, { logger });