const hre = require('hardhat');

const networks = {
  mainnets: [
    'mainnet',
    'arbitrum',
    'avalanche',
    'bsc',
    'fantom',
    'gnosis',
    'metis',
    'milkomeda',
    'moonbeam',
    'moonriver',
    'optimism',
    'polygon',
    'rsk',
  ],
  testnets: [
    'goerli',
    'sepolia',
    'avalanche_testnet',
    'milkomeda_testnet',
    'fantom_testnet',
    'moonbase_testnet',
    'bsc_testnet',
    'rsk_testnet',
    'polygon_testnet',
    'arbitrum_testnet',
    'optimism_testnet',
    'gnosis_testnet',
  ],
};

const apis = {
  mainnets: 'ANU Quantum Random Numbers',
  testnets: 'BYOG',
};

function detectApi(network) {
  const netType = Object.keys(networks).filter((net) => {
    return networks[net].includes(network.name);
  })[0];

  const api = apis[netType];
  if (!api) {
    throw new Error(`Network ${network.name} does not exists in available networks.`);
  }

  return api;
}

module.exports = { detectApi };
