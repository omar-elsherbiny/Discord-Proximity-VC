import { Plugins } from "Vencord";
import ProximityVCOverlay from "./components/ProximityVCOverlay";

export default class ProximityVCPlugin extends Pluginsa {
    name = "Proximity Voice Chat";
    description = "Spatial audio plugin using WebRTC for designated VC channels.";
    
    // Example configurable options
    config = {
        proximityVCIds: ["0"], // Discord VC IDs to intercept
        webrtcServerUrl: "ws://localhost:3000",
        maxDistance: 500,
    };

    onStart() {
        console.log("[ProximityVC] Plugin started");
        this.patchVCs();
    }

    onStop() {
        console.log("[ProximityVC] Plugin stopped");
        // Clean up UI / WebRTC
    }

    patchVCs() {
        // Hook into VC joining (simplified pseudocode)
        // You would use Discord internal modules here to detect VC join
        const originalJoinVC = window.DiscordModules.Voice.joinChannel;
        window.DiscordModules.Voice.joinChannel = async (...args: any[]) => {
            const vcId = args[0];
            if (this.config.proximityVCIds.includes(vcId)) {
                console.log(`[ProximityVC] Intercepting VC ${vcId}`);
                this.showOverlay(vcId);
                // Connect to WebRTC server instead of default VC audio
                return;
            }
            return originalJoinVC(...args);
        };
    }

    showOverlay(vcId: string) {
        ProximityVCOverlay.show(vcId, this.config);
    }
}
