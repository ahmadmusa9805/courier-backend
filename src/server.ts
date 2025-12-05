// import { Server } from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import httpServer from './app.js';  // Import HTTP server from app.ts
import config from './app/config/index.js';
import seedSuperAdmin from './app/DB/index.js';
// import { createPaymentWithMollie } from './app/modules/mollie_payments/mollie.service.js';
// let server: Server;
import { initializeChatSocket } from './app/modules/Chat/chat.socket.js';
// let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    // const port = config.port || 3000;  // Default to 3000 if undefined

    await seedSuperAdmin();

    // Initialize Socket.IO
    const io = new Server(httpServer, {
      cors: {
          origin: "*", // Replace with frontend URL
        // origin: [
        //   'http://localhost:5173',
        //   'http://localhost:3000',
        //   'https://your-production-url.com',
        // ], // Ensure this is correct for Next.js frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      },
    });

    // Attach chat socket handlers
    initializeChatSocket(io);


    httpServer.listen(config.port, () => {
      // server = app.listen(5000, () => {
      console.log(`application is listening on port ${config.port}`);
      // createPaymentWithMollie()
    });
  } catch (err) {
    console.log(err);
  }
}

// Handle server shutdown gracefully
main();

process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (httpServer) {
    httpServer.close(() => {
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
