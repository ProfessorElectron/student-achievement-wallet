# Smart Contract Handoff

This folder contains the Achievement NFT contract and deployment notes.

## Contract

```text
contracts/contracts/AchievementCertificateNFT.sol
```

The contract uses OpenZeppelin ERC721URIStorage and mints one NFT certificate per
certificate code. Minting is restricted to the contract owner or an authorized
minter, which is the hook you need for a UGF relayer/gas sponsor.

## Commands

From the repo root:

```bash
npm run contracts:compile
npm run contracts:deploy:local
```

For Sepolia:

```bash
copy .env.example .env
```

Fill in `SEPOLIA_RPC_URL` and `DEPLOYER_PRIVATE_KEY`, then run:

```bash
npm run contracts:deploy:sepolia
```

The deploy script exports the ABI to:

```text
frontend/src/contracts/AchievementCertificateNFT.abi.json
```

## What The Frontend Needs

After deployment, send the frontend team:

```text
Contract address
Contract ABI JSON
Network name
Chain ID
Mint function name
Mint function parameters
UGF sponsorship setup/config
```

If a relayer will mint on behalf of students, the contract owner must authorize
that relayer:

```solidity
setAuthorizedMinter(ugfRelayerAddress, true)
```

## Expected Claim Flow

```text
Student clicks Claim NFT
Frontend calls UGF-sponsored mint
Contract mints certificate NFT
Frontend receives token_id and txHash
Frontend posts token_id and txHash to Django
Django stores the real blockchain result
Verifier can check certificate code, wallet address, token id, or tx hash
```

## Backend Endpoint Ready For Real Minting

Once the contract returns a real token id and transaction hash, call:

```http
POST /api/achievements/:id/record-mint/
Authorization: Bearer <student_access_token>
Content-Type: application/json
```

Body:

```json
{
  "token_id": "123",
  "txHash": "0x..."
}
```

## Suggested Solidity Contract Surface

Keep the first version simple:

```solidity
function mintCertificate(
    address student,
    string memory certificateCode,
    string memory metadataURI
) external returns (uint256 tokenId);

function verifyCertificate(uint256 tokenId, address student) external view returns (bool);
```

The frontend can adapt if the final ABI differs, but the team should document the final function signature clearly.
