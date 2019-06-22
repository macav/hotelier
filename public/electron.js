const electron = require('electron');
const { app, BrowserWindow, ipcMain, Tray, Menu } = electron;
const path = require('path');
const url = require('url');
const positioner = require('electron-traywindow-positioner');
var EventSource = require('eventsource');
const { hotelUrl } = require('./hotel-config');
const { autoUpdater } = require("electron-updater")

autoUpdater.checkForUpdatesAndNotify();

const assetsDirectory = path.join(__dirname, './assets');

const output = new EventSource(`${hotelUrl}/_/events/output`);
output.addEventListener('message', event => {
  logsWindow.webContents.send('output', JSON.parse(event.data));
  window.webContents.send('output', JSON.parse(event.data));
});

const events = new EventSource(`${hotelUrl}/_/events`);
events.addEventListener('message', event => {
  logsWindow.webContents.send('events', JSON.parse(event.data));
  window.webContents.send('events', JSON.parse(event.data));
});

let tray;
let window;
let logsWindow;
let closingApp = false;
// workaround for Windows, where blur event occurs when clicking on a tray icon
let blurredRecently = false;
let activeLogsWindowServer = null;

if (process.platform === 'darwin') {
  app.dock.hide();
}

Menu.setApplicationMenu(null);

app.on('ready', () => {
  createTray();
  createWindow();
  createLogWindow();
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
  tray.on('click', function (event) {
    toggleWindow();

    if (event.shiftKey) {
      if (window.isVisible()) {
        window.openDevTools({ mode: 'detach' });
      }
      if (logsWindow.isVisible()) {
        logsWindow.openDevTools({ mode: 'detach' });
      }
    }
  });
};

const startUrl = process.env.ELECTRON_START_URL || url.format({
  pathname: path.join(__dirname, './index.html'),
  protocol: 'file:',
  slashes: true,
});

const createWindow = () => {
  window = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: true,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  window.on('page-title-updated', (evt) => {
    evt.preventDefault();
  });
  window.loadURL(startUrl);

  window.on('blur', () => {
    blurredRecently = true;
    setTimeout(() => blurredRecently = false, 100);
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
  window.on('close', e => {
    closingApp = true;
    logsWindow.close();
  });
};

const createLogWindow = () => {
  logsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    resizable: true,
    frame: true,
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  logsWindow.on('page-title-updated', (evt) => {
    evt.preventDefault();
  });
  logsWindow.loadURL(startUrl);
  logsWindow.on('close', e => {
    if (!closingApp) {
      e.preventDefault();
      if (process.platform === 'darwin') {
        app.dock.hide();
      }
      logsWindow.hide();
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
  positioner.position(window, tray.getBounds());
  window.show();
  window.focus();
};

ipcMain.on('showDock', (_event, serverId) => {
  if (serverId === activeLogsWindowServer && logsWindow.isVisible()) {
    logsWindow.hide();
    if (process.platform === 'darwin') {
      app.dock.hide();
    }
  } else {
    activeLogsWindowServer = serverId;
    logsWindow.setTitle(`Hotelier - Logs of ${serverId}`);
    logsWindow.webContents.executeJavaScript(`location.href = "#/logs/${serverId}"`);
    if (!logsWindow.isVisible()) {
      logsWindow.show();
      if (process.platform === 'darwin') {
        app.dock.show();
      }
    } else {
      logsWindow.focus();
    }
  }
});
