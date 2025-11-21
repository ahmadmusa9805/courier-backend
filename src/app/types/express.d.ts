// src/types/express.d.ts
import winston from 'winston';

// Augment the Express Request interface
declare global {
  namespace Express {
    interface Request {
      logger: winston.Logger; // Adds a 'logger' property of type Winston Logger
      // You can add other custom properties here if needed, e.g., userId: string;
    }
  }
}