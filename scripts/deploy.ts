import { ethers } from "hardhat";

async function main() {
  console.log("Deploying CertiChain contract...");

  const CertiChain = await ethers.getContractFactory("CertiChain");
  const certichain = await CertiChain.deploy();
  await certichain.waitForDeployment();

  const address = await certichain.getAddress();
  console.log(`CertiChain deployed to: ${address}`);
  console.log(`Ministry address (deployer): ${(await ethers.getSigners())[0].address}`);
  console.log(`\nSet NEXT_PUBLIC_CONTRACT_ADDRESS=${address} in your .env.local file`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
