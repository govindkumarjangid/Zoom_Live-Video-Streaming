import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import connectDB from './configs/connectDB.js';
import { initilizeSocketServer } from './configs/connectSocket.js';
import UserRouter from './routes/user.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = initilizeSocketServer(httpServer);

connectDB();

app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ limit: '100kb', extended: true }));


app.get('/', (req, res) => {
    res.send('Welcome to the Live Video Streaming API');
});

app.use('/api/v1/users', UserRouter);



const PORT = process.env.PORT || 5000;

const startServer = () => {
    try {
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}....`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
}

startServer();
