import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuid } from "uuid";

interface Client {
    id: string;
    ws: WebSocket;
    vcId: string;
    x?: number;
    y?: number;
}

const clients: Record<string, Client> = {};

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", (ws) => {
    const id = uuid();
    clients[id] = { id, ws, vcId: "" };

    ws.on("message", (msg) => {
        const data = JSON.parse(msg.toString());
        if (data.type === "join") {
            clients[id].vcId = data.vcId;
            broadcastUserList(data.vcId);
        } else if (data.type === "position") {
            clients[id].x = data.x;
            clients[id].y = data.y;
            broadcastUserList(clients[id].vcId);
        } else if (data.type === "signal") {
            const targetId = data.id;
            if (clients[targetId]) clients[targetId].ws.send(JSON.stringify({ type: "signal", id, signal: data.signal }));
        }
    });

    ws.on("close", () => {
        delete clients[id];
        broadcastUserList("");
    });
});

function broadcastUserList(vcId: string) {
    const users = Object.values(clients)
        .filter(c => c.vcId === vcId)
        .map(c => ({ id: c.id, x: c.x || 0, y: c.y || 0 }));

    Object.values(clients)
        .filter(c => c.vcId === vcId)
        .forEach(c => c.ws.send(JSON.stringify({ type: "user-list", users })));
}

console.log("[ProximityVC Server] Running on ws://localhost:3000");
