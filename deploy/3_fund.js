const hre = require('hardhat');
const airnodeAdmin = require('@api3/airnode-admin');
const apis = require('../data/apis.json');

module.exports = async () => {
  const apiData = apis.myApi;
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

  // Fund the sponsor wallet for it to be able to respond to requests
  const ethValue = '0.05';
  await account.sendTransaction({
    to: sponsorWalletAddress,
    value: hre.ethers.utils.parseEther(ethValue),
  });
  console.log(`Funded sponsor wallet at ${sponsorWalletAddress} with ${ethValue} ETH`);
};
module.exports.tags = ['fund'];
module.exports.dependencies = ['deploy'];
