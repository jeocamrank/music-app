import { app, BrowserWindow } from "electron";
import path from "path";
import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { extname } from "path";

const isDev = !app.isPackaged;

let localServer: ReturnType<typeof createServer> | null = null;
const PORT = 3210;

function startLocalServer() {
  if (localServer) return;

  localServer = createServer((req, res) => {
    let filePath =
      req.url === "/"
        ? "/dist-react/index.html"
        : req.url || "/dist-react/index.html";
    filePath = filePath.split("?")[0];

    let fullPath: string;
    const appPath = app.getAppPath();

    // Xử lý logic tìm file (Giữ nguyên logic của bạn)
    if (filePath.match(/\.(jpg|jpeg|png|gif|svg|mp3|wav|ogg)$/i)) {
      const fileName = path.basename(filePath);
      fullPath = ""; // Initialize

      const distReactSubfolders = ["cover-images", "songs", "albums"];
      for (const folder of distReactSubfolders) {
        const testPath = path.join(appPath, "dist-react", folder, fileName);
        if (existsSync(testPath)) {
          fullPath = testPath;
          break;
        }
      }

      if (!fullPath || !existsSync(fullPath)) {
        fullPath = path.join(appPath, "public", fileName);
        if (!existsSync(fullPath)) {
          const subfolders = ["cover-images", "songs", "albums"];
          for (const folder of subfolders) {
            const testPath = path.join(appPath, "public", folder, fileName);
            if (existsSync(testPath)) {
              fullPath = testPath;
              break;
            }
          }
        }
      }
    } else if (filePath.startsWith("/assets/")) {
      fullPath = path.join(appPath, "dist-react", filePath);
    } else if (filePath.startsWith("/public/")) {
      fullPath = path.join(appPath, filePath);
    } else if (!filePath.startsWith("/dist-react/")) {
      const distReactPath = path.join(appPath, "dist-react", filePath);
      if (existsSync(distReactPath)) {
        fullPath = distReactPath;
      } else {
        fullPath = path.join(appPath, "public", filePath);
      }
    } else {
      fullPath = path.join(appPath, filePath);
    }

    // console.log(`[Server] Request: ${req.url} -> ${fullPath}`); // Comment lại cho sạch log production

    if (!existsSync(fullPath)) {
      // console.log(`[Server] File not found: ${fullPath}`);
      res.writeHead(404);
      res.end(`File not found: ${filePath}`);
      return;
    }

    try {
      const content = readFileSync(fullPath);
      const ext = extname(fullPath).toLowerCase();

      // Set content type
      const contentTypes: Record<string, string> = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
      };

      res.writeHead(200, {
        "Content-Type": contentTypes[ext] || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(content);
    } catch (error) {
      console.error("Error reading file:", error);
      res.writeHead(500);
      res.end("Error reading file");
    }
  });

  return new Promise<void>((resolve) => {
    localServer!.listen(PORT, () => {
      console.log(`Local server started on port ${PORT}`);
      resolve();
    });
  });
}

app.whenReady().then(async () => {
  if (!isDev) {
    await startLocalServer();
  }
  createWindow();
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      additionalArguments:
        process.env.NODE_ENV === "development"
          ? ["--disable-web-security"]
          : [],
    },
  });

  // Ẩn thanh menu mặc định của Electron (File, Edit, View...)
  mainWindow.setMenu(null);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (
      url.includes("accounts.google.com") ||
      url.includes("firebaseapp.com") ||
      url.includes("googleapis.com")
    ) {
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          width: 500,
          height: 600,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
          },
        },
      };
    }
    return { action: "allow" };
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    // Chỉ mở DevTools khi đang ở chế độ Development (npm run dev)
    mainWindow.webContents.openDevTools();
  } else {
    const url = `http://localhost:${PORT}`;
    console.log("Loading from HTTP server:", url);

    const tryLoad = () => {
      mainWindow.loadURL(url).catch((err) => {
        console.error("Error loading from HTTP server, retrying...", err);
        setTimeout(tryLoad, 500);
      });
    };

    setTimeout(tryLoad, 300);

    mainWindow.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription, validatedURL) => {
        console.error(
          "Failed to load:",
          errorCode,
          errorDescription,
          validatedURL
        );
      }
    );
  }
}

app.on("before-quit", () => {
  if (localServer) {
    localServer.close();
  }
});