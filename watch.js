// watch.mjs
import path from 'path';
import fs from 'fs-extra';
import chokidar from 'chokidar';

// Your plugin source folder
const PLUGIN_SRC = path.resolve('plugin');

// Vencord user plugin folder
const userDocs = path.join(process.env.USERPROFILE, 'Documents');
const VENCORD_PLUGIN_DEST = path.join(userDocs, 'Vencord', 'src', 'userplugins', 'proximity-vc');

// Copy function
async function copyPlugin() {
  try {
    await fs.copy(PLUGIN_SRC, VENCORD_PLUGIN_DEST, { overwrite: true });
    console.log(`[Watcher] Plugin copied at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error('[Watcher] Failed to copy plugin:', err);
  }
}

// Initial copy
console.log(`[Watcher] Plugin copying to ${VENCORD_PLUGIN_DEST}`);
copyPlugin();

// Watch for changes
const watcher = chokidar.watch(PLUGIN_SRC, {
  persistent: true,
  ignoreInitial: true,
});

watcher.on('all', (event, pathChanged) => {
  console.log(`[Watcher] Detected ${event} on ${pathChanged}`);
  copyPlugin();
});
