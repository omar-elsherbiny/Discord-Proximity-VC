import definePlugin, { StartAt } from "@utils/types";
import { getModule } from "@utils/webpack";
import ProximityVCOverlay from "./components/ProximityVCOverlay";

let originalJoinVC: any;

export default definePlugin({
    name: "Proximity Voice Chat",
    description: "Spatial audio plugin using WebRTC for designated VC channels.",
    authors: [{ name: "You", id: 0n }],
    startAt: 0, // StartAt.Init

    config: {
        proximityVCIds: ["950013794665521175"],
        webrtcServerUrl: "ws://localhost:3000",
        maxDistance: 500,
    },

    start() {
        console.log("[ProximityVC] Plugin started");
        this.patchVCs();
    },

    stop() {
        console.log("[ProximityVC] Plugin stopped");

        if (originalJoinVC && this.VoiceModule) {
            this.VoiceModule.joinChannel = originalJoinVC;
            originalJoinVC = undefined;
        }
    },

    VoiceModule: null as any,

    patchVCs() {
        const Voice = getModule(["joinChannel", "leaveChannel"]);
        if (!Voice) {
            console.error("[ProximityVC] Could not find Voice module");
            return;
        }

        this.VoiceModule = Voice;
        originalJoinVC = Voice.joinChannel;

        Voice.joinChannel = async (...args: any[]) => {
            const vcId = args[0];
            if (this.config.proximityVCIds.includes(vcId)) {
                console.log(`[ProximityVC] Intercepting VC ${vcId}`);
                this.showOverlay(vcId);
                // TODO: Connect to WebRTC server
                return;
            }

            return originalJoinVC(...args);
        };
    },

    showOverlay(vcId: string) {
        ProximityVCOverlay.show(vcId, this.config);
    }
});
