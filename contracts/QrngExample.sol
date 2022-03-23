//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequester.sol";

contract QrngExample is RrpRequester {
    event RequestedUint256(bytes32 indexed requestId);
    event RequestedUint256Array(bytes32 indexed requestId, uint256 size);
    event ReceivedUint256(bytes32 indexed requestId, uint256 response);
    event ReceivedUint256Array(bytes32 indexed requestId, uint256[] response);

    address public airnode;
    bytes32 public endpointIdUint256;
    bytes32 public endpointIdUint256Array;
    address public sponsorWallet;

    mapping(bytes32 => bool) public awaitingResponseForRequestWithId;

    constructor(address _airnodeRrp) RrpRequester(_airnodeRrp) {
        airnodeRrp.setSponsorshipStatus(address(this), true);
    }

    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256,
        bytes32 _endpointIdUint256Array,
        address _sponsorWallet
    ) external {
        airnode = _airnode;
        endpointIdUint256 = _endpointIdUint256;
        endpointIdUint256Array = _endpointIdUint256Array;
        sponsorWallet = _sponsorWallet;
    }

    function makeRequestUint256() external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfillUint256.selector,
            ""
        );
        awaitingResponseForRequestWithId[requestId] = true;
        emit RequestedUint256(requestId);
    }

    function fulfillUint256(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            awaitingResponseForRequestWithId[requestId],
            "Request ID not known"
        );
        awaitingResponseForRequestWithId[requestId] = false;
        emit ReceivedUint256(requestId, abi.decode(data, (uint256)));
    }

    function makeRequestUint256Array(uint256 size) external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256Array,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfillUint256Array.selector,
            // Using Airnode ABI to encode the parameters
            abi.encode(bytes32("1u"), bytes32("size"), size)
        );
        awaitingResponseForRequestWithId[requestId] = true;
        emit RequestedUint256Array(requestId, size);
    }

    function fulfillUint256Array(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            awaitingResponseForRequestWithId[requestId],
            "Request ID not known"
        );
        awaitingResponseForRequestWithId[requestId] = false;
        emit ReceivedUint256Array(requestId, abi.decode(data, (uint256[])));
    }
}
