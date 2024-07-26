const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

// Serve the static files from the React app

app.use(express.static(path.join(__dirname, 'client/build')));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('callUser', ({ userToCall, signalData, from, name, id }) => {
        io.to(userToCall).emit('callUser', { signal: signalData, from, name, id });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });

    socket.on('endCall', ({ id }) => {
        io.to(id).emit('callEnded');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Handles any requests that don't match the above routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
