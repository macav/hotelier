const { shell, ipcRenderer, remote } = require('electron');
const { hotelConfig, hotelPort, hotelHost, hotelUrl, hotelTld } = require('./hotel-config');

if (process.platform === 'darwin') {
  const { systemPreferences } = remote;
  const setTheme = () => {
    const theme = systemPreferences.isDarkMode() ? 'dark' : 'light';
    systemPreferences.setAppLevelAppearance(theme);
    window.localStorage.osTheme = theme;
    if ('__setTheme' in window) {
      window.__setTheme()
    }
  };

  systemPreferences.subscribeNotification(
    'AppleInterfaceThemeChangedNotification',
    setTheme,
  );
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
