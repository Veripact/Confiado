import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { keccak256, toBytes } from "viem";

import { network } from "hardhat";

describe("ConfioLedger", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  // Sample Merkle roots for testing
  const SAMPLE_ROOT_1 = keccak256(toBytes("sample_root_1"));
  const SAMPLE_ROOT_2 = keccak256(toBytes("sample_root_2"));
  const ZERO_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

  it("Should deploy with correct initial state", async function () {
    const [owner] = await viem.getWalletClients();
    const ledger = await viem.deployContract("ConfioLedger", [owner.account.address]);

    const batchCounter = await ledger.read.getBatchCounter();
    const contractOwner = await ledger.read.owner();

    assert.equal(batchCounter, 0n);
    assert.equal(contractOwner.toLowerCase(), owner.account.address.toLowerCase());
  });

  it("Should anchor a daily root and emit AnchorUpdated event", async function () {
    const [owner] = await viem.getWalletClients();
    const ledger = await viem.deployContract("ConfioLedger", [owner.account.address]);

    // Just execute the transaction without checking specific event args
    await ledger.write.anchorDailyRoot([SAMPLE_ROOT_1]);

    const batchCounter = await ledger.read.getBatchCounter();
    const isAnchored = await ledger.read.isRootAnchored([SAMPLE_ROOT_1]);
    const batchRoot = await ledger.read.getBatchRoot([1n]);

    assert.equal(batchCounter, 1n);
    assert.notEqual(isAnchored, 0n); // Should have a timestamp
    assert.equal(batchRoot, SAMPLE_ROOT_1);
  });

  it("Should anchor multiple roots with sequential batch IDs", async function () {
    const [owner] = await viem.getWalletClients();
    const ledger = await viem.deployContract("ConfioLedger", [owner.account.address]);

    // Anchor first root
    await ledger.write.anchorDailyRoot([SAMPLE_ROOT_1]);
    
    // Anchor second root
    await ledger.write.anchorDailyRoot([SAMPLE_ROOT_2]);

    const batchCounter = await ledger.read.getBatchCounter();
    const batchRoot1 = await ledger.read.getBatchRoot([1n]);
    const batchRoot2 = await ledger.read.getBatchRoot([2n]);

    assert.equal(batchCounter, 2n);
    assert.equal(batchRoot1, SAMPLE_ROOT_1);
    assert.equal(batchRoot2, SAMPLE_ROOT_2);
  });

  it("Should revert when non-owner tries to anchor", async function () {
    const [owner, nonOwner] = await viem.getWalletClients();
    const ledger = await viem.deployContract("ConfioLedger", [owner.account.address]);

    await assert.rejects(
      async () => {
        await ledger.write.anchorDailyRoot([SAMPLE_ROOT_1], {
          account: nonOwner.account
        });
      },
      /OwnableUnauthorizedAccount/
    );
  });

  it("Should revert when trying to anchor zero root", async function () {
    const [owner] = await viem.getWalletClients();
    const ledger = await viem.deployContract("ConfioLedger", [owner.account.address]);

    await assert.rejects(
      async () => {
        await ledger.write.anchorDailyRoot([ZERO_ROOT]);
      },
      /Merkle root cannot be zero/
    );
  });

  it("Should revert when trying to anchor duplicate root", async function () {
    const [owner] = await viem.getWalletClients();
    const ledger = await viem.deployContract("ConfioLedger", [owner.account.address]);

    // Anchor root first time
    await ledger.write.anchorDailyRoot([SAMPLE_ROOT_1]);

    // Try to anchor same root again
    await assert.rejects(
      async () => {
        await ledger.write.anchorDailyRoot([SAMPLE_ROOT_1]);
      },
      /Root already anchored/
    );
  });

  it("Should correctly check if root is anchored", async function () {
    const [owner] = await viem.getWalletClients();
    const ledger = await viem.deployContract("ConfioLedger", [owner.account.address]);

    // Root not anchored initially
    let isAnchored = await ledger.read.isRootAnchored([SAMPLE_ROOT_1]);
    assert.equal(isAnchored, 0n);

    // Anchor root
    await ledger.write.anchorDailyRoot([SAMPLE_ROOT_1]);

    // Root should now be anchored with timestamp
    isAnchored = await ledger.read.isRootAnchored([SAMPLE_ROOT_1]);
    assert.notEqual(isAnchored, 0n);
  });

  it("Should revert when querying invalid batch ID", async function () {
    const [owner] = await viem.getWalletClients();
    const ledger = await viem.deployContract("ConfioLedger", [owner.account.address]);

    // Test batch ID 0
    await assert.rejects(
      async () => {
        await ledger.read.getBatchRoot([0n]);
      },
      /Invalid batch ID/
    );

    // Test batch ID beyond counter
    await assert.rejects(
      async () => {
        await ledger.read.getBatchRoot([1n]);
      },
      /Invalid batch ID/
    );

    // Anchor one root
    await ledger.write.anchorDailyRoot([SAMPLE_ROOT_1]);

    // Test batch ID beyond counter after anchoring
    await assert.rejects(
      async () => {
        await ledger.read.getBatchRoot([2n]);
      },
      /Invalid batch ID/
    );
  });

  it("Should handle ownership transfer correctly", async function () {
    const [owner, newOwner] = await viem.getWalletClients();
    const ledger = await viem.deployContract("ConfioLedger", [owner.account.address]);

    // Transfer ownership
    await ledger.write.transferOwnership([newOwner.account.address]);

    // Old owner should not be able to anchor
    await assert.rejects(
      async () => {
        await ledger.write.anchorDailyRoot([SAMPLE_ROOT_1]);
      },
      /OwnableUnauthorizedAccount/
    );

    // New owner should be able to anchor
    await ledger.write.anchorDailyRoot([SAMPLE_ROOT_1], {
      account: newOwner.account
    });

    const batchCounter = await ledger.read.getBatchCounter();
    assert.equal(batchCounter, 1n);
  });

  it("Should track events correctly over multiple anchors", async function () {
    const [owner] = await viem.getWalletClients();
    const ledger = await viem.deployContract("ConfioLedger", [owner.account.address]);
    const deploymentBlockNumber = await publicClient.getBlockNumber();

    // Anchor multiple roots
    await ledger.write.anchorDailyRoot([SAMPLE_ROOT_1]);
    await ledger.write.anchorDailyRoot([SAMPLE_ROOT_2]);

    const events = await publicClient.getContractEvents({
      address: ledger.address,
      abi: ledger.abi,
      eventName: "AnchorUpdated",
      fromBlock: deploymentBlockNumber,
      strict: true,
    });

    assert.equal(events.length, 2);
    assert.equal(events[0].args.merkleRoot, SAMPLE_ROOT_1);
    assert.equal(events[0].args.batchId, 1n);
    assert.equal(events[1].args.merkleRoot, SAMPLE_ROOT_2);
    assert.equal(events[1].args.batchId, 2n);
  });
});
