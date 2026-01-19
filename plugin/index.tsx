import definePlugin, { StartAt } from "@utils/types";
import { ChannelStore, SelectedChannelStore, UserStore } from "@webpack/common";
import ProximityVCOverlay from "./components/ProximityVCOverlay";

export default definePlugin({
    name: "Proximity Voice Chat",
    description: "Spatial audio plugin using WebRTC for designated VC channels.",
    authors: [{ name: "You", id: 0n }],
    startAt: StartAt.WebpackReady,

    config: {
        proximityVCIds: ["950013794665521175"],
        webrtcServerUrl: "ws://localhost:3000",
        maxDistance: 500,
    },

    start() {
        const self = this;
        const userId = UserStore.getCurrentUser().id;

        this.prevVC = null;
        this.overlayRoot = null; // store React root

        // Create container only once
        const containerId = "proximity-vc-overlay-container";
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement("div");
            container.id = containerId;
            container.style.position = "fixed";
            container.style.bottom = "10px";
            container.style.right = "10px";
            container.style.zIndex = "9999";
            container.style.padding = "5px 10px";
            container.style.background = "#5865F2";
            container.style.color = "#fff";
            container.style.border = "none";
            container.style.borderRadius = "5px";
            container.onclick = () => console.log("[Proximity VC Plugin] Div clicked!");
            document.body.appendChild(container);
        }

        let timeout: any;
        this.listener = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const vcId = SelectedChannelStore.getVoiceChannelId();

                if (vcId !== self.prevVC) {
                    // Leaving previous VC
                    if (!vcId && self.prevVC) {
                        console.log("[Proximity VC Plugin] Left VC:", self.prevVC);
                        if (self.overlayRoot) {
                            self.overlayRoot.unmount(); // remove old overlay
                            self.overlayRoot = null;
                        }
                    }

                    // Joining a VC
                    if (vcId && self.config?.proximityVCIds?.includes(vcId)) {
                        console.log("[Proximity VC Plugin] Joined VC:", vcId);
                        if (!self.overlayRoot) {
                            // Only create React root once
                            self.overlayRoot = createRoot(container);
                            self.overlayRoot.render(
                                <ProximityVCOverlay vcId={vcId} config={self.config} />
                            );
                        }
                    }

                    self.prevVC = vcId;
                }
            }, 50);
        };

        ChannelStore.addChangeListener(this.listener);

        console.log("%c[ProximityVC Plugin]%c Plugin started", "color: green; font-weight: bold;", "");
    },

    stop() {
        if (this.listener) ChannelStore.removeChangeListener(this.listener);
        console.log("%c[ProximityVC Plugin]%c Plugin stopped", "color: red; font-weight: bold;", "");
    },
});
