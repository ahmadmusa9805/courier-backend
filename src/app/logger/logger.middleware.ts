// src/middleware/loggerMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import logger from './winston.logger';
// import logger from '../utils/logger'; // Import the Winston logger

// This stream routes Morgan's output to Winston's 'http' level.
const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Morgan middleware for standard HTTP access logs
export const httpLogger = morgan('combined', { stream: morganStream });

// Custom middleware to attach the logger to the request object
export const attachLogger = (req: Request, res: Response, next: NextFunction) => {
  req.logger = logger; // Now req.logger is properly typed
  next();
};

// Middleware for detailed request/response logging (optional)
export const detailedLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime(); // High-resolution time

  // Log request details (method, URL, optionally body)
  req.logger.debug(`Request received: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    // Safely log body, avoid logging sensitive data directly in production
    // You might need 'body-parser' to parse req.body before this middleware
    body: req.body ? JSON.stringify(req.body).substring(0, 500) : undefined // Truncate body
  });

  // Wrap res.end to capture response details
  const oldEnd = res.end;
//   res.end = function (...args: any[]) {
//     const [diffSeconds, diffNanos] = process.hrtime(start);
//     const duration = (diffSeconds * 1e3 + diffNanos / 1e6).toFixed(3); // duration in ms

//     // Log response details (status, duration, optionally body)
//     req.logger.debug(`Response sent: ${req.method} ${req.originalUrl} - ${res.statusCode} in ${duration}ms`, {
//       method: req.method,
//       url: req.originalUrl,
//       status: res.statusCode,
//       duration: parseFloat(duration),
//     });

//     // oldEnd.apply(res, args);
//   };
  next();
};