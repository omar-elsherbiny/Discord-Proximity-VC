import React from "react";

interface UserAvatarProps {
    user: any;
    isSelf?: boolean;
    onDrag: (id: string, x: number, y: number) => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, onDrag, isSelf }) => {
    const handleMouseMove = (e: React.MouseEvent) => {
        if (e.buttons === 1) { // dragging
            onDrag(user.id, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        }
    };

    return (
        <div
            style={{
                position: "absolute",
                left: user.x,
                top: user.y,
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: isSelf ? "lime" : "cyan",
                opacity: 1 - Math.min(user.x**2 + user.y**2 / 100000, 0.8),
                cursor: "grab",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontSize: 10
            }}
            onMouseMove={handleMouseMove}
        >
            {user.name[0]}
        </div>
    );
};

export default UserAvatar;
