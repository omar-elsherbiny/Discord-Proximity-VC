I want you to create a **full-featured Discord client plugin** using TypeScript and Vencord (or any compatible mod system) that implements a **proximity voice chat system** while leaving all other Discord features (chat, emojis, reactions, normal VCs) fully functional. The plugin should work as a **hybrid client-side overlay + WebRTC bridge**, where only designated VC channels are replaced with a custom spatial audio system handled via an external WebRTC server. Here are the complete specifications:

1. Proximity VC Functionality:
   - Users join a designated VC, which is intercepted by the plugin.
   - Audio for that VC is fully routed through a **WebRTC server** (hosted externally, e.g., Raspberry Pi).
   - All other Discord features and VCs remain normal.

2. User Positioning:
   - Each user has a draggable avatar in a vertical/horizontal 2D space overlay inside the VC sidebar.
   - Positions are synced in real-time to all other users and the WebRTC server.
   - Distance between users affects audio volume using a **distance-squared falloff** curve.
   - Optional visual indicators of distance (opacity, size, or color fade).

3. Audio Effects:
   - Per-listener gain/volume applied based on distance.
   - Optional low-pass filter to simulate muffling for distant users.
   - Optional audio dissolution effect for further “far away” feel.
   - Audio mixing is handled server-side and streamed back to clients.

4. WebRTC Integration:
   - Plugin connects to a WebRTC server for audio streams.
   - Signaling via WebSockets or Socket.io.
   - Server receives audio from each client, applies distance-based effects, and returns mixed streams.
   - Plugin handles WebRTC connection and playback, replacing the normal Discord VC audio.

5. UI / UX:
   - Large draggable “map space” in the VC sidebar for user avatars.
   - Smooth position updates for all users.
   - Show usernames, microphone status, and optional volume bars.
   - Allow easy drag-and-drop movement in the VC space.

6. Keybinds & Controls:
   - Expose standard Discord keybinds (mute, deafen) for use in the plugin.
   - Optional integration with Discord soundboard.
   - Keybind states should sync properly with plugin audio routing.

7. Plugin Behavior:
   - Client-side only; each user must install the plugin.
   - Only specific VC channels are replaced by the plugin; others are untouched. (optional)
   - Connects to WebRTC server only when joining proximity VC.
   - Position and audio effects persist while in VC; reset on leave.

8. Compatibility & Performance:
   - Support multiple users (~5–15 on a Raspberry Pi server initially).
   - Lightweight UI overlay to avoid slowing Discord client.
   - Compatible with latest Discord Electron client + Vencord.

9. Optional Enhancements:
   - Configurable max distance and falloff parameters.
   - Overlay theme and avatar size options.
   - Smooth fade-in/fade-out of audio when users move.
   - Minimal visual latency.

10. Deliverables / Code Requirements:
    - **Plugin Skeleton**: TypeScript, Vencord API, React components for UI patches, WebRTC connection logic, position sync logic.
    - **Server Stub**: Node.js + WebRTC SFU (mediasoup / Simple-Peer) example; receives audio, applies distance gain/muffle, returns mixed streams; position update system.
    - **Documentation & Comments**: Instructions to configure VC IDs, WebRTC server URL, max distance, and understanding of audio processing flow.

11. Important Notes:
    - Discord activities or external integrations are not required.
    - Plugin should be safe to install client-side.
    - Volume and muffling calculations must use **distance squared** by default.
    - All audio routing for proximity VC must bypass Discord VC entirely.

Generate a **working plugin skeleton + server stub** with clear structure, comments, and ready-to-test functionality. Include examples for:
- Draggable VC user overlay UI.
- WebRTC client connection and playback.
- Distance-based gain and muffling.
- Keybind integration for mute/deafen/soundboard.
