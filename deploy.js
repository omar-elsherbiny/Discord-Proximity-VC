import path from "path";
import os from "os";
import { copy } from "fs-extra";
import { exec } from "child_process";

// === Config ===

// Local plugin folder
const repoRoot = path.resolve("./");
const pluginSrc = path.join(repoRoot, "plugin");

// Vencord plugin folder
const appData = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
const pluginDest = path.join(appData, "Vencord", "plugins", "proximity-vc");

// Optional: Git repo branch (for later updates)
const gitBranch = "main";

// === Functions ===

// Copy plugin folder to Vencord plugin directory
async function deployPlugin() {
  try {
    console.log("Deploying plugin from:", pluginSrc);
    console.log("Destination:", pluginDest);

    await copy(pluginSrc, pluginDest, { overwrite: true });

    console.log("Plugin successfully deployed!");
  } catch (err) {
    console.error("Failed to deploy plugin:", err);
  }
}

// Pull latest from Git (optional for future updates)
function updateFromGit() {
  return new Promise((resolve, reject) => {
    console.log("Pulling latest from Git...");

    exec(`git pull origin ${gitBranch}`, { cwd: repoRoot }, (err, stdout, stderr) => {
      if (err) {
        console.error("Git pull failed:", stderr);
        reject(err);
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
}

// === Main ===
async function main() {
  // Uncomment this later when auto-update is ready
  // await updateFromGit();

  await deployPlugin();
}

main();
