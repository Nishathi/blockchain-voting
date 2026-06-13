# 🗳️ VoteChain — Blockchain Voting System

A production-ready blockchain voting system with a Node.js backend, MongoDB database, and pure HTML/CSS/JS frontend.

## 🏗️ Architecture

### Frontend
| File | Description |
|------|-------------|
| `frontend/index.html` | Complete UI — Dashboard, Register, Vote, Results, Explorer |

### Backend
| File | Description |
|------|-------------|
| `backend/server.js` | Express server entry point |
| `backend/models/voter.js` | Voter schema — wallet, keys, vote status |
| `backend/models/block.js` | Block schema — hash, nonce, vote data |
| `backend/routes/auth.js` | Register & Login API |
| `backend/routes/vote.js` | Cast vote, results, chain, validate |
| `backend/middleware/auth.js` | JWT authentication middleware |

## ✨ Features

- 🔐 Cryptographic wallet generation (Public & Private keys)
- ⛏️ Proof-of-Work mining (server-side)
- 🔗 SHA-256 hash linking between blocks
- 📊 Live vote results & turnout tracking
- 🔍 Block Explorer — inspect every block
- 🧪 Chain validation & tamper detection
- 🛡️ JWT Authentication
- 🗄️ MongoDB persistence

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|-------|------------|
| UI/UX | HTML5 + CSS3 (Dark Theme) |
| Logic | Vanilla JavaScript (ES6+) |
| Hashing | Web Crypto API (SHA-256) |
| Fonts | Google Fonts (Inter + JetBrains Mono) |

### Backend
| Layer | Technology |
|-------|------------|
| Server | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Hashing | Node.js crypto (SHA-256) |

## ⚡ Setup & Run

```bash
# 1. Clone repo
git clone https://github.com/Nishathi/blockchain-voting.git
cd blockchain-voting

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Run in development
npm run dev

# 5. Open browser
open http://localhost:5000
```

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register voter + generate wallet | ❌ |
| POST | `/api/auth/login` | Login & get JWT token | ❌ |
| POST | `/api/vote/cast` | Cast & mine vote into blockchain | ✅ |
| GET | `/api/vote/results` | Get live vote results | ❌ |
| GET | `/api/vote/chain` | Get full blockchain | ❌ |
| GET | `/api/vote/validate` | Validate chain integrity | ❌ |
| GET | `/api/health` | API health check | ❌ |

## 🧠 Blockchain Concepts Demonstrated

- **Hash Linking** — Every block contains the hash of the previous block
- **Proof of Work** — Mining requires finding a nonce with 2 leading zeros
- **Digital Signatures** — Each vote is cryptographically signed
- **Immutability** — Tampering any block breaks the entire chain
- **Transparency** — All blocks are publicly inspectable

## 📂 Project Structure

```
blockchain-voting/
├── frontend/
│   └── index.html            # Complete UI
├── backend/
│   ├── server.js             # Express entry point
│   ├── models/
│   │   ├── voter.js          # Voter schema
│   │   └── block.js          # Block schema
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   └── vote.js           # Vote routes
│   └── middleware/
│       └── auth.js           # JWT middleware
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 👩‍💻 Author

**Nishathi** — Built with ❤️ using Node.js, MongoDB & Web Crypto API

---

⭐ Star this repo if you found it useful!
