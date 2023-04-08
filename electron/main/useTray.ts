import { ipcMain, nativeImage, nativeTheme, Tray } from 'electron';
import path from 'path';

let tray: Tray;

export default (openMainWindow: () => void) => {
  if (!tray) {
    let icon: Electron.NativeImage;
    if (nativeTheme.shouldUseDarkColors) {
      icon = nativeImage.createFromPath(path.join(__dirname, 'public/tray-icon-dark.png'));
    } else {
      icon = nativeImage.createFromPath(path.join(__dirname, 'public/tray-icon-light.png'));
    }
    tray = new Tray(icon);
    tray.on('click', () => {
      openMainWindow();
    });
  }
  return tray;
};
