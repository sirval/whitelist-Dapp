const { ethers } = require("hardhat");

async function main() {
  const whitelistContract = await ethers.getContractFactory("Whitelist");
  const deployedWhiteListContract = await whitelistContract.deploy(50);
  await deployedWhiteListContract.deployed();

  console.log("Whitelist contract address", deployedWhiteListContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
