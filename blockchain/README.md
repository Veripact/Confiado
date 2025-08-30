# ConfioLedger Smart Contract

A secure blockchain infrastructure for anchoring Merkle roots of user transaction batches, enabling gasless operations for end users while maintaining transparency and immutability.

## Overview

ConfioLedger is a smart contract built with OpenZeppelin's security standards that allows only authorized backend services to anchor daily transaction batches as Merkle roots. This architecture ensures users can interact with the application without paying gas fees while maintaining cryptographic proof of all transactions.

## Features

- **Gasless Architecture**: Only the contract owner (backend) pays gas fees
- **Merkle Root Anchoring**: Secure batch anchoring with timestamp tracking
- **Duplicate Prevention**: Built-in protection against duplicate root submissions
- **Batch Tracking**: Sequential batch IDs for easy querying and verification
- **OpenZeppelin Security**: Leverages battle-tested Ownable access control
- **Event Emission**: Transparent logging of all anchor operations

## Deployed Contracts

- **Lisk Sepolia Testnet**: `0xa546508e1969224987BB37d1C52E86686b7f0C1C`

## Quick Start

### Install Dependencies

```bash
npm install
```

### Configure Environment

Copy the `.env.example` file to `.env` and configure your private key:

```bash
# Lisk Network Configuration
PRIVATE_KEY=your_private_key_here
LISK_MAINNET_RPC_URL=https://rpc.api.lisk.com
LISK_SEPOLIA_RPC_URL=https://rpc.sepolia-api.lisk.com
```

### Run Tests

```bash
npx hardhat test
```

### Deploy to Lisk Networks

```bash
# Deploy to Lisk Sepolia Testnet
npx hardhat ignition deploy ignition/modules/ConfioLedger.ts --network liskSepolia

# Deploy to Lisk Mainnet
npx hardhat ignition deploy ignition/modules/ConfioLedger.ts --network liskMainnet
```

## Contract Interface

### Core Functions

- `anchorDailyRoot(bytes32 merkleRoot)`: Anchor a new Merkle root (owner only)
- `getBatchCounter()`: Get the total number of anchored batches
- `isRootAnchored(bytes32 merkleRoot)`: Check if a root has been anchored
- `getBatchRoot(uint256 batchId)`: Get the Merkle root for a specific batch

### Events

- `AnchorUpdated(bytes32 indexed merkleRoot, uint256 indexed timestamp, uint256 indexed batchId)`: Emitted when a new root is anchored

## Security

- Built with OpenZeppelin contracts for proven security
- Comprehensive test suite with 21 test cases including fuzz testing
- Access control via Ownable pattern
- Input validation and duplicate prevention
