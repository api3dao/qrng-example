# QRNG Example

> An example project that demonstrates the usage of the Airnode request–response protocol to receive QRNG services

This README documents this specific QRNG example implementation. For more general information, refer to the
[API3 QRNG docs](https://docs.api3.org/qrng/).

## Instructions

1. Install the dependencies

```sh
yarn
```

2. Provide the blockhain provider URL and the wallet mnemonic for the network you will work with. The wallet needs to be
   funded.

```sh
cp credentials.example.json credentials.json
# ...and populate credentials.json
```

3. Deploy the contract, send a transaction to set the request parameters and another one to fund the sponsor wallet with
   the command below. `<NETWORK>` is the name of the network, e.g., `rinkeby`. See the code in `deploy/` for more
   information.

```sh
NETWORK=<NETWORK> yarn deploy
```

4. Send a transaction to request a `uint256` and print it once it is recieved. See the code in `scripts/` for more
   information.

```sh
NETWORK=<NETWORK> yarn request-uint256
```

5. Send a transaction to request a `uint256[]` with 5 elements and print it once it is recieved. See the code in
   `scripts/` for more information.

```sh
NETWORK=<NETWORK> yarn request-uint256-array
```

If you want to fund the sponsor wallet again, run

```sh
NETWORK=<NETWORK> yarn fund
```

## QRNG Airnodes

The QRNG Airnodes supported by this example are documented in `data/apis.json`.

## QrngExample contract documentation

### Request parameters

The contract uses the following parameters to make requests:

- `airnode`: Airnode address that belongs to the API provider
- `endpointId`: Airnode endpoint ID that will be used. Different endpoints are used to request a `uint256` or
  `uint256[]`
- `sponsorWallet`: Sponsor wallet address derived from the Airnode extended public key and the sponsor address

`airnode` and `endpointId` are read from `data/apis.json`, see below for how to derive `sponsorWallet`. For further
information, see the [docs on Airnode RRP concepts](https://docs.api3.org/airnode/latest/concepts/).

### Sponsor wallet

QrngExample sets its own sponsorship status as `true` in its constructor. This means that QrngExample is its own
sponsor. You can derive the sponsor wallet using the following command (you can find `<XPUB>` and `<AIRNODE>` in
`data/apis.json`):

```sh
npx @api3/airnode-admin derive-sponsor-wallet-address \
  --airnode-xpub <XPUB> \
  --airnode-address <AIRNODE> \
  --sponsor-address <QRNG_EXAMPLE_ADDRESS>
```

The Airnode will use this sponsor wallet to respond to the requests made by QrngExample. This means that you need to
keep this wallet funded.

The sponsorship scheme can be used in different ways, for example, by having the users of your contract use their own
individual sponsor wallets. Furthermore, sponsors can request withdrawals of funds from their sponsor wallets. For more
information about the sponsorship scheme, see the
[sponsorship docs](https://docs.api3.org/airnode/latest/concepts/sponsor.html).

### ABI-encoding

Fulfillment data is ABI-encoded, and in `bytes` type. It is assumed that you know the expected repsonse schema
associated with the endpoint that you use to make your request. For example, `makeRequestUint256()` uses an endpoint
that will return `(uint256)`, while `makeRequestUint256Array()` uses an endpoint that will return `(uint256[])`. Then,
the respective fulfillment function should decode the response using `abi.decode()` with the correct schema.

Request parameters are encoded using "Airnode ABI", which should not be confused with regular ABI encoding. QrngExample
already implements this encoding and provides a user-friendly interface for `makeRequestUint256Array()`. Read the
[ABI encoding docs](https://docs.api3.org/airnode/latest/reference/specifications/airnode-abi-specifications.html) for
more information.
