import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ConfioLedgerModule", (m) => {
  // Get the deployer account as the initial owner
  const deployer = m.getAccount(0);
  
  // Deploy the ConfioLedger contract with the deployer as owner
  const confioLedger = m.contract("ConfioLedger", [deployer]);

  // Optional: Anchor a sample root for testing (remove in production)
  // const sampleRoot = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  // m.call(confioLedger, "anchorDailyRoot", [sampleRoot]);

  return { confioLedger };
});
