// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/ConfioLedger.sol";

contract ConfioLedgerTest is Test {
    ConfioLedger public ledger;
    address public owner;
    address public nonOwner;
    
    bytes32 public constant SAMPLE_ROOT_1 = keccak256("sample_root_1");
    bytes32 public constant SAMPLE_ROOT_2 = keccak256("sample_root_2");
    bytes32 public constant ZERO_ROOT = bytes32(0);

    event AnchorUpdated(
        bytes32 indexed merkleRoot,
        uint256 indexed timestamp,
        uint256 indexed batchId
    );

    function setUp() public {
        owner = address(this);
        nonOwner = address(0x1234);
        ledger = new ConfioLedger(owner);
    }

    function test_InitialState() public {
        assertEq(ledger.getBatchCounter(), 0);
        assertEq(ledger.owner(), owner);
    }

    function test_AnchorDailyRoot() public {
        uint256 expectedBatchId = 1;
        
        vm.expectEmit(true, true, true, true);
        emit AnchorUpdated(SAMPLE_ROOT_1, block.timestamp, expectedBatchId);
        
        ledger.anchorDailyRoot(SAMPLE_ROOT_1);
        
        assertEq(ledger.getBatchCounter(), expectedBatchId);
        assertEq(ledger.isRootAnchored(SAMPLE_ROOT_1), block.timestamp);
        assertEq(ledger.getBatchRoot(expectedBatchId), SAMPLE_ROOT_1);
    }

    function test_AnchorMultipleRoots() public {
        // Anchor first root
        ledger.anchorDailyRoot(SAMPLE_ROOT_1);
        
        // Move to next block to get different timestamp
        vm.warp(block.timestamp + 1 days);
        
        // Anchor second root
        ledger.anchorDailyRoot(SAMPLE_ROOT_2);
        
        assertEq(ledger.getBatchCounter(), 2);
        assertEq(ledger.getBatchRoot(1), SAMPLE_ROOT_1);
        assertEq(ledger.getBatchRoot(2), SAMPLE_ROOT_2);
    }

    function test_RevertWhen_NonOwnerCallsAnchor() public {
        vm.prank(nonOwner);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", nonOwner));
        ledger.anchorDailyRoot(SAMPLE_ROOT_1);
    }

    function test_RevertWhen_ZeroMerkleRoot() public {
        vm.expectRevert("ConfioLedger: Merkle root cannot be zero");
        ledger.anchorDailyRoot(ZERO_ROOT);
    }

    function test_RevertWhen_DuplicateRoot() public {
        // Anchor root first time
        ledger.anchorDailyRoot(SAMPLE_ROOT_1);
        
        // Try to anchor same root again
        vm.expectRevert("ConfioLedger: Root already anchored");
        ledger.anchorDailyRoot(SAMPLE_ROOT_1);
    }

    function test_IsRootAnchored() public {
        // Root not anchored initially
        assertEq(ledger.isRootAnchored(SAMPLE_ROOT_1), 0);
        
        // Anchor root
        ledger.anchorDailyRoot(SAMPLE_ROOT_1);
        
        // Root should now be anchored with timestamp
        assertEq(ledger.isRootAnchored(SAMPLE_ROOT_1), block.timestamp);
    }

    function test_GetBatchRoot() public {
        ledger.anchorDailyRoot(SAMPLE_ROOT_1);
        
        assertEq(ledger.getBatchRoot(1), SAMPLE_ROOT_1);
    }

    function test_RevertWhen_InvalidBatchId() public {
        // Test batch ID 0
        vm.expectRevert("ConfioLedger: Invalid batch ID");
        ledger.getBatchRoot(0);
        
        // Test batch ID beyond counter
        vm.expectRevert("ConfioLedger: Invalid batch ID");
        ledger.getBatchRoot(1);
        
        // Anchor one root
        ledger.anchorDailyRoot(SAMPLE_ROOT_1);
        
        // Test batch ID beyond counter after anchoring
        vm.expectRevert("ConfioLedger: Invalid batch ID");
        ledger.getBatchRoot(2);
    }

    function testFuzz_AnchorValidRoots(bytes32 merkleRoot) public {
        vm.assume(merkleRoot != bytes32(0));
        
        uint256 initialCounter = ledger.getBatchCounter();
        
        ledger.anchorDailyRoot(merkleRoot);
        
        assertEq(ledger.getBatchCounter(), initialCounter + 1);
        assertEq(ledger.isRootAnchored(merkleRoot), block.timestamp);
        assertEq(ledger.getBatchRoot(initialCounter + 1), merkleRoot);
    }

    function test_OwnershipTransfer() public {
        address newOwner = address(0x5678);
        
        // Transfer ownership
        ledger.transferOwnership(newOwner);
        
        // Old owner should not be able to anchor
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", owner));
        ledger.anchorDailyRoot(SAMPLE_ROOT_1);
        
        // New owner should be able to anchor
        vm.prank(newOwner);
        ledger.anchorDailyRoot(SAMPLE_ROOT_1);
        
        assertEq(ledger.getBatchCounter(), 1);
    }
}
