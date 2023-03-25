import { Namespace, Server, Socket as IOSocket } from 'socket.io';

export class Socket {
  io: Server;

  constructor(httpServer: any) {
    this.io = new Server(httpServer, {
      /* options */
    });

    this.init();
  }

  private init = () => {
    this.io.use(async (socket, next) => {
      try {
        if (socket.handshake.auth.token === 'aa') {
          next();
        } else {
          const err = new Error('unauthorized');
          next(err);
        }
      } catch (e) {
        next(new Error('unauthorized'));
      }
    });
  };

  public createNamespace = (spaceName: string): Namespace => {
    return this.io.of('/' + spaceName);
  };

  public onConnect = (space: Namespace, cb: (socket: IOSocket) => void) => {
    space.on('connection', (socket: IOSocket) => {
      cb(socket);
    });
  };

  public joinRoom = (name: string, socket: IOSocket) => {
    socket.join('room_' + name);
  };

  public emitToRoomInSpace = (space: Namespace, room: string, data: any) => {
    space.to(room).emit('connect_msg', data);
  };

  public emitToSpace = (space: Namespace, data: any) => {
    space.emit('connect_msg', data);
  };
}
