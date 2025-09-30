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
    },
  });

  if (isDev) {
    // 🔥 Dev mode → load Vite server (Clerk sẽ nhận http://localhost:3000)
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    // 🚀 Production → load file build React
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
  }
});
