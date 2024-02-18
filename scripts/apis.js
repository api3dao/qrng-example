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
  'quintessence': {
    airnode: '0x224e030f03Cd3440D88BD78C9BF5Ed36458A1A25',
    endpointIdUint256: '0xffd1bbe880e7b2c662f6c8511b15ff22d12a4a35d5c8c17202893a5f10e25284',
    endpointIdUint256Array: '0x4554e958a68d68de6a4f6365ff868836780e84ac3cba75ce3f4c78a85faa8047',
    xpub: 'xpub6CyZcaXvbnbqGfqqZWvWNUbGvdd5PAJRrBeAhy9rz1bbnFmpVLg2wPj1h6TyndFrWLUG3kHWBYpwacgCTGWAHFTbUrXEg6LdLxoEBny2YDz',
  },
  'quantum blockchain random numbers': {
    airnode: '0x07D7F4EcaC8aDf3f0412ab058a051fD8b8507348',
    endpointIdUint256: '0x8cf0e7205eff59b8695db96b34ffe7a5a125a3ed263afa3353aef6c3d82debf9',
    endpointIdUint256Array: '0x09fd3663fdc0ab359a5ebcba098571122ddb2a80b00a503960b32e67491f52d7',
    xpub: 'xpub6C7WhXL7KNoa9GnCwEfLCWzf326hXhqD3nUyKg4ZxzXvjcmFeVQ9GZENgKtHxLfo3uPa13GBHCAb1nRgdUnP5YGJFX97KqpeFvHQzpjhmoi'
  },
  'testnet Random Numbers': {
    airnode: '0x6238772544f029ecaBfDED4300f13A3c4FE84E1D',
    endpointIdUint256: '0x94555f83f1addda23fdaa7c74f27ce2b764ed5cc430c66f5ff1bcf39d583da36',
    endpointIdUint256Array: '0x9877ec98695c139310480b4323b9d474d48ec4595560348a2341218670f7fbc2',
    xpub: 'xpub6CuDdF9zdWTRuGybJPuZUGnU4suZowMmgu15bjFZT2o6PUtk4Lo78KGJUGBobz3pPKRaN9sLxzj21CMe6StP3zUsd8tWEJPgZBesYBMY7Wo',
  },
};

function getApi(network) {
  if (Object.keys(credentials.networks['mainnets']).includes(network.name)) {
    return apis['quintessence'];
  } else if (Object.keys(credentials.networks['testnets']).includes(network.name)) {
    return apis['testnet Random Numbers'];
  } else {
    throw new Error(`Network ${network.name} does not exists in available networks.`);
  }
}

module.exports = { getApi };
