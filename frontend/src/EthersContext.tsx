import * as React from 'react'
import { createContext } from 'react';
import { ethers } from "ethers";
declare const window: any;

/*
* Module for a consumable context in the App rather than prop drilling several layers.
*/

interface Ethers {
  connect: (prompt?: boolean) => Promise<[string[], ethers.providers.Web3Provider]>
}

/*
* Connect with prompt or without returns an array of accounts (addresses) and an Ethers.js provider wrapping the window.ethereum object injected by MetaMask.
*/
const connect = async (prompt?: boolean): Promise<[string[], ethers.providers.Web3Provider]> => {
  const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
  const accounts = prompt ? await provider.send("eth_requestAccounts",[]) : await provider.send("eth_accounts",[]);
  provider.on("chainChanged",()=>window.location.reload());
  provider.getSigner();

  return [accounts, provider];
}

const EthersContext = createContext<Ethers>({connect: connect});

export default EthersContext;