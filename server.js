const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});
const PORT = process.env.PORT || 5000;

app.use(cors());

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('callUser', ({ userToCall, signalData, from, name, id }) => {
        io.to(userToCall).emit('callUser', { from, name, signal: signalData, id });
    });

    socket.on('answerCall', ({ signal, to, id }) => {
        io.to(to).emit('callAccepted', signal);
    });

    socket.on('endCall', ({ id }) => {
        io.emit('callEnded', { id });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
