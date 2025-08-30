import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import type { IProvider } from "@web3auth/base";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BIthl2LoxlgquoUrTROK6wgS-DVyibBfOCoDer4RFBQa0gyxyPtJPxmKmB1zSRkh2wQ5jqePy_YLmp-kRm9hBds";

// Lisk Sepolia chain configuration
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x106a", // Lisk Sepolia Chain ID (4202 in decimal)
  rpcTarget: "https://rpc.sepolia-api.lisk.com",
  displayName: "Lisk Sepolia Testnet",
  blockExplorerUrl: "https://sepolia-blockscout.lisk.com",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://images.toruswallet.io/lisk.svg",
};

// Initialize private key provider
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
  uiConfig: {
    appName: "Confiado",
    appUrl: "https://confiado.app",
    logoLight: "https://web3auth.io/images/web3authlog.png",
    logoDark: "https://web3auth.io/images/web3authlogodark.png",
    defaultLanguage: "en",
    mode: "light",
    theme: {
      primary: "#1e40af",
    },
    modalZIndex: "99999",
    uxMode: "popup",
  },
});

export default web3auth;
export type { IProvider };
