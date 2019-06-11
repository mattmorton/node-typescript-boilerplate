import { transports, LoggerOptions, format, createLogger } from 'winston';
import * as expressWinston from 'express-winston';

const { combine, timestamp, json, colorize } = format;

const consoleTransport: transports.ConsoleTransportInstance = new transports.Console();

const options: LoggerOptions = {
  level: 'debug',
  format: combine(
    json(),
    colorize(),
    timestamp(),
  ),
  transports: [
    consoleTransport,
  ],
};

export const logger = createLogger(options);

const expressOptions: expressWinston.LoggerOptions = {
  winstonInstance: logger
}

export const loggerMiddleware = expressWinston.logger(expressOptions);