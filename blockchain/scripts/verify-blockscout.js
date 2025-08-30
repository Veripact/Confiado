import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyContractOnBlockscout() {
  const contractAddress = "0xa546508e1969224987BB37d1C52E86686b7f0C1C";
  const contractName = "ConfioLedger";
  const constructorArgs = "0x10e73fa118fc19b2e8293eee7923a0728be83d9c";
  
  // Read the contract source code
  const contractPath = path.join(__dirname, '../contracts/ConfioLedger.sol');
  const sourceCode = fs.readFileSync(contractPath, 'utf8');
  
  // Prepare the verification payload for Blockscout API (correct format)
  const verificationData = {
    compiler_version: "v0.8.28+commit.7893614a",
    license_type: "mit",
    source_code: sourceCode,
    is_optimization_enabled: false,
    optimization_runs: 200,
    contract_name: contractName,
    libraries: {},
    evm_version: "default",
    autodetect_constructor_args: false,
    constructor_args: constructorArgs
  };
  
  try {
    console.log("🔍 Verifying contract on Lisk Sepolia Blockscout...");
    console.log("📍 Contract Address:", contractAddress);
    console.log("📝 Contract Name:", contractName);
    console.log("🔧 Constructor Args:", constructorArgs);
    
    // Use the correct Blockscout API endpoint format
    const endpoint = `https://sepolia-blockscout.lisk.com/api/v2/smart-contracts/${contractAddress}/verification/via/flattened-code`;
    
    console.log(`🔗 Using endpoint: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData)
    });
    
    const result = await response.text();
    console.log(`📡 Status: ${response.status}, Response: ${result.substring(0, 200)}...`);
    
    if (response && response.ok) {
      console.log("✅ Contract verification submitted successfully!");
      console.log("🌐 Check status at: https://sepolia-blockscout.lisk.com/address/" + contractAddress);
    } else {
      console.log("❌ All verification endpoints failed.");
    }
    
  } catch (error) {
    console.error("💥 Error verifying contract:", error.message);
    
    // Fallback: provide manual verification instructions
    console.log("\n📋 Manual verification instructions:");
    console.log("1. Go to: https://sepolia-blockscout.lisk.com/address/" + contractAddress + "/contract-verification");
    console.log("2. Select 'Solidity (Flattened source code)'");
    console.log("3. Use these details:");
    console.log("   - Contract Name: ConfioLedger");
    console.log("   - Compiler Version: v0.8.28+commit.7893614a");
    console.log("   - Optimization: No");
    console.log("   - Constructor Arguments: " + constructorArgs);
    console.log("   - Source Code: Copy from contracts/ConfioLedger.sol");
  }
}

verifyContractOnBlockscout().catch(console.error);
