import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyContract() {
  const contractAddress = "0xa546508e1969224987BB37d1C52E86686b7f0C1C";
  const contractName = "ConfioLedger";
  
  // Read the contract source code
  const contractPath = path.join(__dirname, '../contracts/ConfioLedger.sol');
  const sourceCode = fs.readFileSync(contractPath, 'utf8');
  
  // Read the OpenZeppelin Ownable contract
  const ownablePath = path.join(__dirname, '../node_modules/@openzeppelin/contracts/access/Ownable.sol');
  const ownableCode = fs.readFileSync(ownablePath, 'utf8');
  
  // Read the Context contract
  const contextPath = path.join(__dirname, '../node_modules/@openzeppelin/contracts/utils/Context.sol');
  const contextCode = fs.readFileSync(contextPath, 'utf8');
  
  // Prepare the verification payload
  const verificationData = {
    addressHash: contractAddress,
    name: contractName,
    compilerVersion: "v0.8.28+commit.7893614a",
    optimization: false,
    contractSourceCode: sourceCode,
    constructorArguments: "",
    autodetectConstructorArguments: true,
    evmVersion: "default",
    optimizationRuns: 200,
    libraries: {},
    // Include all source files
    sources: {
      "contracts/ConfioLedger.sol": {
        content: sourceCode
      },
      "@openzeppelin/contracts/access/Ownable.sol": {
        content: ownableCode
      },
      "@openzeppelin/contracts/utils/Context.sol": {
        content: contextCode
      }
    }
  };
  
  console.log("Contract verification details:");
  console.log("- Contract Address:", contractAddress);
  console.log("- Contract Name:", contractName);
  console.log("- Network: Lisk Sepolia (Chain ID: 4202)");
  console.log("- Blockscout URL: https://sepolia-blockscout.lisk.com");
  console.log("\nTo manually verify the contract:");
  console.log("1. Go to https://sepolia-blockscout.lisk.com/address/" + contractAddress + "/contracts#address-tabs");
  console.log("2. Click 'Verify & Publish'");
  console.log("3. Use the following details:");
  console.log("   - Contract Name: ConfioLedger");
  console.log("   - Compiler Version: v0.8.28+commit.7893614a");
  console.log("   - Optimization: Disabled");
  console.log("   - Source Code: Copy from contracts/ConfioLedger.sol");
  console.log("\nContract source code saved to verification-source.sol for manual upload");
  
  // Create a flattened source file for manual verification
  const flattenedSource = `// SPDX-License-Identifier: MIT
// Flattened source code for verification

${contextCode}

${ownableCode}

${sourceCode}`;
  
  fs.writeFileSync(path.join(__dirname, '../verification-source.sol'), flattenedSource);
  
  console.log("\n✅ Verification files prepared successfully!");
  console.log("📁 Flattened source saved to: verification-source.sol");
}

verifyContract().catch(console.error);
