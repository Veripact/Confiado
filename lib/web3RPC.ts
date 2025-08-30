import type { IProvider } from "@web3auth/base";

// Static methods for direct use with Web3Auth provider
export class Web3RPC {
  static async getAccounts(provider: IProvider): Promise<string[]> {
    try {
      const accounts = await provider.request({
        method: "eth_accounts",
      });
      return accounts as string[];
    } catch (error) {
      console.error("Error getting accounts:", error);
      return [];
    }
  }

  static async getBalance(provider: IProvider): Promise<string> {
    try {
      const accounts = await this.getAccounts(provider);
      if (accounts.length === 0) return "0";

      const balance = await provider.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      
      // Convert from wei to ether (simple conversion)
      const balanceInWei = parseInt(balance as string, 16);
      const balanceInEther = balanceInWei / Math.pow(10, 18);
      return balanceInEther.toFixed(6);
    } catch (error) {
      console.error("Error getting balance:", error);
      return "0";
    }
  }

  static async getChainId(provider: IProvider): Promise<string> {
    try {
      const chainId = await provider.request({
        method: "eth_chainId",
      });
      return parseInt(chainId as string, 16).toString();
    } catch (error) {
      console.error("Error getting chain ID:", error);
      return "0";
    }
  }

  static async sendTransaction(provider: IProvider, to: string, value: string): Promise<string> {
    try {
      const accounts = await this.getAccounts(provider);
      if (accounts.length === 0) throw new Error("No accounts found");

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to,
            value: `0x${parseInt(value).toString(16)}`, // Convert to hex
          },
        ],
      });
      return txHash as string;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  static async signMessage(provider: IProvider, message: string): Promise<string> {
    try {
      const accounts = await this.getAccounts(provider);
      if (accounts.length === 0) throw new Error("No accounts found");

      const signature = await provider.request({
        method: "personal_sign",
        params: [message, accounts[0]],
      });
      return signature as string;
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  }
}
