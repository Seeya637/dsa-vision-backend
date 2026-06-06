import dotenv from 'dotenv';
dotenv.config();
import dns from 'node:dns/promises';
dns.setServers(["1.1.1.1","8.8.8.8"]);
import express    from 'express';
import cors       from 'cors';
import { createServer } from 'http';          
import { Server }       from 'socket.io';
import connectDB  from './src/database/db.js';
import shareRoutes from './src/routes/share.js';
import { initSocket } from './src/socket/algoSocket.js'; 
import mongoose from 'mongoose';
import authRoutes from './src/routes/auth.js';
import { sortAPI } from './src/controllers/apiController.js';
import { chatWithSensei } from './src/controllers/aiController.js';

const app = express();
const httpServer = createServer(app);          
const io = new Server(httpServer, {   
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }
});


// Middleware
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/share', shareRoutes);
app.use('/api/auth',authRoutes);
// AI Chat Bot End-point (Public Route)
app.post('/api/ai/chat', chatWithSensei);

app.post('/api/sort/bubble', sortAPI); 

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'DSA Vision API running!' });
});
initSocket(io); 
// Connect DB then start server
connectDB().then(() => {
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});