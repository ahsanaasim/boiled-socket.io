import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: __dirname });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.use(async (socket, next) => {
  try {
    if (socket.handshake.auth.token == 'aa') {
      next();
    } else {
      const err = new Error('unauthorized');
      next(err);
    }
  } catch (e) {
    next(new Error('unauthorized'));
  }
});

const sessionsNamespace = io.of("/sessions");
sessionsNamespace.on('connection', (socket) => {
  socket.join('room_' + socket.handshake.auth.room);
  console.log(socket.rooms);
  
  sessionsNamespace.to('room_' + socket.handshake.auth.room).emit('connect_msg', { test: 'test', room: socket.handshake.auth.room });
});

httpServer.listen(3000);
