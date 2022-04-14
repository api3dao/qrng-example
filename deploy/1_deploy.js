const hre = require('hardhat');
const airnodeProtocol = require('@api3/airnode-protocol');

module.exports = async () => {
  // We are getting the AirnodeRrp address from @api3/airnode-protocol
  // Alternatively, you can get it from the docs
  // https://docs.api3.org/airnode/latest/reference/airnode-addresses.html
  const airnodeRrpAddress = airnodeProtocol.AirnodeRrpAddresses[await hre.getChainId()];

  const qrngExample = await hre.deployments.deploy('QrngExample', {
    args: [airnodeRrpAddress],
    from: (await getUnnamedAccounts())[0],
    log: true,
  });
  console.log(`Deployed QrngExample at ${qrngExample.address}`);
};
module.exports.tags = ['deploy'];
