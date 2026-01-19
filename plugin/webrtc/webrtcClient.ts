import SimplePeer from "simple-peer";

let localStream: MediaStream;
let peers: Record<string, SimplePeer.Instance> = {};

export async function connectWebRTC(vcId: string, config: any, onUpdate: (users: any[]) => void) {
    // Get microphone
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const ws = new WebSocket(config.webrtcServerUrl);

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === "user-list") {
            onUpdate(data.users);
        } else if (data.type === "signal") {
            const peerId = data.id;
            if (!peers[peerId]) createPeer(peerId, false, ws);
            peers[peerId].signal(data.signal);
        }
    };

    // Add self to server
    ws.onopen = () => {
        ws.send(JSON.stringify({ type: "join", vcId }));
    };

    createPeer("self", true, ws);
}

function createPeer(id: string, initiator: boolean, ws: WebSocket) {
    const peer = new SimplePeer({ initiator, stream: localStream });
    peer.on("signal", signal => {
        ws.send(JSON.stringify({ type: "signal", id, signal }));
    });
    peer.on("stream", (stream: MediaStream) => {
        const audioEl = document.createElement("audio");
        audioEl.srcObject = stream;
        audioEl.autoplay = true;
        document.body.appendChild(audioEl);
    });
    peers[id] = peer;
}

export function sendPositionUpdate(position: any) {
    // Send to server: {id, x, y, muted}
}
