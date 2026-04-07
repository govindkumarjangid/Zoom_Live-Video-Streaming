import { Server } from "socket.io";

export const initilizeSocketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        },
    });

    return io;
}