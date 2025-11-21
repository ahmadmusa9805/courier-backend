// src/utils/logger.ts
import winston from 'winston';
import 'winston-daily-rotate-file'; // Import to register the transport
import path from 'path';

// Define custom log levels and colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// const colors = {
//   error: 'red',
//   warn: 'yellow',
//   info: 'green',
//   http: 'magenta',
//   debug: 'white',
// };
// winston.addColors(colors);

// Define the root directory for all logs
// __dirname will be 'src/utils' after compilation, so '..' takes it to 'src', then '..' to project root
const rootLogDirectory = path.join(__dirname, '..', '..', 'logs');

// Define a reusable format for file logs
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json() // JSON format for easy parsing
);

// Define a reusable format for console logs
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }), // Apply colors based on level
  winston.format.simple() // Simple format for console
);

// Create the Winston logger instance
const logger = winston.createLogger({
  levels, // Use custom levels
  format: fileFormat, // Default format for file transports
  transports: [
    // Console Transport (for development visibility)
    new winston.transports.Console({
      level: 'debug', // Show all levels in console
      format: consoleFormat,
    }),

    // Daily Rotate File Transport for HTTP/Access logs
    new winston.transports.DailyRotateFile({
      level: 'http', // Log 'http' level and above to this file
      dirname: rootLogDirectory,
      filename: 'access-%DATE%.log',
      datePattern: 'YYYY/MM/DD', // Crucial for folder structure
      zippedArchive: true, // Compress old log files
      maxSize: '20m',      // Max size of a log file before it rotates
      maxFiles: '14d',     // Delete logs older than 14 days
    }),

    // Daily Rotate File Transport for General application logs (info, warn, debug etc.)
    new winston.transports.DailyRotateFile({
      level: 'info', // Log 'info' level and above to this file
      dirname: rootLogDirectory,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY/MM/DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),

    // Daily Rotate File Transport for Error logs only
    new winston.transports.DailyRotateFile({
      level: 'error', // Log 'error' level only to this file
      dirname: rootLogDirectory,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY/MM/DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', // Keep error logs longer
    }),
  ],
  exceptionHandlers: [ // Catch uncaught exceptions
    new winston.transports.File({
      filename: path.join(rootLogDirectory, 'exceptions.log'),
      maxsize: 1048576, // 1MB
      maxFiles: 5
    }),
  ],
  rejectionHandlers: [ // Catch unhandled promise rejections
    new winston.transports.File({
      filename: path.join(rootLogDirectory, 'rejections.log'),
      maxsize: 1048576, // 1MB
      maxFiles: 5
    }),
  ],
  exitOnError: false, // Do not exit on handled exceptions, we handle process.on below
});

export default logger;