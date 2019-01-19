const electron = require('electron');
const { app, BrowserWindow, ipcMain, Tray } = electron; // eslint-disable-line no-unused-vars
const path = require('path');
const url = require('url');

const assetsDirectory = path.join(__dirname, './assets');

let tray;
let window;
// workaround for Windows, where blur event occured when clicking on a tray icon
let blurredRecently = false;

if (process.platform === 'darwin') {
  app.dock.hide();
}

app.on('ready', () => {
  createTray();
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

const createTray = () => {
  if (process.platform === 'darwin') {
    tray = new Tray(path.join(assetsDirectory, 'hotelTemplate.png'));
  } else {
    tray = new Tray(path.join(assetsDirectory, 'hotelTemplate_white.png'));
  }
  tray.on('right-click', toggleWindow);
  tray.on('click', function(event) {
    toggleWindow();

    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({ mode: 'detach' });
    }
  });
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();
  // eslint-disable-next-line no-unused-vars
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  let y = Math.round(trayBounds.y + trayBounds.height + 4);

  if (height < y) {
    y = Math.round(trayBounds.y - windowBounds.height - 4);
  }

  return { x: x, y: y };
};

const createWindow = () => {
  window = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, './index.html'),
    protocol: 'file:',
    slashes: true,
  });
  window.loadURL(startUrl);

  window.on('blur', () => {
    blurredRecently = true;
    setTimeout(() => blurredRecently = false, 100);
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
};

const toggleWindow = () => {
  if (window.isVisible() || blurredRecently) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus();
};
