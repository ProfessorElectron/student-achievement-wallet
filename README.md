# Student Achievement Wallet

A student payment and achievement wallet for issuing, claiming, and verifying student certificates as NFTs. The current demo includes a React frontend, Django REST backend, MetaMask wallet connection, certificate viewing, and backend-powered verification.

## Tech Stack

* Frontend: React + Vite + TypeScript
* Backend: Django REST Framework
* Wallet: MetaMask + ethers.js
* Blockchain: Solidity integration planned
* Gas sponsorship: UGF integration planned

## Features

* Student login and signup
* Achievement dashboard
* MetaMask connection
* Real wallet address, network, and ETH balance display
* Achievement and certificate list from Django
* Simulated NFT claim flow with token id and transaction hash
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

Run the frontend in another terminal:

```bash
cd student-achievement-wallet
npm run dev
```

Open the Vite URL, usually:

```text
http://localhost:5173
```

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

The current claim flow is backend-simulated:

```text
Student clicks Claim NFT
Django marks achievement as claimed
Django creates token_id and txHash
Frontend updates the card
Verifier can check certificate authenticity
```

## Remaining Blockchain Work

To turn the simulated claim into a real Web3 claim, the blockchain team needs to provide:

```text
Contract address
Contract ABI
Deployed network
mintCertificate function parameters
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
