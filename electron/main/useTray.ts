import { nativeImage, nativeTheme, Tray } from 'electron';
import path from 'path';

let tray: Tray;

export default () => {
  if (!tray) {
    let icon: Electron.NativeImage;
    if (nativeTheme.shouldUseDarkColors) {
      icon = nativeImage.createFromPath(path.join(__dirname, 'public/tray-icon-dark.png'));
    } else {
      icon = nativeImage.createFromPath(path.join(__dirname, 'public/tray-icon-light.png'));
    }
    tray = new Tray(icon);
  }
  return tray;
};
