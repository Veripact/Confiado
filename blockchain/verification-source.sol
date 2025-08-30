// SPDX-License-Identifier: MIT
// Flattened source code for verification

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

import {Context} from "../utils/Context.sol";

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


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
