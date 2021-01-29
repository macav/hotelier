const electron = require('electron');
const {
  shell,
  ipcRenderer,
  remote: { nativeTheme },
} = electron;
const {
  hotelConfig,
  hotelPort,
  hotelHost,
  hotelUrl,
  hotelTld,
} = require('./hotel-config');

if (process.platform === 'darwin') {
  const setTheme = () => {
    const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    window.localStorage.osTheme = theme;
    if ('__setTheme' in window) {
      window.__setTheme();
    }
  };
  nativeTheme.addListener('updated', setTheme);

  setTheme();
}

window.shell = shell;
window.ipcRenderer = ipcRenderer;

// Attach electron shell, ipcRenderer, and hotelPort to window object
window.hotelConfig = hotelConfig;
window.hotelPort = hotelPort;
window.hotelHost = hotelHost;
window.hotelUrl = hotelUrl;
window.hotelTld = hotelTld;
