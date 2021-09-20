import * as React from 'react'
import { createContext } from 'react';
import { ethers } from "ethers";
declare const window: any;
let ethereum: any = null;

interface Ethers {
  connect: (prompt?: boolean) => Promise<[string[], ethers.providers.Web3Provider]>
}

const connect = async (prompt?: boolean): Promise<[string[], ethers.providers.Web3Provider]> => {
  const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
  const accounts = prompt ? await provider.send("eth_requestAccounts",[]) : await provider.send("eth_accounts",[]);
  provider.on("chainChanged",()=>window.location.reload());
  provider.getSigner();

  return [accounts, provider];
}

const EthersContext = createContext<Ethers>({connect: connect});

export default EthersContext;