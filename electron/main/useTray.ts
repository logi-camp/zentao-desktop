import { ipcMain, nativeImage, nativeTheme, Tray } from 'electron';
import path from 'path';

let tray: Tray;

export default (openMainWindow: () => void, onRightClick: () => void) => {
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
    tray.on('right-click', () => {
      onRightClick();
    });
    tray.on('balloon-show', () => {
      onRightClick();
    });
    tray.on('mouse-down', () => {
      onRightClick();
    });
  }
  return tray;
};
