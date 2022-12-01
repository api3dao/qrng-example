const hre = require('hardhat');
const airnodeAdmin = require('@api3/airnode-admin');
const apis = require('../data/apis.json');
const utils = require('../scripts/utils.js');

module.exports = async () => {
  const api = utils.detectApi(hre.network);
  const apiData = apis[api];
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

  // Set the parameters that will be used to make Airnode requests
  const receipt = await qrngExample.setRequestParameters(
    apiData.airnode,
    apiData.endpointIdUint256,
    apiData.endpointIdUint256Array,
    sponsorWalletAddress
  );
  console.log('Setting request parameters...');
  await new Promise((resolve) =>
    hre.ethers.provider.once(receipt.hash, () => {
      resolve();
    })
  );
  console.log('Request parameters set');
};
module.exports.tags = ['setup'];
