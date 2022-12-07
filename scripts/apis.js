const fs = require('fs');
let credentials = require('../credentials.example.json');
if (fs.existsSync('../credentials.json')) {
  credentials = require('../credentials.json');
}

const apis = {
  'ANU Quantum Random Numbers': {
    airnode: '0x9d3C147cA16DB954873A498e0af5852AB39139f2',
    endpointIdUint256: '0xfb6d017bb87991b7495f563db3c8cf59ff87b09781947bb1e417006ad7f55a78',
    endpointIdUint256Array: '0x27cc2713e7f968e4e86ed274a051a5c8aaee9cca66946f23af6f29ecea9704c3',
    xpub: 'xpub6DXSDTZBd4aPVXnv6Q3SmnGUweFv6j24SK77W4qrSFuhGgi666awUiXakjXruUSCDQhhctVG7AQt67gMdaRAsDnDXv23bBRKsMWvRzo6kbf',
  },
  byog: {
    airnode: '0x6238772544f029ecaBfDED4300f13A3c4FE84E1D',
    endpointIdUint256: '0xfb6d017bb87991b7495f563db3c8cf59ff87b09781947bb1e417006ad7f55a78',
    endpointIdUint256Array: '0x27cc2713e7f968e4e86ed274a051a5c8aaee9cca66946f23af6f29ecea9704c3',
    xpub: 'xpub6CuDdF9zdWTRuGybJPuZUGnU4suZowMmgu15bjFZT2o6PUtk4Lo78KGJUGBobz3pPKRaN9sLxzj21CMe6StP3zUsd8tWEJPgZBesYBMY7Wo',
  },
};

function getApi(network) {
  if (Object.keys(credentials.networks['mainnets']).includes(network.name)) {
    return apis['ANU Quantum Random Numbers'];
  } else if (Object.keys(credentials.networks['testnets']).includes(network.name)) {
    return apis['byog'];
  } else {
    throw new Error(`Network ${network.name} does not exists in available networks.`);
  }
}

module.exports = { getApi };
