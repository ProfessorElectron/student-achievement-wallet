const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const AchievementCertificateNFT = await hre.ethers.getContractFactory(
    "AchievementCertificateNFT",
  );
  const contract = await AchievementCertificateNFT.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const artifact = await hre.artifacts.readArtifact("AchievementCertificateNFT");
  const abiPath = path.join(
    __dirname,
    "..",
    "..",
    "frontend",
    "src",
    "contracts",
    "AchievementCertificateNFT.abi.json",
  );

  fs.mkdirSync(path.dirname(abiPath), { recursive: true });
  fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));

  console.log(`AchievementCertificateNFT deployed to: ${address}`);
  console.log(`ABI exported to: ${abiPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
