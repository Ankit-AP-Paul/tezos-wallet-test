"use client";

import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { useEffect, useState } from "react";
import { stringToBytes } from "@taquito/utils";
import {
  NetworkType,
  RequestSignPayloadInput,
  SigningType,
  TezosOperationType,
} from "@airgap/beacon-sdk";

const Tezos = new TezosToolkit("https://ghostnet.ecadinfra.com");
const wallet = new BeaconWallet({
  name: "Next App",
  network: { type: NetworkType.GHOSTNET },
});

// const messageToHexExpr = (message: string) => {
//   const bytes = stringToBytes(message);
//   const bytesLength = (bytes.length / 2).toString(16);
//   const addPadding = `00000000${bytesLength}`;
//   const paddedBytesLength = addPadding.slice(addPadding.length - 8);
//   const hexExpr = "05" + "01" + paddedBytesLength + bytes;

//   return hexExpr;
// };

Tezos.setWalletProvider(wallet);

export default function Home() {
  //
  // -----------------------------------------------Connect Wallet -----------------------------------------------//
  //
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const checkAccount = async () => {
      const beaconActiveAccount = await wallet.client.getActiveAccount();
      if (beaconActiveAccount) {
        setWalletAddress(beaconActiveAccount.address);
      }
    };

    checkAccount();
  }, []);

  const connect = async () => {
    const persmission = await wallet.client.requestPermissions();
    setWalletAddress(persmission.address);
    console.log(persmission);
  };

  const disconnect = async () => {
    await wallet.client.clearActiveAccount();
    setWalletAddress(undefined);
  };
  // -----------------------------------------------------------------------------------------------------------//

  //
  // --------------------------------------------------Sign in --------------------------------------------------//
  //
  // const signin = async () => {
  //   const response = await wallet.client.requestSignPayload({
  //     signingType: SigningType.MICHELINE,
  //     payload: messageToHexExpr(
  //       `Tezos Signed Message: Signing message for Next App for user ${walletAddress} at ${new Date().toISOString()}`
  //     ),
  //     sourceAddress: walletAddress,
  //   });

  //   console.log(response.signature);
  // };
  // -----------------------------------------------------------------------------------------------------------//

  //
  // -------------------------------------------------Send Tezos ------------------------------------------------//
  //
  const sendTezos = async () => {
    const response = await wallet.sendOperations([
      {
        kind: TezosOperationType.TRANSACTION,
        amount: "1000000", //amount in mutez (1 tez = 1,000,000 mutez)
        destination: "tz1bANSeoQwDBKaLT24vREXcyA2g3yVB5acS", //destination address
      },
    ]);

    console.log(`Operation hash: ${response}`);
  };
  // -----------------------------------------------------------------------------------------------------------//

  return (
    <main className="p-10">
      <div className="text-3xl">Tezos Connect</div>
      <div className="py-10">
        {walletAddress ? (
          <div>
            <div>Connected with {walletAddress}</div>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={disconnect}>
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={connect}>
            Connect Wallet
          </button>
        )}
      </div>
      {/* <div>
        {walletAddress ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={signin}>
            Sign in
          </button>
        ) : null}
      </div> */}
      <div>
        {walletAddress ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={sendTezos}>
            Send 1 Tezos
          </button>
        ) : null}
      </div>
    </main>
  );
}
