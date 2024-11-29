const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    const io = new Server(server, {
        cors: {
            origin: '*', // Update this with your client URL in production
        },
    });

    // Socket.IO events
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join-lobby', (lobbyCode) => {
            socket.join(lobbyCode);
            console.log(`User joined lobby: ${lobbyCode}`);
            io.to(lobbyCode).emit('lobby-update', `${socket.id} joined the lobby.`);
        });

        socket.on('send-message', ({ lobbyCode, message }) => {
            io.to(lobbyCode).emit('receive-message', message);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
