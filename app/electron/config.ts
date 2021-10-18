import { app, BrowserWindowConstructorOptions } from "electron";
import { StoreGet } from "../types/setting";
var mode = app.isPackaged ? "prod" : "dev";

export const BrowserConfig: BrowserWindowConstructorOptions = {
    width: 800,
    height: 540,

    minWidth: 800,
    minHeight: 540,

    maximizable: false,

    icon: "./public/favicon.ico",
    frame: false,
    center: true,
    autoHideMenuBar: true,
    show: false,
    alwaysOnTop: !!StoreGet("setting").system.win.isAlwaysOnTop,
    webPreferences: {
        // 关闭拼写矫正
        spellcheck: false,
        webSecurity: false,
        // 开启node
        nodeIntegration: true,
        contextIsolation: false,
    },
};
