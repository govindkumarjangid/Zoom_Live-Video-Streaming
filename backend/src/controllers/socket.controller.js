


export const connectToSocket = (io) => {
    let connections = {};
    let messages = {};
    let timeOnline = {};

    io.on('connection', (socket) => {
        socket.on('join-call', (path) => {
        if (connections[path] === undefined) {
            connections[path] = [];
        }
        connections[path].push(socket.id);
        timeOnline[socket.id] = new Date();

        for (let a of connections[path]) {
            io.to(a).emit("user-joined", socket.id, connections[path]);
        }
        if (messages[path] !== undefined) {
            for (let message of messages[path]) {
                io.to(socket.id).emit('chat-message', message['data'],
                    message['sender'], message['socket-id-sender']
                );
            }
        }

    });

    socket.on('signal', (toId, message) => {
        io.to(toId).emit('signal', socket.id, message);
    });

    socket.on('chat-message', (data, sender) => {
        console.log("BACKEND RECIEVED chat-message: ", data, sender, socket.id);
        const [matchingRoom, found] = Object.entries(connections)
            .reduce(([room, isFound], [roomKey, roomValue]) => {
                if (!isFound && roomValue.includes(socket.id)) {
                    return [roomKey, true];
                }
                return [room, isFound];
            }, ['', false]);

        console.log("Room matching result: ", matchingRoom, found);

        if (found === true) {
            if (messages[matchingRoom] === undefined) {
                messages[matchingRoom] = [];
            }
            messages[matchingRoom].push({
                "sender": sender,
                "data": data,
                "socket-id-sender": socket.id
            });

            console.log('message:', matchingRoom, ":", sender, data);

            connections[matchingRoom].forEach(id => {
                io.to(id).emit('chat-message', data, sender, socket.id);
            });
        }
    });

    socket.on('disconnect', () => {
        var diffTime = Math.abs(timeOnline[socket.id] - new Date());

        var key;
        const entries = Object.entries(connections);

        for (const [k, v] of entries) {
            for (let id of v) {
                if (id === socket.id) {
                    key = k;

                    for (let connectedId of connections[key]) {
                        io.to(connectedId).emit('user-left', socket.id);
                    }

                    var index = connections[key].indexOf(socket.id);
                    connections[key].splice(index, 1);

                    if (connections[key].length === 0) {
                        delete connections[key];
                    }
                }
            }
        }

    });
    });
};
