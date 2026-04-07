import { jsxs } from "react/jsx-runtime";
import { initilizeSocketServer } from "../configs/connectSocket.js";

const io = initilizeSocketServer();
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
        for (let id of connections[path]) {
            if (id !== socket.id) {
                io.to(id).emit('user-joined', socket.id);
            }
        }
        if (messages[path] !== undefined) {
            for (let message of messages[path]) {
                io.to(socket.id).emait('chat-message', messages[path][message]['data'],
                    messages[path][message]['sender'], messages[path][message]['socket-id-sender']
                );
            }
        }

    });

    socket.on('signal', (toId, message) => {
        io.to(toId).emit('signal', socket.id, message);
    });

    socket.on('chat-message', (data, sender) => {
        const [matchingRoom, found] = Object.entries(connections)
            .reduce(([room, isFound], [roomKey, roomValue]) => {
                if (!isFound && roomValue.includes(socket.id)) {
                    return [roomKey, true];
                }
                return [room, isFound];

            }, ['', false]);

        if (found === true) {
            if (messages[matchingRoom] === undefined) {
                messages[matchingRoom] = [];
            }
            messages[matchingRoom].push({
                "sender": sender,
                "data": data,
                "socket-id-sender": socket.id
            });

            console.log('message', key, ":", sender, data);

            connections[matchingRoom].forEach(id => {
                io.to(id).emit('chat-message', data, sender, socket.id);
            });
        }
    });

    socket.on('disconnect', () => {

        var diffTime = Math.abs(timeOnline[socket.id] - new Date());

        var key;

        for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
            for (let id of v) {
                if (value[id] === socket.id) {
                    key = k;

                    for (let id of connections[key]) {
                        io.to(connections[key][id]).emit('user-left', socket.id);
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