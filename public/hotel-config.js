const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();

// Read Hotel config and store port number
const hotelConfigPath = path.join(homedir, '.hotel', 'conf.json');
const hotelConfig = JSON.parse(fs.readFileSync(hotelConfigPath));
const hotelPort = hotelConfig.port || 2000;
const hotelTld = hotelConfig.tld || 'localhost';
const hotelHost = hotelConfig.host || 'http://localhost';
const hotelUrl = `http://${hotelHost}:${hotelPort}`;

module.exports = { hotelConfig, hotelPort, hotelHost, hotelUrl, hotelTld };