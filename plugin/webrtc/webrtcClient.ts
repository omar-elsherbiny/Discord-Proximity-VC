// Remove the import
// import SimplePeer from "simple-peer";

let localStream: MediaStream;
let peers: Record<string, any> = {}; // use 'any' because we can't import types from simple-peer

// Helper to ensure SimplePeer is loaded
async function loadSimplePeer() {
    if ((window as any).SimplePeer) return (window as any).SimplePeer;
    
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/simple-peer@9.11.1/simplepeer.min.js";
        script.onload = () => resolve((window as any).SimplePeer);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export async function connectWebRTC(vcId: string, config: any, onUpdate: (users: any[]) => void) {
    const SimplePeer = await loadSimplePeer();

    // Get microphone
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const ws = new WebSocket(config.webrtcServerUrl);

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === "user-list") {
            onUpdate(data.users);
        } else if (data.type === "signal") {
            const peerId = data.id;
            if (!peers[peerId]) createPeer(peerId, false, ws, SimplePeer);
            peers[peerId].signal(data.signal);
        }
    };

    // Add self to server
    ws.onopen = () => {
        ws.send(JSON.stringify({ type: "join", vcId }));
    };

    createPeer("self", true, ws, SimplePeer);
}

function createPeer(id: string, initiator: boolean, ws: WebSocket, SimplePeer: any) {
    const peer = new SimplePeer({ initiator, stream: localStream });
    
    peer.on("signal", (signal: any) => {
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
