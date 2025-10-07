import { app, BrowserWindow } from "electron";
import path from "path";

const isDev = !app.isPackaged; // true khi chạy dev, false khi build

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Thêm nếu chưa có (bypass security dev)
      // Thêm: opener: null để tránh window opener issues
      additionalArguments: process.env.NODE_ENV === 'development' ? ['--disable-web-security'] : [],
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
  }
});
