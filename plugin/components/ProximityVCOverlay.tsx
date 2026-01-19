import { React, useState, useEffect } from "@webpack/common";
import UserAvatar from "./UserAvatar";
import { connectWebRTC, sendPositionUpdate } from "../webrtc/webrtcClient";

interface OverlayProps {
    vcId: string;
    config: any;
}

interface UserPosition {
    id: string;
    name: string;
    x: number;
    y: number;
    muted: boolean;
}

let positions: Record<string, UserPosition> = {};

const Overlay: React.FC<OverlayProps> = ({ vcId, config }) => {
    const [users, setUsers] = useState<UserPosition[]>([]);
    const [selfId, setSelfId] = useState<string>("self"); // replace with Discord user ID
    
    useEffect(() => {
        // Connect to WebRTC server
        connectWebRTC(vcId, config, (remoteUsers: UserPosition[]) => {
            positions = remoteUsers;
            setUsers(Object.values(remoteUsers));
        });
    }, [vcId]);

    const handleDrag = (id: string, x: number, y: number) => {
        positions[id] = { ...positions[id], x, y };
        setUsers(Object.values(positions));
        sendPositionUpdate(positions[id]); // send to server
    };

    return (
        <div style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            border: "2px solid #7289da",
            borderRadius: "8px",
            backgroundColor: "rgba(0,0,0,0.5)",
            overflow: "hidden",
            padding: "8px"
        }}>
            {users.map(u => (
                <UserAvatar key={u.id} user={u} onDrag={handleDrag} isSelf={u.id === selfId} />
            ))}
        </div>
    );
};

export default Overlay;
