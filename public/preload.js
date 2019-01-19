const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();
// eslint-disable-next-line no-unused-vars
const { shell, Tray } = require('electron');

// Read Hotel config and store port number
const hotelConfigPath = path.join(homedir, '.hotel', 'conf.json');
const hotelPort = JSON.parse(fs.readFileSync(hotelConfigPath)).port;

// Attach electron shell and hotel port to window object
window.shell = shell;
window.hotelPort = hotelPort ? hotelPort.toString() : '2000';
