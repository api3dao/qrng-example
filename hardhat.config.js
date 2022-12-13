require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');

const fs = require('fs');
let credentials = require('./credentials.example.json');
if (fs.existsSync('./credentials.json')) {
  credentials = require('./credentials.json');
}

module.exports = {
  networks: { ...credentials.networks.mainnets, ...credentials.networks.testnets },
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
