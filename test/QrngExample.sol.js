const hre = require('hardhat');
const { expect } = require('chai');

describe('QrngExample.sol', async function() {
  // example enpoint ids.
  const endpointIdUint256 = '0xfb6d017bb87991b7495f563db3c8cf59ff87b09781947bb1e417006ad7f55a78';
  const endpointIdUint256Array = '0x27cc2713e7f968e4e86ed274a051a5c8aaee9cca66946f23af6f29ecea9704c3';

  let roles;
  let airnodeRrp, qrngExample;
    
  beforeEach(async () => {
    const accounts = await hre.ethers.getSigners();
    roles = {
      deployer: accounts[0],
      airnode: accounts[1], 
    };
    // Already deployed airnodeRrp.
    const airnodeRrpFactory = await hre.ethers.getContractFactory('AirnodeRrpV0', roles.deployer);
    airnodeRrp = await airnodeRrpFactory.deploy();
    // Contract that user deploy.
    const qrngExampleFactory = await hre.ethers.getContractFactory('QrngExample', roles.deployer);  
    qrngExample = await qrngExampleFactory.deploy(airnodeRrp.address);
    await qrngExample.connect(roles.deployer).setRequestParameters(
      roles.airnode.address,
      endpointIdUint256,
      endpointIdUint256Array,
      roles.deployer.address
    )
  })
  
  describe('Test functions', () => {  
    it('Test makeRequestUint256', async () => {    
      const randomNumber = 5;
      // random number is multiplied by 5 in fulfillUint256() of qrngExample.sol.
      const expectedFunctionOutput = randomNumber * 5;

      const tx = await qrngExample.connect(roles.deployer).makeRequestUint256();
      const receipt = await tx.wait();
      const logs = receipt.logs;
      const targetLog = logs.find((log) => log.address === qrngExample.address);
      const parsedLog = qrngExample.interface.parseLog(targetLog)
      const requestId = parsedLog.args.requestId;
      // airnode fulfills request
      const fulfillData = hre.ethers.utils.defaultAbiCoder.encode(['uint256'], [randomNumber]);
      const signature = await roles.airnode.signMessage(
        hre.ethers.utils.arrayify(
          hre.ethers.utils.keccak256(
            hre.ethers.utils.solidityPack(['bytes32', 'bytes'], [requestId, fulfillData])
          )
        )
      );
      const staticCallResult = await airnodeRrp.connect(roles.deployer).callStatic.fulfill(
        requestId,
        roles.airnode.address,
        qrngExample.address,
        qrngExample.interface.getSighash('fulfillUint256'),
        fulfillData,
        signature
      )
      // check results.
      expect(staticCallResult.callSuccess).to.equal(true);
      expect(await airnodeRrp.requestIsAwaitingFulfillment(requestId)).to.equal(true);
      const notSoRandomNumber = qrngExample.interface.decodeFunctionResult(
        qrngExample.interface.getSighash('fulfillUint256'), staticCallResult.callData
      )[0].toNumber();
      expect(notSoRandomNumber).equal(expectedFunctionOutput);
    }); 

    it('Test makeRequestUint256Array', async () => {
      const expectedRandomArray = [1, 2, 3];

      const tx = await qrngExample.connect(roles.deployer).makeRequestUint256Array(3);
      const receipt = await tx.wait();
      const logs = receipt.logs;
      const targetLog = logs.find((log) => log.address === qrngExample.address);
      const parsedLog = qrngExample.interface.parseLog(targetLog)
      const requestId = parsedLog.args.requestId;

      // airnode fulfills request
      const fulfillData = hre.ethers.utils.defaultAbiCoder.encode(['uint256[]'], [expectedRandomArray]);
      const signature = await roles.airnode.signMessage(
        hre.ethers.utils.arrayify(
          hre.ethers.utils.keccak256(
            hre.ethers.utils.solidityPack(['bytes32', 'bytes'], [requestId, fulfillData])
          )
        )
      ); 
      const staticCallResult = await airnodeRrp.connect(roles.deployer).callStatic.fulfill(
        requestId,
        roles.airnode.address,
        qrngExample.address,
        qrngExample.interface.getSighash('fulfillUint256Array'),
        fulfillData,
        signature
      )
      // check results.
      expect(staticCallResult.callSuccess).to.equal(true);
      expect(await airnodeRrp.requestIsAwaitingFulfillment(requestId)).to.equal(true);
      const notSoRandomNumberArray = qrngExample.interface.decodeFunctionResult(
        qrngExample.interface.getSighash('fulfillUint256Array'), staticCallResult.callData
      )[0];
      expect(notSoRandomNumberArray[0].toNumber()).equal(expectedRandomArray[0]);
      expect(notSoRandomNumberArray[1].toNumber()).equal(expectedRandomArray[1]);
      expect(notSoRandomNumberArray[2].toNumber()).equal(expectedRandomArray[2]); 
    }) 
  })
})