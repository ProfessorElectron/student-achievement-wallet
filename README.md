# Student Achievement Wallet

A student payment and achievement wallet for issuing, claiming, and verifying student certificates as NFTs. The current demo includes a React frontend, Django REST backend, MetaMask wallet connection, certificate viewing, and backend-powered verification.

### Tech Stack

* Frontend: React + Vite + TypeScript
* Backend: Django REST Framework
* Wallet: MetaMask + ethers.js
* Blockchain: Solidity + Hardhat + OpenZeppelin
* Gas sponsorship: UGF-ready authorized minter flow

## Features

* Student login and signup
* Achievement dashboard
* MetaMask connection
* Real wallet address, network, and ETH balance display
* Achievement and certificate list from Django
* Simulated NFT claim flow with token id and transaction hash
* Optional real NFT minting through the AchievementCertificateNFT contract
* Certificate PDF viewing
* Certificate code copy button
* Public certificate verification API
* Dark mode

## Project Structure

```text
frontend/   React user interface
backend/    Django REST API
contracts/  Smart contracts
docs/       Documentation
```

## Setup

Clone and install frontend dependencies:

```bash
git clone https://github.com/ProfessorElectron/student-achievement-wallet.git
cd student-achievement-wallet
npm install
```

Set up the backend:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Optional backend email config:

```bash
copy backend\.env.example backend\.env
```

Run the frontend in another terminal:

```bash
cd student-achievement-wallet
copy frontend\.env.example frontend\.env
npm run dev
```

Open the Vite URL, usually:

```text
http://localhost:5173
```

## Vercel Frontend Environment

Vercel cannot read your local `frontend/.env`, so add these in the Vercel
project settings before deploying:

```env
VITE_ENABLE_REAL_MINT=true
VITE_NFT_CONTRACT_ADDRESS=0x087dcAC90da98fBf897ff1db7B335f51BD8366Fd
VITE_API_BASE_URL=https://your-deployed-django-backend.example.com
```

For the current demo deployment, use:

```env
VITE_API_BASE_URL=https://student-achievement-wallet-backend.onrender.com
```

The Render backend must also allow the Vercel frontend origin:

```env
CORS_ALLOWED_ORIGINS=https://student-achievement-wallet-frontend.vercel.app,https://student-achievement-wall-git-79a2ea-professorelectrons-projects.vercel.app,https://student-achievement-wallet-frontend-8ojstnssd.vercel.app,http://localhost:5173
```

If `VITE_API_BASE_URL` is missing, the frontend falls back to
`http://127.0.0.1:8000`, which only works on your laptop. The deployed Vercel
site needs a deployed Django backend URL for login, achievements, certificates,
and verification API calls.

## Demo Login

```text
Email: demo@student.local
Password: demo12345
```

## 60-Second Demo Flow

```text
1. Login as Demo Student
2. Open the dashboard
3. Connect MetaMask
4. Show wallet address, network, and ETH balance
5. Open Achievements
6. Click Claim NFT
7. Open Certificates
8. View the certificate PDF
9. Copy the certificate code
10. Open Verify
11. Paste the certificate code
12. Verify authenticity
```

## Current Claim Flow

By default, the claim flow is backend-simulated so the demo stays stable:

```text
Student clicks Claim NFT
Django marks achievement as claimed
Django creates token_id and txHash
Frontend updates the card
Verifier can check certificate authenticity
```

To enable real blockchain minting, deploy the contract, put the deployed address
in `frontend/.env`, and set:

```env
VITE_ENABLE_REAL_MINT=true
VITE_NFT_CONTRACT_ADDRESS=0xYourContractAddress
```

Then restart the frontend dev server.

## Smart Contract Setup

Install dependencies from the repo root:

```bash
npm install
```

Compile the NFT contract:

```bash
npm run contracts:compile
```

Deploy locally to Hardhat's default in-memory network:

```bash
npm run contracts:deploy:local
```

For Sepolia deployment:

```bash
copy .env.example .env
```

Fill in:

```env
SEPOLIA_RPC_URL=https://...
DEPLOYER_PRIVATE_KEY=...
```

Then run:

```bash
npm run contracts:deploy:sepolia
```

The deploy script exports the contract ABI to:

```text
frontend/src/contracts/AchievementCertificateNFT.abi.json
```

## Remaining Blockchain Work

For real Web3 minting, the blockchain team needs to provide:

```text
Contract address
Contract ABI, already exported by the deploy script
Deployed network
UGF gas sponsorship configuration
```

Then the claim flow should become:

```text
Student clicks Claim NFT
UGF sponsors gas
Smart contract mints NFT
Token id and transaction hash return to frontend
Django stores token id and transaction hash
Verification checks database plus NFT ownership
```

For the immediate MetaMask demo, the frontend calls `mintOwnCertificate`, so the
connected student wallet can approve the transaction and receive the NFT.

Important: `mintCertificate` is still restricted to the contract owner or an
authorized minter. For UGF sponsorship, authorize the UGF relayer/minter address
with:

```solidity
setAuthorizedMinter(ugfRelayerAddress, true)
```

The backend is already ready to store a real mint result:

```http
POST /api/achievements/:id/record-mint/
```

Body:

```json
{
  "token_id": "123",
  "txHash": "0x..."
}
```

See `contracts/README.md` for the blockchain teammate handoff checklist.

## Git Workflow

Before starting work:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-task-name
```

After completing work:

```bash
git add .
git commit -m "Describe changes"
git push -u origin feature/your-task-name
```

Open a pull request into `main`. Do not commit directly to `main` during the hackathon.
