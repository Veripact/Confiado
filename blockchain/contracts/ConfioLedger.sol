// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ConfioLedger
 * @dev A secure contract for anchoring daily Merkle roots of user transactions
 * @notice This contract allows only the owner (backend) to anchor transaction batches,
 *         making the application gasless for end users while maintaining transparency
 */
contract ConfioLedger is Ownable {
    /**
     * @dev Emitted when a daily Merkle root is anchored
     * @param merkleRoot The Merkle root hash of the transaction batch
     * @param timestamp The block timestamp when the anchor was created
     * @param batchId Sequential ID for the batch (starts from 1)
     */
    event AnchorUpdated(
        bytes32 indexed merkleRoot,
        uint256 indexed timestamp,
        uint256 indexed batchId
    );

    /// @dev Counter for batch IDs
    uint256 private _batchCounter;

    /// @dev Mapping to store anchored roots with their timestamps
    mapping(bytes32 => uint256) public anchoredRoots;

    /// @dev Mapping to store batch information
    mapping(uint256 => bytes32) public batchRoots;

    /**
     * @dev Constructor that sets the deployer as the initial owner
     * @param initialOwner The address that will own the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        _batchCounter = 0;
    }

    /**
     * @dev Anchors a daily Merkle root of user transactions
     * @param merkleRoot The Merkle root hash to anchor
     * @notice Only the owner (backend) can call this function
     * @notice Prevents duplicate roots from being anchored
     */
    function anchorDailyRoot(bytes32 merkleRoot) external onlyOwner {
        require(merkleRoot != bytes32(0), "ConfioLedger: Merkle root cannot be zero");
        require(anchoredRoots[merkleRoot] == 0, "ConfioLedger: Root already anchored");

        _batchCounter++;
        uint256 timestamp = block.timestamp;

        // Store the anchored root with its timestamp
        anchoredRoots[merkleRoot] = timestamp;
        batchRoots[_batchCounter] = merkleRoot;

        emit AnchorUpdated(merkleRoot, timestamp, _batchCounter);
    }

    /**
     * @dev Returns the current batch counter
     * @return The number of batches anchored so far
     */
    function getBatchCounter() external view returns (uint256) {
        return _batchCounter;
    }

    /**
     * @dev Checks if a Merkle root has been anchored
     * @param merkleRoot The Merkle root to check
     * @return timestamp The timestamp when it was anchored (0 if not anchored)
     */
    function isRootAnchored(bytes32 merkleRoot) external view returns (uint256) {
        return anchoredRoots[merkleRoot];
    }

    /**
     * @dev Gets the Merkle root for a specific batch ID
     * @param batchId The batch ID to query
     * @return The Merkle root for that batch
     */
    function getBatchRoot(uint256 batchId) external view returns (bytes32) {
        require(batchId > 0 && batchId <= _batchCounter, "ConfioLedger: Invalid batch ID");
        return batchRoots[batchId];
    }
}
