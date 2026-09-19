const WebSocket = require("ws");

const authService = require("../services/auth.service");
const chatService = require("../services/chat.service");

function setupWebSocket(wss) {
    wss.on("connection", (socket, request) => {
        const url = new URL(request.url, "http://localhost");
        const token = url.searchParams.get("token");
        if(!token) {
            socket.close(1000, "Authentication required");
            return;
        }
        let user;
        try {
            user = authService.verifyToken(token);
        } catch (error) {
            socket.close(1000, "Invalid token");
            return;
        }
        socket.user = user;
        console.log(`${user.name} connected`);
        socket.send(JSON.stringify({
            type: "connected",
            message: "Connected to chat",
            user: user
        }))

        broadcast({
            type: "user_online",
            user: {
                id: user.id,
                name: user.name
            }
        }, socket);

        socket.on("message", (data) => {
            handleMessage(socket, data, wss);
        });

        socket.on("close", () => {
            console.log(`${user.name} disconnected`)
            broadcast({
                type: "user_offline",
                user: {
                    id: user.id,
                    name: user.name,
                }
            }, socket);
        })
    })
}

function handleMessage(socket, data, wss) {
    try {
        const message = JSON.parse(data);
        if(message.type === "chat") {
            if(!message.text || !message.text.trim()) {
                return;
            }
            const chatMessage = chatService.createMessage(socket.user, message.text);

            broadcast({
                type: "chat",
                message: chatMessage,
            }, null, wss)
        }
        if(message.type === "typing") {
            broadcast({
                type: "typing",
                user: {
                    id: socket.user.id,
                    name: socket.user.name,
                }
            }, socket, wss);
        }
    } catch(error) {
        console.error("Websocket error", error.message);
    }
}

function broadcast(message, excludedSocket, wss) {
    const data = JSON.stringify(message);
    wss.clients.forEach(client => {
        if(client !== excludedSocket &&
            client.readyState === WebSocket.OPEN
        ) {
            client.send(data);
        }
    })
}

module.exports = setupWebSocket;