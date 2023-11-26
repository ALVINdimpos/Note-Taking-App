const { format, createLogger, transports } = require('winston');
const { timestamp, combine, printf, errors } = format;

// Constants for format options
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const logFormat = printf(({ level, message, stack, timestamp }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Function to check if the environment is development
const checkDev = () => {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev;
};

const logger = createLogger({
  format: combine(
    timestamp({ format: TIMESTAMP_FORMAT }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console transport with a conditional level (defaults to 'info' if not in development)
    new transports.Console({
      level: checkDev() ? 'debug' : 'info',
    }),
    new transports.File({ filename: 'logs/index.log' }),
  ],
});

module.exports = logger;
