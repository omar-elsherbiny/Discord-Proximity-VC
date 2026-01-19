import definePlugin, { StartAt, webpackModules } from "@utils/types";
import ProximityVCOverlay from "./components/ProximityVCOverlay";

export default definePlugin({
    name: "Proximity Voice Chat",
    description: "Spatial audio plugin using WebRTC for designated VC channels.",
    authors: [{ name: "You", id: 0n }],
    startAt: StartAt.Init,

    config: {
        proximityVCIds: ["950013794665521175"],
        webrtcServerUrl: "ws://localhost:3000",
        maxDistance: 500,
    },

    start() {
        console.log("%c[ProximityVC]%c Plugin started", "color: green; font-weight: bold;", "");

        // Get Discord Voice module via webpackModules
        const Voice = webpackModules.getByProps("joinChannel");
        if (!Voice) {
            console.warn("[ProximityVC] Could not find Voice module");
            return;
        }
        this.Voice = Voice;

        // Patch joinChannel using Vencord's built-in patch system
        this.patch(this.Voice, "joinChannel", (args, res) => {
            const vcId = args[0];
            if (this.config.proximityVCIds.includes(vcId)) {
                console.log(`[ProximityVC] Intercepting VC ${vcId}`);
                this.showOverlay(vcId);
                return Promise.resolve(); // Prevent default VC join
            }
            return res;
        });
    },

    stop() {
        console.log("%c[ProximityVC]%c Plugin stopped", "color: red; font-weight: bold;", "");
        // Patches are automatically cleaned up by Vencord
        // TODO: remove overlay if needed
    },

    showOverlay(vcId: string) {
        ProximityVCOverlay.show(vcId, this.config);
    },
});
