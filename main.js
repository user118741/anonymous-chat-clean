const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

// 启动你的后端服务器
function startServer() {
    serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
        stdio: 'inherit'
    });
}

// 创建应用窗口
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 450,
        height: 600,
        title: '匿名聊天',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // 等1秒让服务器启动，然后加载网页
    setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
    }, 1000);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 应用就绪
app.whenReady().then(() => {
    startServer();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// 关掉窗口时，也关掉服务器
app.on('window-all-closed', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});