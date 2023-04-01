import { BrowserWindow, ipcMain } from 'electron';

export default (app: Electron.App, mainWindow: BrowserWindow) => {

    ipcMain.on('open-login-window', (event, arg) => {
        console.log(arg);  // prints "ping"
        const loginWin = new BrowserWindow({
            title: "Login",
            webPreferences: {
                webSecurity: false,
            }
        })
        loginWin.on('close', () => {

        })
        loginWin.webContents.addListener('will-navigate', (event, url) => {
            console.log('url', url);
            if (url === 'https://zentao.logicamp.top/') {
                loginWin.close();
            }
        })
        loginWin.webContents.session.cookies.addListener('changed', (cookieEvent, cookie) => {
            if (cookie.name.includes('id')) {

                console.log('cookieChanged', cookie)
            }
            event.reply('cookieChanged', cookie);
        })
        loginWin.loadURL("https://zentao.logicamp.top/user-login.html")
    });

}