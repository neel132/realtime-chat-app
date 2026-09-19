const http = require("http");

const WebSocket = require("ws");

const app = require("./app");

const setupWebSocket = require("./src/websocket/chat.socket");

const PORT = 3000;

const server = http.createServer(app);

const wss = new WebSocket.Server({
    server: server
});
setupWebSocket(wss);

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})