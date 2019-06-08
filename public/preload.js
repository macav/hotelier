const { shell, ipcRenderer } = require('electron');
const { hotelConfig, hotelPort, hotelHost, hotelUrl, hotelTld } = require('./hotel-config');

window.shell = shell;
window.ipcRenderer = ipcRenderer;

// Attach electron shell, ipcRenderer, and hotelPort to window object
window.hotelConfig = hotelConfig;
window.hotelPort = hotelPort;
window.hotelHost = hotelHost;
window.hotelUrl = hotelUrl;
window.hotelTld = hotelTld;