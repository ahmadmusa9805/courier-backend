import { Server } from 'node:http';
import mongoose from 'mongoose';
import httpServer from './app.js';  // Import HTTP server from app.ts
import config from './app/config/index.js';
import seedSuperAdmin from './app/DB/index.js';
let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    // const port = config.port || 3000;  // Default to 3000 if undefined

    await seedSuperAdmin();
    server = httpServer.listen(config.port, () => {
      // server = app.listen(5000, () => {
      console.log(`application is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

// Handle server shutdown gracefully
main();

process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
