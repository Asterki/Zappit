import { io } from '../';

io.sockets.on('connection', (socket: any) => {
	console.log(socket);
});

export {};
