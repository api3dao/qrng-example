const hre = require('hardhat');

async function main() {
  const QrngExample = await hre.deployments.get('QrngExample');
  const qrngExample = new hre.ethers.Contract(QrngExample.address, QrngExample.abi, (await hre.ethers.getSigners())[0]);

  // Make a request...
  const receipt = await qrngExample.makeRequestUint256();
  console.log('Sent a request transaction, waiting for it to be confirmed...');
  // and read the logs once it gets confirmed to get the request ID
  const requestId = await new Promise((resolve) =>
    hre.ethers.provider.once(receipt.hash, (tx) => {
      // We want the log from QrngExample, not AirnodeRrp
      const log = tx.logs.find((log) => log.address === qrngExample.address);
      const parsedLog = qrngExample.interface.parseLog(log);
      resolve(parsedLog.args.requestId);
    })
  );
  console.log(`Transaction is confirmed, request ID is ${requestId}`);

  // Wait for the fulfillment transaction to be confirmed and read the logs to get the random number
  console.log('Waiting for the fulfillment transaction...');
  const log = await new Promise((resolve) =>
    hre.ethers.provider.once(qrngExample.filters.ReceivedUint256(requestId, null), resolve)
  );
  const parsedLog = qrngExample.interface.parseLog(log);
  const randomNumber = parsedLog.args.response;
  console.log(`Fulfillment is confirmed, random number is ${randomNumber.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
