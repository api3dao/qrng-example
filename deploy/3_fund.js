const hre = require('hardhat');
const airnodeAdmin = require('@api3/airnode-admin');
const apis = require('../data/apis.json');

const amounts = {
  ropsten: { value: 0.1, unit: 'ETH' },
  rinkeby: { value: 0.1, unit: 'ETH' },
  goerli: { value: 0.1, unit: 'ETH' },
  kovan: { value: 0.1, unit: 'ETH' },
  mainnet: { value: 0.05, unit: 'ETH' },
  arbitrum: { value: 0.01, unit: 'ETH' },
  avalanche: { value: 0.2, unit: 'AVAX' },
  bsc: { value: 0.003, unit: 'BNB' },
  fantom: { value: 1, unit: 'FTM' },
  gnosis: { value: 1, unit: 'xDAI' },
  metis: { value: 0.01, unit: 'METIS' },
  milkomeda: { value: 1, unit: 'milkADA' },
  moonbeam: { value: 0.1, unit: 'GLMR' },
  moonriver: { value: 0.01, unit: 'MOVR' },
  optimism: { value: 0.01, unit: 'ETH' },
  polygon: { value: 10, unit: 'MATIC' },
  rsk: { value: 0.0001, unit: 'RBTC' },
};

module.exports = async () => {
  const apiData = apis['ANU Quantum Random Numbers'];
  const account = (await hre.ethers.getSigners())[0];
  const QrngExample = await hre.deployments.get('QrngExample');
  const qrngExample = new hre.ethers.Contract(QrngExample.address, QrngExample.abi, account);

  // We are deriving the sponsor wallet address from the QrngExample contract address
  // using the @api3/airnode-admin SDK. You can also do this using the CLI
  // https://docs.api3.org/airnode/latest/reference/packages/admin-cli.html
  // Visit our docs to learn more about sponsors and sponsor wallets
  // https://docs.api3.org/airnode/latest/concepts/sponsor.html
  const sponsorWalletAddress = await airnodeAdmin.deriveSponsorWalletAddress(
    apiData.xpub,
    apiData.airnode,
    qrngExample.address
  );

  const amountInEther = amounts[hre.network.name].value;
  const receipt = await account.sendTransaction({
    to: sponsorWalletAddress,
    value: hre.ethers.utils.parseEther(amountInEther.toString()),
  });
  console.log(
    `Funding sponsor wallet at ${sponsorWalletAddress} with ${amountInEther} ${amounts[hre.network.name].unit}...`
  );
  await new Promise((resolve) =>
    hre.ethers.provider.once(receipt.hash, () => {
      resolve();
    })
  );
  console.log('Sponsor wallet funded');
};
module.exports.tags = ['fund'];
